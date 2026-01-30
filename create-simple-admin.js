const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

async function createSimpleAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Xóa user cũ nếu tồn tại
    await sequelize.query(`DELETE FROM users WHERE email = 'admin@admin.com'`);

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('123456', salt);

    await sequelize.query(`
      INSERT INTO users (name, email, password, phone, address, created_at, role_id)
      VALUES ('Admin', 'admin@admin.com', '${hashedPassword}', NULL, NULL, NOW(), 1)
    `);

    console.log('✅ Simple admin account created!');
    console.log('📧 Email: admin@admin.com');
    console.log('🔑 Password: 123456');
    console.log('👤 Role: Admin');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createSimpleAdmin();
