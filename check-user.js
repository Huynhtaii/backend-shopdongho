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

async function checkUser() {
  try {
    const [results] = await sequelize.query(
      "SELECT user_id, name, email, role_id FROM users WHERE email = 'admin01@gmail.com'"
    );
    
    console.log('User found:', JSON.stringify(results, null, 2));
    
    if (results.length === 0) {
      console.log('❌ User NOT found in database!');
    } else {
      console.log('✅ User exists with role_id:', results[0].role_id);
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUser();
