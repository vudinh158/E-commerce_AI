import { pool } from "../db.js";

export async function getOrCreateCart(userId) {
  const [[c]] = await pool.query("SELECT * FROM carts WHERE user_id=?", [userId]);
  if (c) return c;
  const [ins] = await pool.query("INSERT INTO carts (user_id) VALUES (?)", [userId]);
  return { id: ins.insertId, user_id: userId };
}
