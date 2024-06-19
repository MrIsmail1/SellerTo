import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Orders = sequelize.define('Orders', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
});

export default Orders;