import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import { signToken } from "../utils/auth.js";
const r = Router();

// POST /api/auth/register
r.post("/register", async (req, res) => {
  const { full_name, email, password } = req.body;
  if (!full_name || !email || !password) return res.status(400).json({ message: "Missing fields" });
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (full_name, email, username, password_hash) VALUES (?,?,?,?)",
    [full_name, email, email, hash]
  );
  const token = signToken({ id: result.insertId, email });
  res.json({ token });
});

// POST /api/auth/login
r.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [[user]] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = signToken({ id: user.id, email: user.email });
  res.json({ token });
});

export default r;
