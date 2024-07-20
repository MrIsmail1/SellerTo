import User from "../models/postgres/userModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password", "updatedAt"],
      }, // Exclure le mot de passe des informations renvoyées
    });
    if (!user) {
      return res.status(404);
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500);
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: [
        "firstname",
        "lastname",
        "address",
        "email",
        "city",
        "postalCode",
        "country",
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user details");
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404);
    }

    await user.anonymize();
    res.clearCookie("JWT");
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

    const {
      firstname,
      lastname,
      email,
      phoneNumber,
      address,
      postalCode,
      city,
      country,
      role,
    } = req.body;
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.address = address;
    user.postalCode = postalCode;
    user.city = city;
    user.country = country;
    user.role = role;

    await user.save();
    res.status(200);
  } catch (error) {
    res.status(500);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "phoneNumber",
        "address",
        "postalCode",
        "city",
        "country",
        "isVerified",
        "role",
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500);
  }
};
export const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      role,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500);
  }
};
