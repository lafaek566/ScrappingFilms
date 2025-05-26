import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// Register user baru
export const register = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username dan password diperlukan" });

  try {
    // Cek apakah username sudah ada
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role || "user"]
    );

    res.status(201).json({ message: "User berhasil didaftarkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mendaftar user" });
  }
};

// Login user
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username dan password diperlukan" });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const user = rows[0];

    // Cek password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal login" });
  }
};
