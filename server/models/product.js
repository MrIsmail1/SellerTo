const { Sequelize, FLOAT} = require("sequelize");

const connection = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
});
// Define the User schema
const productSchema = new connection.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    inches: {
        type: Number,
        required: true,
    },
    ram: {
        type: Number,
    },
    storage: {
        type: Number,
    },
    price: {
        type: Number,
        required: true,
    },
    processor: {
        type: String,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    keyboard: {
        type: String,
    },
    year: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const Product = connection.model("Product");
module.exports = Product;