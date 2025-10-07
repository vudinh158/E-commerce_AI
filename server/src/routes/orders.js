import { Router } from "express";
import { pool } from "../db.js";
import { authRequired } from "../utils/auth.js";
const r = Router();

// POST /api/orders  (guest or customer)
r.post("/", async (req, res) => {
  const { customer_info, items, payment_method, shipping_method } = req.body || {};
  if (!customer_info || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  // tính tổng tiền tạm thời
  let total = 0;
  for (const it of items) {
    const [[pv]] = await pool.query(
      "SELECT id, COALESCE(sale_price, price) AS price FROM product_variations WHERE id=?",
      [it.product_variation_id]
    );
    if (!pv) return res.status(400).json({ message: "Invalid variation" });
    total += pv.price * (it.quantity || 1);
  }
  const [ins] = await pool.query(
    `INSERT INTO orders (user_id, status, total_amount, shipping_fee, discount_amount, customer_info)
     VALUES (NULL, 'pending', ?, 0, 0, ?)`,
    [total, JSON.stringify(customer_info)]
  );
  // order_items
  for (const it of items) {
    const [[pv]] = await pool.query(
      "SELECT id, COALESCE(sale_price, price) AS price FROM product_variations WHERE id=?",
      [it.product_variation_id]
    );
    await pool.query(
      `INSERT INTO order_items (order_id, product_variation_id, quantity, price_at_purchase, product_snapshot)
       VALUES (?,?,?,?,NULL)`,
      [ins.insertId, pv.id, it.quantity || 1, pv.price]
    );
  }
  res.status(201).json({ order_id: ins.insertId, total_amount: total, payment_method, shipping_method });
});

// (Optional) GET /api/me/orders  when logged in
r.get("/me", authRequired, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, order_number, status, total_amount, created_at FROM orders WHERE user_id=? ORDER BY id DESC",
    [req.user.id]
  );
  res.json(rows);
});

export default r;
