const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Inventory = sequelize.define("Inventory", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  good_id: { type: DataTypes.INTEGER, allowNull: false },
  minimal_amount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  current_amount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, {
  tableName: "Inventory", 
  freezeTableName: true 
});

module.exports = Inventory;