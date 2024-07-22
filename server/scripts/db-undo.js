// scripts/db-undo.js
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

const undoMigrations = async () => {
  try {
    await umzug.down();
    console.log('Migrations undone successfully.');
  } catch (error) {
    console.error('Error undoing migrations:', error);
  } finally {
    await sequelize.close();
  }
};

undoMigrations();
