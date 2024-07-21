import User from "../models/postgres/userModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"],
      },
    });
    if (!user) {
      return res.status(404);
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Échec de la récupération du profil utilisateur.",
      error,
    });
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });
    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }
    return user;
  } catch (error) {
    throw new Error("Échec de la récupération de l'utilisateur par ID.");
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
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    const updatedUser = await User.findByPk(req.params.id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Échec de la mise à jour de l'utilisateur.", error });
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
    res
      .status(500)
      .json({ message: "Échec de la récupération des utilisateurs.", error });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Échec de la création de l'utilisateur.", error });
  }
};
