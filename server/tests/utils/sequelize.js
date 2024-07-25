import { Sequelize, DataTypes } from 'sequelize';
import { vi } from 'vitest';
import 'dotenv/config';

const mockSequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

// Mock User Model
const mockUserModel = mockSequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstname: { type: DataTypes.STRING },
  lastname: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  confirmationToken: { type: DataTypes.STRING },
  confirmationTokenExpires: { type: DataTypes.DATE },
}, {
  timestamps: true,
  hooks: {
    beforeSave: vi.fn(),
  },
});

// Mock Product Model
const mockProductModel = mockSequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT },
}, {
  timestamps: true,
});

// Mock Payment Model
const mockPaymentModel = mockSequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER },
  amount: { type: DataTypes.FLOAT },
  paymentIntentId: { type: DataTypes.STRING },
  refundId: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
}, {
  timestamps: true,
});

// Mock PaymentProduct Model
const mockPaymentProductModel = mockSequelize.define('PaymentProduct', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paymentId: { type: DataTypes.INTEGER },
  productId: { type: DataTypes.INTEGER },
  quantity: { type: DataTypes.INTEGER },
  amount: { type: DataTypes.FLOAT },
  refundId: { type: DataTypes.STRING },
  refundAmount: { type: DataTypes.FLOAT },
  refundStatus: { type: DataTypes.STRING },
}, {
  timestamps: true,
});

// Associate Models
mockPaymentModel.hasMany(mockPaymentProductModel, { foreignKey: 'paymentId' });
mockPaymentProductModel.belongsTo(mockPaymentModel, { foreignKey: 'paymentId' });
mockPaymentProductModel.belongsTo(mockProductModel, { foreignKey: 'productId' });

const findOneMock = vi.fn();
const createMock = vi.fn();
const saveMock = vi.fn();

mockUserModel.findOne = findOneMock;
mockUserModel.create = createMock;
mockUserModel.prototype.matchPassword = vi.fn();

mockPaymentModel.findOne = findOneMock;
mockPaymentModel.create = createMock;

mockPaymentProductModel.findOne = findOneMock;
mockPaymentProductModel.create = createMock;
mockPaymentProductModel.prototype.save = saveMock;

export {
  mockUserModel,
  mockProductModel,
  mockPaymentModel,
  mockPaymentProductModel,
  findOneMock,
  createMock,
  saveMock,
};
