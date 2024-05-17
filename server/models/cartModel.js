import { Sequelize, DataTypes } from 'sequelize';
import Product from './productModel.js';
import User from './userModel.js';
import sequelize from '../config/database.js';

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Cart;
