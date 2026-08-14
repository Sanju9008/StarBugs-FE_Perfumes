import mysql from 'mysql2/promise';

async function checkDb() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sanju@2004',
    database: 'ecommerce_db'
  });

  const [tables] = await connection.execute('SHOW TABLES');
  console.log("Tables:");
  console.log(tables);
  
  try {
    const [ordersCols] = await connection.execute('DESCRIBE orders');
    console.log("Orders table:");
    console.log(ordersCols);
  } catch(e) {}
  
  try {
    const [orderItemsCols] = await connection.execute('DESCRIBE order_items');
    console.log("Order_items table:");
    console.log(orderItemsCols);
  } catch(e) {}

  await connection.end();
}

checkDb();
