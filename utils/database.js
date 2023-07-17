import { Sequelize } from 'sequelize';

export default new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false,
});
