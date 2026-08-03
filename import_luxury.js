import fs from 'fs';
import mysql from 'mysql2/promise';

async function importLuxury() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sanju@2004',
    database: 'ecommerce_db',
    multipleStatements: true
  });

  try {
    console.log("Deleting old Category 3 products...");
    await connection.execute('DELETE FROM products WHERE category_id = 3');
    
    console.log("Reading insert_luxury_perfumes.sql...");
    const sqlContent = fs.readFileSync('../insert_luxury_perfumes.sql', 'utf8');
    
    console.log("Executing SQL script...");
    await connection.query(sqlContent);
    
    console.log("Successfully imported luxury perfumes!");
  } catch (e) {
    console.error("Error executing SQL:", e);
  } finally {
    await connection.end();
  }
}

importLuxury();
