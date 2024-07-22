/** @type {import('sequelize-cli').Migration} */

export const up = async (queryInterface, Sequelize) => {
  // Create Payments table
  await queryInterface.createTable('Payments', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    amount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    paymentIntentId: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    refundId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    },
  });

  // Create PaymentProducts table
  await queryInterface.createTable('PaymentProducts', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    paymentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Payments',
        key: 'id',
      },
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    amount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    refundId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    refundAmount: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    refundStatus: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    },
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('PaymentProducts');
  await queryInterface.dropTable('Payments');
};
