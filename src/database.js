import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';
import dotenv from 'dotenv';

// fileURLToPath() and dirname() are used to get the directory name of the current module as ES6 modules don't have access to __dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
import Sequelize from 'sequelize';

// Database configuration
console.log("DB name: "+process.env.DB_NAME);
const dbConfig = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    dialect: 'mysql'
  };

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig);

// Define the BabyName model
const BabyName = sequelize.define('BabyName', {
    name: {
      type: Sequelize.STRING,
      allowNull: false // Name cannot be null
    },
    sex: {
      type: Sequelize.STRING,
      allowNull: false // Sex cannot be null
    }
  });

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error));


  // This creates the table in the database if it doesn't already exist
  // You can also use force: true to drop and recreate the table (use with caution)
  await BabyName.sync();


export default sequelize;