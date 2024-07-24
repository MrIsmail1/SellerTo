import jwt from "jsonwebtoken";
import User from "../models/postgres/userModel.js";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.JWT; // Lire le token depuis les cookies
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in checkAuth middleware:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
