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
      return res.status(404);
    }

    await user.anonymize();
    res.clearCookie('JWT');
    res.status(200);
  } catch (error) {
    res.status(500);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404);
    }

    const { firstname, lastname, email, phoneNumber, address, postalCode, city, country } = req.body;
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.address = address;
    user.postalCode = postalCode;
    user.city = city;
    user.country = country;

    await user.save();
    res.status(200);
  } catch (error) {
    res.status(500);
  }
};

