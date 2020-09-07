const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = require('../utils/database');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: {
    type: DataTypes.STRING,
    allowNul: false,
    set(value) {
      this.setDataValue('password', bcrypt.hashSync(value, 12));
    },
  },
});

User.prototype.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
