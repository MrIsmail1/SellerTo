// scripts/db-migrate.js
import { Sequelize } from 'sequelize';
import Umzug from 'umzug';
import path from 'path';
import sequelizeConfig from '../config/sequelize-config.js';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, '../migrations/*.js'),
  },
  context: sequelize.getQueryInterface(),
  storage: new Umzug.SequelizeStorage({ sequelize }),
  logger: console,
});

const runMigrations = async () => {
  try {
    await umzug.up();
    console.log('Migrations executed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await sequelize.close();
  }
};

runMigrations();
