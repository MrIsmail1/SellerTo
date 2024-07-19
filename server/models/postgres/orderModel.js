import {DataTypes} from 'sequelize';
import sequelize from '../../config/database.js';
import denormalizeOrder from "../../services/denormalization/order.js";
import OrderMongo from "../../models/mongo/orderModel.js";
import Products from "./productModel.js";
import Users from "./userModel.js";

const Orders = sequelize.define('Orders', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    orderUnique: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    quantity : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },

    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
    },

    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    paymentIntentId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Payments',
            key: 'paymentIntentId',
        },
    },
    trackingCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    hooks: {
        afterCreate: async (order, options) => {
            await denormalizeOrder({ id: order.id }, { Order: Orders, Product: Products, User: Users });
        },
        afterUpdate: async (order, options) => {
            await denormalizeOrder({ id: order.id }, { Order: Orders, Product: Products, User: Users });
        },
        afterDestroy: async (order, options) => {
            await OrderMongo.findByIdAndDelete(order.id);
        },
    },
});

export default Orders;