import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelizeConfig = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

export default sequelizeConfig;
