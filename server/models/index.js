import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import sequelizeConfig from '../config/sequelize-config.js';
import process from 'process';

const basename = path.basename(import.meta.url);
const db = {};

fs
  .readdirSync(new URL('.', import.meta.url).pathname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(async file => {
    const model = (await import(path.join(new URL('.', import.meta.url).pathname, file))).default(sequelizeConfig, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelizeConfig;
db.Sequelize = Sequelize;

export default db;
