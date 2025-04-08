const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("grocery_database", "root", "zxcqweASD123", {
    host: "localhost",
    dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Successfully connected to MySQL"))
  .catch((err) => console.error("❌ Error connecting to MySQL:", err));

module.exports = sequelize;
