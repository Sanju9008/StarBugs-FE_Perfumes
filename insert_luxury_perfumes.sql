USE ecommerce_db;

-- Luxury Perfume 1
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Oud Imperial', 'A masterful concoction of pure Cambodian oud and precious saffron threads.', 35000, 5, 3, NOW(), NOW());
SET @p1 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%209.jpg?updatedAt=1785175168441', @p1);

-- Luxury Perfume 2
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Ambergris Enigma', 'Exceptionally rare ambergris laced with warm spices and smoky incense.', 42000, 3, 3, NOW(), NOW());
SET @p2 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%208.jpg?updatedAt=1785175168350', @p2);

-- Luxury Perfume 3
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Saffron D''Or', 'Golden saffron blossoms married with rich vanilla and dark woods.', 18000, 10, 3, NOW(), NOW());
SET @p3 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%207.jpg?updatedAt=1785175168334', @p3);

-- Luxury Perfume 4
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Leather Royale', 'Exquisite Tuscan leather infused with intoxicating notes of absolute rose.', 28500, 7, 3, NOW(), NOW());
SET @p4 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%206.jpg?updatedAt=1785175168536', @p4);

-- Luxury Perfume 5
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Royal Patchouli', 'An aged patchouli essence elevated by delicate hints of white truffle.', 15000, 12, 3, NOW(), NOW());
SET @p5 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%205.jpeg?updatedAt=1785175168705', @p5);

-- Luxury Perfume 6
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Desert Rosewood', 'A luxurious harmony of Brazilian rosewood and mystical desert frankincense.', 22000, 8, 3, NOW(), NOW());
SET @p6 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%204.jpg?updatedAt=1785175168603', @p6);

-- Luxury Perfume 7
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Vetiver Absolu', 'The purest Haitian vetiver grounded in deep, earthy moss and amber.', 24500, 6, 3, NOW(), NOW());
SET @p7 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%203.jpg?updatedAt=1785175168367', @p7);

-- Luxury Perfume 8
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Celestial Musk', 'An ethereal blend of white musk, rare irises, and celestial aldehydes.', 38000, 4, 3, NOW(), NOW());
SET @p8 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2020.jpg?updatedAt=1785175168745', @p8);

-- Luxury Perfume 9
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Cardamom Majesty', 'Hand-harvested green cardamom warmed by a robust cedarwood base.', 19500, 11, 3, NOW(), NOW());
SET @p9 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%202.jpg?updatedAt=1785175168340', @p9);

-- Luxury Perfume 10
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Midnight Iris', 'Precious iris pallida root enriched with dark chocolate and labdanum.', 31000, 5, 3, NOW(), NOW());
SET @p10 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2019.jpg?updatedAt=1785175168653', @p10);

-- Luxury Perfume 11
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Noir Tonka', 'An intoxicating symphony of roasted tonka bean and bitter almond.', 16500, 14, 3, NOW(), NOW());
SET @p11 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2018.jpg?updatedAt=1785175168683', @p11);

-- Luxury Perfume 12
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Santal Suprême', 'Aged Mysore sandalwood blended flawlessly with creamy madagascar vanilla.', 27000, 9, 3, NOW(), NOW());
SET @p12 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2017.jpg?updatedAt=1785175168622', @p12);

-- Luxury Perfume 13
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Incense Mystique', 'Sacred Omani frankincense intermingling with burning myrrh and spices.', 33000, 4, 3, NOW(), NOW());
SET @p13 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2016.jpg?updatedAt=1785175168733', @p13);

-- Luxury Perfume 14
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Bergamot Privé', 'The finest Calabrian bergamot suspended in a heart of sheer jasmine.', 14000, 15, 3, NOW(), NOW());
SET @p14 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2015.jpg?updatedAt=1785175168950', @p14);

-- Luxury Perfume 15
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Majestic Oud', 'The crown jewel of fragrances featuring decades-old authentic Assam agarwood.', 44000, 2, 3, NOW(), NOW());
SET @p15 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2014.jpg?updatedAt=1785175168679', @p15);

-- Luxury Perfume 16
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Suede Éternel', 'A soft, velvety suede accord kissed by vibrant bursts of pink pepper.', 25000, 7, 3, NOW(), NOW());
SET @p16 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2013.jpg?updatedAt=1785175168671', @p16);

-- Luxury Perfume 17
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Nectar of Amber', 'A syrupy, golden amber nectar enriched with intoxicating benzoin tears.', 29000, 6, 3, NOW(), NOW());
SET @p17 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2012.jpg?updatedAt=1785175168677', @p17);

-- Luxury Perfume 18
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Majestic Tuberose', 'A fiercely elegant tuberose absolute draped in a cloak of dark leather.', 21500, 9, 3, NOW(), NOW());
SET @p18 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2011.jpg?updatedAt=1785175168655', @p18);

-- Luxury Perfume 19
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Imperial Vanilla', 'The most exquisite Tahitian vanilla pods soaked in aged cognac and oak.', 34500, 3, 3, NOW(), NOW());
SET @p19 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2015.jpg?updatedAt=1785175168950', @p19);

-- Luxury Perfume 20
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Cedarwood Élégance', 'A refined, architectural cedarwood scent softened by whispers of violet.', 17500, 13, 3, NOW(), NOW());
SET @p20 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%2010.jpg?updatedAt=1785175168702', @p20);

-- Luxury Perfume 21
INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES ('Platinum Cypress', 'A striking metallic freshness born from rare cypress and sharp juniper berries.', 26000, 8, 3, NOW(), NOW());
SET @p21 = LAST_INSERT_ID();
INSERT INTO productimages (image_url, product_id) VALUES ('https://ik.imagekit.io/StringStackAnand/Luxury%20Perfumes%20Images/image%201.jpg?updatedAt=1785175168741', @p21);
