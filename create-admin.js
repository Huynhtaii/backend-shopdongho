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

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Xóa user cũ nếu tồn tại
    await sequelize.query(`DELETE FROM users WHERE email = 'admin01@gmail.com'`);
    console.log('🗑️ Deleted old admin account if exists');

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('Admin12345!', salt);
    
    console.log('🔐 Password to use: Admin12345!');
    console.log('🔑 Hashed password:', hashedPassword);

    const [results] = await sequelize.query(`
      INSERT INTO users (name, email, password, phone, address, created_at, role_id)
      VALUES ('Admin User', 'admin01@gmail.com', '${hashedPassword}', NULL, NULL, NOW(), 1)
    `);

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email: admin01@gmail.com');
    console.log('🔑 Password: Admin12345!');
    console.log('👤 Role: Admin (role_id: 1)');
    
    // Test password
    const testPassword = 'Admin12345!';
    const isMatch = bcrypt.compareSync(testPassword, hashedPassword);
    console.log('🧪 Password test:', isMatch ? '✅ PASS' : '❌ FAIL');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
