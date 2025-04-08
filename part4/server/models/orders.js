const {DataTypes} = require("sequelize");
const sequelize = require("../config/database")
const Suppliers = require("./suppliers")
const Managers = require("./managers")
const Goods = require("./goods")

const Orders = sequelize.define("Orders", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    supplier_id: { type: DataTypes.INTEGER, allowNull: false, references: {model: Suppliers, key: "id"} },
    manager_id: { type: DataTypes.INTEGER, allowNull: false, references: {model: Managers, key: "id"}  },
    good_id: { type: DataTypes.INTEGER, allowNull: false, references: {model: Goods, key: "id"}  },
    status: {type: DataTypes.ENUM("waiting", "in_process", "completed"), defaultValue: "in_process"}
  });
  
  module.exports = Orders;