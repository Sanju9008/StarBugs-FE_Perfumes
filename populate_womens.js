import fs from 'fs';
import mysql from 'mysql2/promise';

async function populateWomens() {
  console.log("Connecting to Aiven database...");
  const connection = await mysql.createConnection({
    host: 'mysql-14801aa7-starbugsdatabase.i.aivencloud.com',
    port: 11971,
    user: 'avnadmin',
    password: 'PASSWORD_REMOVED',
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Reading products.csv...");
    const productsCsv = fs.readFileSync('../products.csv', 'utf8').split('\n').slice(1);
    const imagesCsv = fs.readFileSync('../productimages.csv', 'utf8').split('\n').slice(1);
    
    let insertedCount = 0;

    for (const line of productsCsv) {
      if (!line.trim()) continue;
      
      const match = line.match(/^(\d+),"([^"]+)","([^"]+)","([^"]+)",([\d\.]+),(\d+),"([^"]+)",(\d+)$/);
      if (!match) continue;
      
      const [_, oldId, createdAt, desc, name, price, stock, updatedAt, catId] = match;
      
      if (catId === '1') {
        const [res] = await connection.execute(
          'INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [name, desc, parseFloat(price), parseInt(stock), 1]
        );
        
        const newId = res.insertId;
        
        // Find matching image
        const imgLine = imagesCsv.find(l => {
          const parts = l.split(',');
          return parts.length >= 3 && parts[parts.length - 1].trim() === oldId;
        });
        
        if (imgLine) {
          // URLs might contain commas, so we take everything between the first comma and the last comma
          const parts = imgLine.split(',');
          parts.shift(); // remove image_id
          parts.pop(); // remove product_id
          const url = parts.join(',');
          
          await connection.execute(
            'INSERT INTO productimages (image_url, product_id) VALUES (?, ?)',
            [url.trim(), newId]
          );
        }
        
        insertedCount++;
      }
    }
    console.log(`Successfully inserted ${insertedCount} Women's perfumes!`);
  } catch (error) {
    console.error("Error inserting women's perfumes:", error);
  } finally {
    await connection.end();
  }
}

populateWomens();
