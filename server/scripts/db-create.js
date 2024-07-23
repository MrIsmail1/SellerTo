import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_HOST_PORT,
  database: 'postgres'
});

const createDatabase = async () => {
  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.POSTGRES_DB}'`);
    
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${process.env.POSTGRES_DB}`);
      console.log('Database created successfully.');
    } else {
      console.log('Database already exists.');
    }
  } catch (error) {
    console.error('Error creating the database:', error);
  } finally {
    await client.end();
  }
};

createDatabase();
