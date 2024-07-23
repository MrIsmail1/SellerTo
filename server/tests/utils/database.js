import sequelize from '../../config/sequelize-config';
import PromoCodes from '../../models/postgres/promoCodeModel';

export const setupDatabase = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
};

export const teardownDatabase = async () => {
  await sequelize.close();
};
