'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      product_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      product_star_rating: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      product_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_photo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_minimum_offer_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      product_category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_best_seller: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      delivery: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      product_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
