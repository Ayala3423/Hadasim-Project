const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Suppliers = require("./suppliers")
const Goods = require("./goods")

const SupplierGoods = sequelize.define("SupplierGoods", {
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Suppliers,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    good_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Goods,
            key: "id"
        },
        onDelete: "CASCADE"
    }
});

module.exports = SupplierGoods;