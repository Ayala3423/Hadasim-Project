require("dotenv").config();
require("./models/index");
const express = require("express");
const cors = require("cors");
const managerRoutes = require("./routes/managerRoutes");
const suppliersRoutes = require("./routes/suppliersRoutes");
const customersRoutes = require("./routes/customersRoutes");
const sequelize = require("./config/database");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/manager", managerRoutes);
app.use("/suppliers", suppliersRoutes);
app.use("/customer", customersRoutes);

sequelize.sync().then(() => {
  app.listen(5000, () => console.log("✅ Server is running on port 5000"));
});