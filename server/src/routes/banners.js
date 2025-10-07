import { Router } from "express";
import { pool } from "../db.js";
const r = Router();

// GET /api/banners?is_active=true
r.get("/", async (req, res) => {
  const { is_active } = req.query;
  const [rows] = await pool.query(
    `SELECT id,name,image_url,link_url,display_order,start_date,end_date,is_active
     FROM banners ${is_active ? "WHERE is_active=1" : ""} ORDER BY display_order ASC, id DESC`
  );
  res.json(rows);
});
export default r;
