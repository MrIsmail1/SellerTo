import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  // Create Payments table
  await queryInterface.createTable('Payments', {
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
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: queryInterface.sequelize.fn('now'),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: queryInterface.sequelize.fn('now'),
    },
  });

  // Create PaymentProducts table
  await queryInterface.createTable('PaymentProducts', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Payments',
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
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: queryInterface.sequelize.fn('now'),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: queryInterface.sequelize.fn('now'),
    },
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('PaymentProducts');
  await queryInterface.dropTable('Payments');
};
