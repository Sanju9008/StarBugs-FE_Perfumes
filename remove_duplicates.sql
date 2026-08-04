USE ecommerce_db;

-- Delete duplicate images for category 1
DELETE FROM productimages 
WHERE product_id IN (
    SELECT product_id FROM products 
    WHERE category_id = 1 
    AND product_id NOT IN (
        SELECT min_id FROM (
            SELECT MIN(product_id) as min_id FROM products WHERE category_id = 1 GROUP BY name
        ) as temp
    )
);

-- Delete duplicate products for category 1
DELETE FROM products 
WHERE category_id = 1 
AND product_id NOT IN (
    SELECT min_id FROM (
        SELECT MIN(product_id) as min_id FROM products WHERE category_id = 1 GROUP BY name
    ) as temp
);

-- Verify counts
SELECT c.category_name, COUNT(p.product_id) AS total_products 
FROM categories c 
LEFT JOIN products p ON c.category_id = p.category_id 
GROUP BY c.category_name;
