import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';

export const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (user && !user.isVerified) {
      await user.destroy();
      user = null;
    }

    if (user) {
      return res.status(400);
    }

    const confirmationToken = crypto.randomBytes(20).toString('hex');
    const confirmationTokenExpires = Date.now() + 3600000; // 1 hour

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

    res.status(201).json({ message: 'User registered successfully. Please check your email to confirm.' });
  } catch (error) {
    res.status(500);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401);
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'User not verified. Please check your email to confirm your account.' });
    }

    if (user.isLocked) {
      return res.status(403).json({ message: "Compte temporairement bloqué pendant 20 minutes" });
    }

    const passwordChangeInterval = 60 * 24 * 60 * 60 * 1000; // 60 jours
    if (user.passwordChangedAt && Date.now() - user.passwordChangedAt > passwordChangeInterval) {
      return res.status(401).json({ message: 'Password expired. Please change your password.' });
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
      res.json({ message: 'Login successful', user }); // Pas besoin de renvoyer le token ici
    } else {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + 20 * 60000);
        await sendLockoutEmail(user);
      }
      await user.save();
      res.status(401).json({ message: 'Mail ou mot de passe incorrecte. Votre compte sera bloqué après 3 tentatives' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'No user with this email address' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Création de l'URL de réinitialisation
    const resetUrl = `${process.env.APP_BASE_URL_CLIENT}/resetpassword/${resetToken}`;

    // Envoi de l'email
    await sendPasswordResetEmail(user, resetUrl);

    res.status(200).json({ message: 'Email sent with reset password link' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error sending email' });
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
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('JWT');
  res.status(200).json({ message: 'Logout successful' });
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(id);

    if (!await user.matchPassword(oldPassword)) {
      return res.status(401).json({ message: 'Your old password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

  let confirmationUrl = `${process.env.APP_BASE_URL_SERVER}/auth/confirm/${user.confirmationToken}`;

  let info = await transporter.sendMail({
    from: '"Hamza Mahmood" <hamzamahmood93150@gmail.com>',
    to: user.email,
    subject: 'Please confirm your account',
    html: `Please click this link to confirm your account: <a href="${confirmationUrl}">Confirm Account</a>`,
  });
}

//Mail pour confirmer que l'email a bien été confirmé
export const confirmEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        confirmationToken: req.params.token,
        confirmationTokenExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      console.log('Invalid or expired token');
      return res.status(400).json({ message: 'Le token a expiré' });
    }

    user.isVerified = true;
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email confirmed successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming email' });
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

  let info = await transporter.sendMail({
    from: '"Hamza Mahmood" <hamzamahmood93150@gmail.com>',
    to: user.email,
    subject: 'Reset Your Password',
    html: `Please click this link to reset your password: <a href="${resetUrl}">Reset Password</a>`,
  });

  console.log(`Password reset email sent to: ${user.email}`, info.messageId);
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

  let info = await transporter.sendMail({
    from: '"Hamza Mahmood" <hamzamahmood93150@gmail.com>',
    to: user.email,
    subject: 'Compte bloqué',
    html: `Your account has been locked due to multiple failed login attempts. It will be unlocked automatically in 20 minutes.`,
  });

  console.log(`Lockout message sent to: ${user.email}`, info.messageId);
}
