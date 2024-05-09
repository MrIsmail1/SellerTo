import { Sequelize } from "sequelize";
import mongoose from "mongoose";
import 'dotenv/config';

// Sequelize connection
const sequelizeConnection = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

const sqlConnect = async () => {
  try {
    await sequelizeConnection.authenticate();
    console.log("SQL connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the SQL database:", error);
    process.exit(1);
  }
};

// MongoDB connection
const mongoConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_CONNECTION);
    console.log("MongoDB connected:", connect.connection.host);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const connectDatabases = async () => {
  await sqlConnect();
  await mongoConnect();
};

export default connectDatabases;
