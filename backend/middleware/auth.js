import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  const auth_header = req.header("Authorization");
  const token = auth_header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  // Verify authorization token validity
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token not valid, authorization denied" });
  }
};
