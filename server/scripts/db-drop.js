import sequelizeConfig from '../config/sequelize-config.js';

const dropDatabase = async () => {
  try {
    await sequelizeConfig.drop();
    console.log('Database dropped successfully.');
  } catch (error) {
    console.error('Error dropping the database:', error);
  } finally {
    await sequelizeConfig.close();
  }
};

dropDatabase();
