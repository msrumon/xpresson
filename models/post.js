import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';

const Post = sequelize.define('Post', {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
});

export default Post;
