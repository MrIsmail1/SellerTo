import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import User from './userModel.js';
import Product from './productModel.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  refundId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

const PaymentProduct = sequelize.define('PaymentProduct', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  paymentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Payment,
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  refundId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refundAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  refundStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Payment.hasMany(PaymentProduct, { foreignKey: 'paymentId' });
PaymentProduct.belongsTo(Payment, { foreignKey: 'paymentId' });

export { Payment, PaymentProduct };
