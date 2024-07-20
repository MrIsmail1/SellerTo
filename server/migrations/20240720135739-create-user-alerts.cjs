'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserAlerts', {
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      alertId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Alerts',
          key: 'id',
        },
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',
          key: 'id',
        },
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addConstraint('UserAlerts', {
      fields: ['userId', 'alertId', 'productId', 'category'],
      type: 'unique',
      name: 'unique_user_alert_product_category'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('UserAlerts', 'unique_user_alert_product_category');
    await queryInterface.dropTable('UserAlerts');
  }
};
