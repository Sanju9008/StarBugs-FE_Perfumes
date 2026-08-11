import fs from 'fs';
import mysql from 'mysql2/promise';

async function populateDb() {
  console.log("Connecting to Aiven database...");
  const connection = await mysql.createConnection({
    host: 'mysql-14801aa7-starbugsdatabase.i.aivencloud.com',
    port: 11971,
    user: 'avnadmin',
    password: 'PASSWORD_REMOVED',
    database: 'defaultdb',
    multipleStatements: true,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connected successfully. Inserting categories...");
    await connection.execute("INSERT IGNORE INTO categories (category_id, category_name) VALUES (1, 'Women\\'s Perfumes')");
    await connection.execute("INSERT IGNORE INTO categories (category_id, category_name) VALUES (2, 'Men\\'s Perfumes')");
    await connection.execute("INSERT IGNORE INTO categories (category_id, category_name) VALUES (3, 'Luxury Perfumes')");

    console.log("Reading insert_perfumes.sql...");
    let perfumesSql = fs.readFileSync('../insert_perfumes.sql', 'utf8');
    perfumesSql = perfumesSql.replace(/USE\s+ecommerce_db;/g, '');
    
    console.log("Executing insert_perfumes.sql...");
    await connection.query(perfumesSql);

    console.log("Reading insert_luxury_perfumes.sql...");
    let luxurySql = fs.readFileSync('../insert_luxury_perfumes.sql', 'utf8');
    luxurySql = luxurySql.replace(/USE\s+ecommerce_db;/g, '');
    
    console.log("Executing insert_luxury_perfumes.sql...");
    await connection.query(luxurySql);

    console.log("All data successfully inserted into the production database!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await connection.end();
  }
}

populateDb();
