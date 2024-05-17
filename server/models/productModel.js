import { Sequelize, DataTypes } from "sequelize";
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    product_star_rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    product_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_photo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_minimum_offer_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    product_category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_best_seller: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    delivery: {
        type: DataTypes.STRING,
        allowNull: true,
    },
     product_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
    timestamps: true
});

export default Product;
