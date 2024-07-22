import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Alerts = sequelize.define('Alerts', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false,
});

export default Alerts;