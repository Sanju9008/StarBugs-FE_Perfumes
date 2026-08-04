USE ecommerce_db;

-- Perfume 1
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Midnight Oud', 'A deep, mysterious blend of agarwood and spicy leather notes.', 4500, 42, 2, NOW(), NOW());
SET @p1 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfume1.webp', @p1);

-- Perfume 2
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Oceanic Breeze', 'A fresh aquatic scent with hints of citrus and sea salt.', 3200, 75, 2, NOW(), NOW());
SET @p2 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfume2.webp', @p2);

-- Perfume 3
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Amber Wood', 'Rich amber complemented by warm, woody undertones.', 5600, 23, 2, NOW(), NOW());
SET @p3 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfume3.webp', @p3);

-- Perfume 4
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Velvet Vetiver', 'Earthy vetiver mixed with subtle floral and smoky notes.', 4800, 15, 2, NOW(), NOW());
SET @p4 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume4.webp', @p4);

-- Perfume 5
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Spice & Leather', 'A daring combination of exotic spices and rugged leather.', 3900, 60, 2, NOW(), NOW());
SET @p5 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume5.webp', @p5);

-- Perfume 6
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Obsidian Night', 'An intense, dark fragrance featuring notes of black pepper and tonka bean.', 6500, 12, 2, NOW(), NOW());
SET @p6 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume6.webp', @p6);

-- Perfume 7
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Bergamot Splash', 'A zesty and refreshing burst of Italian bergamot and neroli.', 2800, 85, 2, NOW(), NOW());
SET @p7 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume7.webp', @p7);

-- Perfume 8
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Tobacco Vanilla', 'A luxurious blend of sweet vanilla and robust tobacco leaves.', 7200, 18, 2, NOW(), NOW());
SET @p8 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume8.webp', @p8);

-- Perfume 9
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Silver Musk', 'A clean, sophisticated musk with a touch of silver fir.', 4100, 50, 2, NOW(), NOW());
SET @p9 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume9.webp', @p9);

-- Perfume 10
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Cedar Noir', 'Deep cedarwood enhanced by mysterious dark spices.', 3500, 34, 2, NOW(), NOW());
SET @p10 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume10.webp', @p10);

-- Perfume 11
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Wild Sandalwood', 'Pure sandalwood essence with a wild, untamed edge.', 5100, 29, 2, NOW(), NOW());
SET @p11 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume11.webp', @p11);

-- Perfume 12
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Azure Coast', 'Invigorating marine notes capturing the essence of the Mediterranean.', 3400, 66, 2, NOW(), NOW());
SET @p12 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume12.webp', @p12);

-- Perfume 13
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Crimson Spice', 'A fiery mix of red spices and warm cinnamon.', 4300, 41, 2, NOW(), NOW());
SET @p13 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume13.webp', @p13);

-- Perfume 14
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Golden Amber', 'Luminous amber with a golden, honeyed finish.', 5900, 22, 2, NOW(), NOW());
SET @p14 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume14.webp', @p14);

-- Perfume 15
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Dark Patchouli', 'Earthy and rich patchouli with a hint of dark chocolate.', 4700, 31, 2, NOW(), NOW());
SET @p15 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume15.webp', @p15);

-- Perfume 16
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Fresh Cypress', 'Crisp green cypress leaves blended with morning dew.', 2900, 80, 2, NOW(), NOW());
SET @p16 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume16.webp', @p16);

-- Perfume 17
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Black Cardamom', 'Spicy black cardamom over a base of smooth woods.', 5400, 27, 2, NOW(), NOW());
SET @p17 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume17.webp', @p17);

-- Perfume 18
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Royal Oak', 'Majestic oakmoss and rich earthy tones for the distinguished gentleman.', 6100, 19, 2, NOW(), NOW());
SET @p18 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume18.webp', @p18);

-- Perfume 19
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Citrus Woods', 'Bright citrus notes grounded by a solid woody base.', 3100, 71, 2, NOW(), NOW());
SET @p19 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume19.webp', @p19);

-- Perfume 20
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Phantom Leather', 'A smooth, elusive leather scent with a touch of modern elegance.', 6800, 14, 2, NOW(), NOW());
SET @p20 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackKishore/perfumes/perfume20.webp', @p20);
