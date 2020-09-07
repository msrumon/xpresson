const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

const Comment = sequelize.define('Comment', {
  text: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Comment;
