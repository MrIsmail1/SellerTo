import User from '../models/userModel.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Exclure le mot de passe des informations renvoyées
    });
    if (!user) {
      return res.status(404);
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500);
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.anonymize();
    res.clearCookie('JWT');
    res.status(200).json({ message: 'User account deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
