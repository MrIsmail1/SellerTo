import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize-config.js';
import Product from './productModel.js';

const Cart = sequelize.define('Carts', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  reservedUntil: {
    type: DataTypes.DATE,
    defaultValue: () => new Date(Date.now() + 15 * 1000),
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

Cart.belongsTo(Product, { foreignKey: 'productId', as: 'Product' });

export default Cart;
