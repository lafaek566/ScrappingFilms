import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses hanya untuk admin" });
  }
  next();
};
