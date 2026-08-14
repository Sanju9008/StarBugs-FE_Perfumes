import fs from 'fs';
import mysql from 'mysql2/promise';

async function fixDb() {
  const sqlContent = fs.readFileSync('../insert_luxury_perfumes.sql', 'utf8');
  
  // Parse products and images
  const products = [];
  const lines = sqlContent.split('\n');
  let currentProduct = null;
  let currentVar = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('INSERT INTO products')) {
      // Extract name
      const nameMatch = line.match(/VALUES\s*\(\s*'([^']+)'/i);
      if (nameMatch) {
        currentProduct = { name: nameMatch[1], url: null };
      }
    } else if (line.startsWith('SET @')) {
        currentVar = line.match(/SET (@p\d+)/)[1];
    } else if (line.startsWith('INSERT INTO productimages')) {
      const urlMatch = line.match(/VALUES\s*\(\s*'([^']+)'/i);
      if (urlMatch && currentProduct) {
        currentProduct.url = urlMatch[1];
        products.push(currentProduct);
        currentProduct = null;
      }
    }
  }

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sanju@2004',
    database: 'ecommerce_db'
  });

  console.log(`Found ${products.length} mappings in SQL file.`);
  
  let updatedCount = 0;
  for (const prod of products) {
    // find product id
    const [rows] = await connection.execute('SELECT product_id FROM products WHERE name = ? AND category_id = 3', [prod.name]);
    if (rows.length > 0) {
      const productId = rows[0].product_id;
      // update image
      await connection.execute('UPDATE productimages SET image_url = ? WHERE product_id = ?', [prod.url, productId]);
      updatedCount++;
    }
  }

  console.log(`Successfully updated images for ${updatedCount} luxury products!`);
  await connection.end();
}

fixDb();
