import sequelizeConfig from '../config/sequelize-config.js';
import mongoose from 'mongoose';
import 'dotenv/config';

const sqlConnect = async () => {
  try {
    await sequelizeConfig.authenticate();
    console.log('SQL connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the SQL database:', error);
    process.exit(1);
  }
};

const mongoConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_CONNECTION);
    console.log('MongoDB connected:', connect.connection.host);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const connectDatabases = async () => {
  await sqlConnect();
  await mongoConnect();
};

export default connectDatabases;
