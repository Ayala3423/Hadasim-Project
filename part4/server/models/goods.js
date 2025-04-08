const { DataTypes } = require("sequelize");
const sequelize = require("../config/database")

const Goods = sequelize.define("Goods", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  good_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  good_price: { type: DataTypes.DOUBLE, allowNull: false },
  minimal_amount: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Goods;