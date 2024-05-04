/* import { Sequelize } from "sequelize";

const connection = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

connection.authenticate().then(() => {
  console.log("Database connection has been established successfully.");
});

export default connection; */

import mongoose from "mongoose";
import 'dotenv/config';

const connectDb = async () => {
    console.log(process.env.CONNECTION_STRING);
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(
            "Database connected: ",
            connect.connection.host,
            connect.connection.name
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

export default connectDb;
