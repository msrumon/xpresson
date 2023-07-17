import sequelize from '../utils/database.js';

const Like = sequelize.define('Like', {}, { updatedAt: false });

export default Like;
