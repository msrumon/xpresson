import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';

const Comment = sequelize.define('Comment', {
  text: { type: DataTypes.STRING, allowNull: false },
});

export default Comment;
