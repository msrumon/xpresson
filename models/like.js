const sequelize = require('../utils/database');

const Like = sequelize.define('Like', {}, { updatedAt: false });

module.exports = Like;
