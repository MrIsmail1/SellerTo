import User from '../models/postgres/userModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import {sendConfirmationEmail, sendLockoutEmail, sendPasswordResetEmail} from "../services/mailer/mailService.js";

export const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (user && !user.isVerified) {
      if (user.firstname === 'Anonyme' && user.lastname === 'Utilisateur') {
        await user.destroy();
        user = null;
      } else {
        return res.sendStatus(400);
      }
    }

    const confirmationToken = crypto.randomBytes(20).toString('hex');
    const confirmationTokenExpires = Date.now() + 3600000; // 1 heure

    user = await User.create({
      firstname,
      lastname,
      email,
      password,
      confirmationToken,
      confirmationTokenExpires,
      isVerified: false,
    });

    await sendConfirmationEmail(user);

    res.status(201).json({ message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.' });
  } catch (error) {
    res.sendStatus(500);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.sendStatus(401);
    }

    if (!user.isVerified) {
      return res.sendStatus(401);
    }

    if (user.isLocked) {
      return res.sendStatus(403);
    }

    const passwordChangeInterval = 60 * 24 * 60 * 60 * 1000; // 60 jours
    if (user.passwordChangedAt && Date.now() - user.passwordChangedAt > passwordChangeInterval) {
      return res.sendStatus(401);
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
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.sendStatus(404);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const resetUrl = `${process.env.APP_BASE_URL_CLIENT}/resetpassword/${resetToken}`;
    await sendPasswordResetEmail(user, resetUrl);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpire: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const logout = (req, res) => {
  res.clearCookie('JWT');
  res.sendStatus(200);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(id);

    if (!await user.matchPassword(oldPassword)) {
      return res.sendStatus(401);
    }

    user.password = newPassword;
    await user.save();
    res.clearCookie('JWT');
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};


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

    res.status(200).send(`
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: white;
            color: #333;
            text-align: center;
            padding: 50px;
          }
          .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
          }
          h1 {
            color: #333;
          }
          p {
            font-size: 1.2em;
          }
          a {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: black;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          }
          a:hover {
            background-color: black;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Email confirmé avec succès</h1>
          <p>Votre email a été confirmé avec succès. Vous pouvez maintenant vous connecter.</p>
          <a href="${process.env.APP_BASE_URL_CLIENT}/login">Se connecter</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.sendStatus(500);
  }
};

