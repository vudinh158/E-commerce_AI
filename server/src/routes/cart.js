import { Router } from "express";
import { authRequired } from "../utils/auth.js";
import { pool } from "../db.js";
import { getOrCreateCart } from "../services/cart.service.js";
const r = Router();

// GET /api/cart
r.get("/", authRequired, async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  const [items] = await pool.query(
    `SELECT ci.id, ci.quantity,
            pv.id AS variation_id, pv.sku, COALESCE(pv.sale_price, pv.price) AS price,
            p.id AS product_id, p.name, p.slug,
            (SELECT image_url FROM product_images i WHERE i.product_id=p.id ORDER BY is_thumbnail DESC,id ASC LIMIT 1) AS thumbnail
     FROM cart_items ci
     JOIN product_variations pv ON pv.id=ci.product_variation_id
     JOIN products p ON p.id=pv.product_id
     WHERE ci.cart_id=? ORDER BY ci.id DESC`, [cart.id]
  );
  res.json({ id: cart.id, items });
});

// POST /api/cart/items
r.post("/items", authRequired, async (req, res) => {
  const { product_variation_id, quantity } = req.body;
  const cart = await getOrCreateCart(req.user.id);
  // upsert
  await pool.query(
    `INSERT INTO cart_items (cart_id, product_variation_id, quantity)
     VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE quantity=quantity+VALUES(quantity)`,
    [cart.id, product_variation_id, quantity || 1]
  );
  res.status(201).json({ ok: true });
});

// PUT /api/cart/items/:itemId
r.put("/items/:id", authRequired, async (req, res) => {
  const { quantity } = req.body;
  await pool.query("UPDATE cart_items SET quantity=? WHERE id=?", [quantity, req.params.id]);
  res.json({ ok: true });
});

// DELETE /api/cart/items/:itemId
r.delete("/items/:id", authRequired, async (req, res) => {
  await pool.query("DELETE FROM cart_items WHERE id=?", [req.params.id]);
  res.json({ ok: true });
});

export default r;
