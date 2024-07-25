import { DataTypes } from 'sequelize';
import sequelize from "../../config/sequelize-config.js";

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