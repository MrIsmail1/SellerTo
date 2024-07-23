import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('Orders', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderUnique: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Payments',
        key: 'paymentIntentId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    trackingCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
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
  await queryInterface.dropTable('Orders');
};
