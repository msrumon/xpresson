const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

const Post = sequelize.define('Post', {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = Post;
