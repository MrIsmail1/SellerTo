import jwt from "jsonwebtoken";
import User from "../models/postgres/userModel.js";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.JWT;
    if (!token) {
      return res.status(401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401);
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
  }
};
