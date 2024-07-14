'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_title: {
        type: Sequelize.STRING,
        allowNull: true,
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
        allowNull: true,
      },
      product_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      product_minimum_offer_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      product_category: {
        type: Sequelize.STRING,
        allowNull: true,
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
        allowNull: true,
        defaultValue: 0,
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      itemModelNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      operatingSystem: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      computerHardwarePlatform: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      keyboardDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      processorBrand: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      typeOfProcessor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      speedOfProcessor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      numberOfHearts: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sizeRam: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sizeSsd: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      typeOfStorage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sizeScreen: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gpu: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gpuRam: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      connectivityType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      wirelessTechnologyType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      computerHardwareInterface: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      connectorType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      softwareIncluded: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      itemDimensionsLxWxH: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      weight: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resolution: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      series: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      keyboardAndLanguage: {
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};
