import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  // Verify authorization token validity
  const decode = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (error, user) => {
      if (error)
        return res
          .status(401)
          .json({ error: "Token not valid, authorization denied" });
      req.user = user;
      next();
    }
  );
};
