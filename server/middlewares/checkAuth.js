import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
  const token = req.cookies.JWT;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie("JWT");
    return res.status(401).json({ message: "Invalid token" });
  }
};