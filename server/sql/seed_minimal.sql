-- chỉ là seed nhanh để FE chạy thử
INSERT INTO brands (name, slug) VALUES ('Dell','dell') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories (name, slug) VALUES ('Laptop', 'laptop') ON DUPLICATE KEY UPDATE name=name;

INSERT INTO products (name, slug, description, brand_id, category_id, status, rating_average, review_count, sold_count)
VALUES ('Dell XPS 13 2024', 'dell-xps-13-2024', 'Ultrabook cao cấp', 
        (SELECT id FROM brands WHERE slug='dell'),
        (SELECT id FROM categories WHERE slug='laptop'),
        'published', 4.8, 120, 523)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO product_variations (product_id, sku, price, sale_price, stock_quantity, is_default)
SELECT p.id, 'XPS13-16-512', 35000000, 31900000, 10, 1 FROM products p WHERE p.slug='dell-xps-13-2024'
ON DUPLICATE KEY UPDATE price=VALUES(price), sale_price=VALUES(sale_price);

INSERT INTO product_images (product_id, image_url, alt_text, is_thumbnail)
SELECT p.id, 'https://picsum.photos/seed/xps/800/800', 'xps', 1 FROM products p WHERE p.slug='dell-xps-13-2024'
ON DUPLICATE KEY UPDATE image_url=VALUES(image_url);

INSERT INTO banners (name,image_url,link_url,display_order,start_date,end_date,is_active)
VALUES ('Big Sale','https://picsum.photos/seed/banner/1200/400','/products',1,NOW(),DATE_ADD(NOW(), INTERVAL 30 DAY),1);
