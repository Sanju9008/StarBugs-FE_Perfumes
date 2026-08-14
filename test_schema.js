import mysql from 'mysql2/promise';

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sanju@2004',
    database: 'ecommerce_db'
  });

  const [tables] = await connection.query('SHOW TABLES');
  console.log("Tables:");
  console.log(tables);
  
  try {
      const [cartCols] = await connection.query('DESCRIBE cart');
      console.log("Cart table columns:");
      console.log(cartCols);
  } catch (e) {
      console.log("No cart table found.");
  }
  
  try {
      const [cartItemsCols] = await connection.query('DESCRIBE cart_items');
      console.log("cart_items table columns:");
      console.log(cartItemsCols);
  } catch (e) {
      console.log("No cart_items table found.");
  }

  await connection.end();
}

checkSchema();
