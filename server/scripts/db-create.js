// scripts/db-create.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const createDatabase = async () => {
  try {
    await sequelize.query(`CREATE DATABASE ${sequelize.getDatabaseName()}`);
    console.log('Database created successfully.');
  } catch (error) {
    console.error('Error creating the database:', error);
  } finally {
    await sequelize.close();
  }
};

createDatabase();
