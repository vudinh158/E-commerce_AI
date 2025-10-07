import { Router } from "express";
import { pool } from "../db.js";
import { listProducts, getProductBySlug } from "../services/products.service.js";
const r = Router();

// GET /api/products
r.get("/", async (req, res) => {
  const data = await listProducts({
    q: req.query.q,
    brand: req.query.brand,
    category: req.query.category,
    tag: req.query.tag,
    sort: req.query.sort,
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 12)
  });
  res.json(data);
});

// GET /api/products/:slug (detail)
r.get("/:slug", async (req, res) => {
  const product = await getProductBySlug(req.params.slug);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
});

export default r;
