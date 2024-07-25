import User from "../models/postgres/userModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"],
      },
    });
    if (!user) {
      return res.sendStatus(404);
    }
    res.status(200).json(user);
  } catch (error) {
    res.sendStatus(500);
  }
};

// TODO: Exclure plus de champs
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ["password"],
      },
    });
    if (!user) {
      return res.sendStatus(404);
    }
    res.status(200).json(user);
  } catch (error) {
    res.sendStatus(500);
  }
};

// TODO: Exclure plus de champs
export const getUserByIdDiff = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"],
      },
    });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return user;
  } catch (error) {
    console.error('Échec de la récupération de l\'utilisateur par ID:', error);
    throw error;
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.sendStatus(404);
    }

    await user.anonymize();
    res.clearCookie("JWT");
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (!updated) {
      return res.sendStatus(404);
    }
    const updatedUser = await User.findByPk(req.params.id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.sendStatus(400);
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const allowedFields = [
      "id",
      "firstname",
      "lastname",
      "email",
      "address",
      "country",
      "phoneNumber",
      "postalCode",
      "city",
      "phoneNumber",
    ];

    const updateData = {};
    for (let key in req.body) {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    }

    const [updated] = await User.update(updateData, {
      where: { id: updateData.id },
      returning: true,
    });

    if (!updated) {
      return res.sendStatus(404);
    }

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
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
    res.sendStatus(500);
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.sendStatus(400);
  }
};
