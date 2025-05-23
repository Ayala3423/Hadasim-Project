const {DataTypes} = require("sequelize");
const sequelize = require("../config/database")

const Managers = sequelize.define("Managers", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  });
  
  module.exports = Managers;