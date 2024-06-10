import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Tracking = sequelize.define('Tracking', {
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

export default Tracking;
