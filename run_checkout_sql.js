import mysql from 'mysql2/promise';

async function executeSql() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sanju@2004',
    database: 'ecommerce_db',
    multipleStatements: true
  });

  const sql = `
    CREATE TABLE IF NOT EXISTS addresses (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(50) NOT NULL,
        street_address VARCHAR(500) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        pincode VARCHAR(20) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payments (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        user_id BIGINT NOT NULL,
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        razorpay_signature VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `;

  try {
    await connection.query(sql);
    console.log('Successfully created addresses and payments tables.');
    
    // Add address_id to orders table
    try {
        await connection.query('ALTER TABLE orders ADD COLUMN address_id BIGINT');
        await connection.query('ALTER TABLE orders ADD CONSTRAINT fk_order_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL');
        console.log('Successfully added address_id to orders table.');
    } catch (e) {
        // Might already exist
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('Column address_id already exists in orders table.');
        } else {
            console.error('Error altering orders table:', e);
        }
    }
  } catch (error) {
    console.error('Failed to create tables:', error);
  } finally {
    await connection.end();
  }
}

executeSql();
