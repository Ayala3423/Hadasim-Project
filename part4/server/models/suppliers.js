const {DataTypes} = require("sequelize");
const sequelize = require("../config/database")

const Suppliers = sequelize.define("Suppliers", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    company_name: { type: DataTypes.STRING, allowNull: false, unique: true },
    representative_name: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  });
  
  module.exports = Suppliers;