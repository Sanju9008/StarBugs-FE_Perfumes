import mysql from 'mysql2/promise';

async function checkDb() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sanju@2004',
    database: 'ecommerce_db'
  });

  const [rows2] = await connection.execute(
    'SELECT p.product_id, p.name, pi.image_url FROM products p LEFT JOIN productimages pi ON p.product_id = pi.product_id WHERE p.category_id = 2 LIMIT 3'
  );
  
  const [rows3] = await connection.execute(
    'SELECT p.product_id, p.name, pi.image_url FROM products p LEFT JOIN productimages pi ON p.product_id = pi.product_id WHERE p.category_id = 3 LIMIT 3'
  );

  console.log("Men's Perfumes (Category 2):");
  console.log(rows2);
  
  console.log("Luxury Perfumes (Category 3):");
  console.log(rows3);
  
  await connection.end();
}

checkDb();
