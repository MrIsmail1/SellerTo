import User from '../models/postgres/userModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

export const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({ where: { email } });

    if (user && !user.isVerified) {
      if (user.firstname === 'Anonyme' && user.lastname === 'Utilisateur') {
        await user.destroy();
        user = null;
      } else {
        return res.status(400).json({ message: 'Utilisateur déjà existant ' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(20).toString('hex');
    const confirmationTokenExpires = Date.now() + 3600000; // 1 heure

    user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      confirmationToken,
      confirmationTokenExpires,
      isVerified: false,
    });

    await sendConfirmationEmail(user);

    res.status(201).json({ message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.' });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Utilisateur non vérifié. Veuillez vérifier votre email pour confirmer votre compte.' });
    }

    if (user.isLocked) {
      return res.status(403).json({ message: "Compte temporairement bloqué pendant 20 minutes" });
    }

    const passwordChangeInterval = 60 * 24 * 60 * 60 * 1000; // 60 jours
    if (user.passwordChangedAt && Date.now() - user.passwordChangedAt > passwordChangeInterval) {
      return res.status(401).json({ message: 'Mot de passe expiré. Veuillez changer votre mot de passe.' });
    }

    if (await user.matchPassword(password)) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
      const token = generateToken(user.id);
      res.cookie('JWT', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.json({ message: 'Connexion réussie', user });
    } else {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + 20 * 60000);
        await sendLockoutEmail(user);
      }
      await user.save();
      res.status(401).json({ message: 'Email ou mot de passe incorrect. Votre compte sera bloqué après 3 tentatives.' });
    }
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cette adresse email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Création de l'URL de réinitialisation
    const resetUrl = `${process.env.APP_BASE_URL_CLIENT}/resetpassword/${resetToken}`;

    // Envoi de l'email
    await sendPasswordResetEmail(user, resetUrl);

    res.status(200).json({ message: 'Email envoyé avec le lien de réinitialisation du mot de passe' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
  }
};

export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpire: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('JWT');
  res.status(200).json({ message: 'Déconnexion réussie' });
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (!await user.matchPassword(oldPassword)) {
      return res.status(401).json({ message: 'Votre ancien mot de passe est incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.clearCookie('JWT');
    res.status(200).json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Mail pour register
async function sendConfirmationEmail(user) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let confirmationUrl = `${process.env.APP_BASE_URL_SERVER}/api/auth/confirm/${user.confirmationToken}`;

  await transporter.sendMail({
    from: '"SellerTo" <no-reply@sellerto.com>',
    to: user.email,
    subject: 'Veuillez confirmer votre compte',
    html: `Veuillez cliquer sur ce lien pour confirmer votre compte : <a href="${confirmationUrl}">Confirmer le compte</a>`,
  });
}

// Mail pour confirmer que l'email a bien été confirmé
export const confirmEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        confirmationToken: req.params.token,
        confirmationTokenExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      console.log('Token invalide ou expiré');
      return res.status(400).json({ message: 'Le token a expiré' });
    }

    user.isVerified = true;
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email confirmé avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    console.error('Error in confirmEmail:', error);
    res.status(500).json({ message: 'Erreur lors de la confirmation de l\'email' });
  }
};

// Mail pour reset le password
async function sendPasswordResetEmail(user, resetUrl) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"SellerTo" <no-reply@sellerto.com>',
    to: user.email,
    subject: 'Réinitialisez votre mot de passe',
    html: `Veuillez cliquer sur ce lien pour réinitialiser votre mot de passe : <a href="${resetUrl}">Réinitialiser le mot de passe</a>`,
  });

  console.log(`Email de réinitialisation du mot de passe envoyé à : ${user.email}`);
}

// Mail pour bloquer le compte
async function sendLockoutEmail(user) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"SellerTo" <no-reply@sellerto.com>',
    to: user.email,
    subject: 'Compte bloqué',
    html: `Votre compte a été bloqué en raison de multiples tentatives de connexion échouées. Il sera automatiquement débloqué dans 20 minutes.`,
  });

  console.log(`Message de verrouillage envoyé à : ${user.email}`);
}
