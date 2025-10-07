import { Router } from "express";
import { pool } from "../db.js";
import { authRequired } from "../utils/auth.js";
const r = Router();

// GET /api/me
r.get("/", authRequired, async (req, res) => {
  const [[u]] = await pool.query(
    "SELECT id, full_name, email, phone, profile_data FROM users WHERE id=?",
    [req.user.id]
  );
  res.json(u);
});

// PUT /api/me
r.put("/", authRequired, async (req, res) => {
  const { full_name, phone, profile_data } = req.body || {};
  await pool.query(
    "UPDATE users SET full_name=COALESCE(?, full_name), phone=COALESCE(?, phone), profile_data=COALESCE(?, profile_data) WHERE id=?",
    [full_name ?? null, phone ?? null, profile_data ? JSON.stringify(profile_data) : null, req.user.id]
  );
  res.json({ ok: true });
});

export default r;
