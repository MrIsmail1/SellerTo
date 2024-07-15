import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Images = sequelize.define("Images", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  format: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Products",
      key: "id",
    },
    allowNull: false,
  },
});

export default Images;
