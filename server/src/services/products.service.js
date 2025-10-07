import { pool } from "../db.js";

export async function listProducts({ q, brand, category, tag, sort, page=1, limit=12 }) {
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];

  if (q) { where.push("(p.name LIKE ? OR p.description LIKE ?)"); params.push(`%${q}%`, `%${q}%`); }
  if (brand) { where.push("b.slug = ?"); params.push(brand); }
  if (category) { where.push("c.slug = ?"); params.push(category); }
  if (tag) { where.push("t.slug = ?"); params.push(tag); }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  let orderBy = "p.created_at DESC";
  if (sort === "price_desc") orderBy = "COALESCE(pv.sale_price, pv.price) DESC";
  if (sort === "price_asc")  orderBy = "COALESCE(pv.sale_price, pv.price) ASC";
  if (sort === "top_selling") orderBy = "p.sold_count DESC";

  const [rows] = await pool.query(
    `
    SELECT p.id, p.name, p.slug, p.rating_average, p.review_count,
           MIN(COALESCE(pv.sale_price, pv.price)) AS min_price,
           MAX(COALESCE(pv.sale_price, pv.price)) AS max_price,
           (SELECT image_url FROM product_images i WHERE i.product_id=p.id ORDER BY is_thumbnail DESC, id ASC LIMIT 1) AS thumbnail
    FROM products p
    LEFT JOIN brands b ON p.brand_id=b.id
    LEFT JOIN categories c ON p.category_id=c.id
    LEFT JOIN product_tags pt ON pt.product_id=p.id
    LEFT JOIN tags t ON t.id=pt.tag_id
    LEFT JOIN product_variations pv ON pv.product_id=p.id
    ${whereSql}
    GROUP BY p.id
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
    `,
    [...params, Number(limit), Number(offset)]
  );

  const [[{ total }]] = await pool.query(
    `
    SELECT COUNT(DISTINCT p.id) AS total
    FROM products p
    LEFT JOIN brands b ON p.brand_id=b.id
    LEFT JOIN categories c ON p.category_id=c.id
    LEFT JOIN product_tags pt ON pt.product_id=p.id
    LEFT JOIN tags t ON t.id=pt.tag_id
    ${whereSql}
    `, params
  );
  return { items: rows, total, page: Number(page), limit: Number(limit) };
}

export async function getProductBySlug(slug) {
  const [[p]] = await pool.query(
    `SELECT p.*, b.name AS brand_name, c.name AS category_name
     FROM products p
     LEFT JOIN brands b ON p.brand_id=b.id
     LEFT JOIN categories c ON p.category_id=c.id
     WHERE p.slug=? LIMIT 1`, [slug]
  );
  if (!p) return null;

  const [images] = await pool.query(
    "SELECT id,image_url,alt_text,is_thumbnail FROM product_images WHERE product_id=? ORDER BY is_thumbnail DESC,id ASC",
    [p.id]
  );
  const [variations] = await pool.query(
    `SELECT id, sku, price, sale_price, stock_quantity, is_default
     FROM product_variations WHERE product_id=? ORDER BY is_default DESC, id ASC`, [p.id]
  );
  return { ...p, images, variations };
}
