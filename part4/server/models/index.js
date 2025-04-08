const sequelize = require("../config/database");
const Goods = require("./goods");
const Manager = require("./managers");
const Orders = require("./orders");
const Suppliers = require("./suppliers");
const SupplierGoods = require("./SupplierGoods");
const Inventory = require("./inventory");

// Function to seed Inventory table from Goods table
// const seedInventoryFromGoods = async () => {
//   try {
//     await sequelize.authenticate(); // Authenticate the connection to the database
//     await sequelize.sync(); // Synchronize models with the database

//     // Fetch all goods (products) from the Goods table
//     const goods = await Goods.findAll({ attributes: ['id'] });
//     const existingInventory = await Inventory.findAll({ attributes: ['good_id'] });

//     // Create a set of existing goods in the inventory
//     const existingIds = new Set(existingInventory.map(item => item.good_id));
    
//     // Filter out goods that are already in the inventory
//     const goodsToInsert = goods.filter(good => !existingIds.has(good.id));

//     // Prepare inventory data for insertion
//     const inventoryData = goodsToInsert.map(good => ({
//       good_id: good.id,
//       minimal_amount: 0, // Initial minimal amount
//       current_amount: 0 // Initial current amount
//     }));

//     // Insert new goods into Inventory if necessary
//     if (inventoryData.length > 0) {
//       await Inventory.bulkCreate(inventoryData);
//       console.log(`✅ Added ${inventoryData.length} items to the inventory`);
//     } else {
//       console.log('ℹ️ All items are already in inventory – no new records added');
//     }

//   } catch (err) {
//     console.error('❌ Error while creating inventory:', err);
//   } finally {
//     await sequelize.close() // Close the database connection
//   }
// };

// Define relationships between models
Manager.hasMany(Orders, { foreignKey: "manager_id" });
Suppliers.hasMany(Orders, { foreignKey: "supplier_id" });

Orders.belongsTo(Suppliers, { foreignKey: "supplier_id" });
Orders.belongsTo(Goods, { foreignKey: "good_id" });

Suppliers.belongsToMany(Goods, { through: SupplierGoods, foreignKey: "supplier_id" });
Goods.belongsToMany(Suppliers, { through: SupplierGoods, foreignKey: "good_id" });

Inventory.belongsTo(Goods, { foreignKey: 'good_id' });
Goods.hasMany(Inventory, { foreignKey: 'good_id' });

SupplierGoods.belongsTo(Suppliers, { foreignKey: "supplier_id" });
Suppliers.hasMany(SupplierGoods, { foreignKey: "supplier_id" });
Goods.hasMany(SupplierGoods, { foreignKey: "good_id" });  // כל Good יכול להיות קשור למספר SupplierGoods

// Synchronize models and run seed function if this is the main module
sequelize.sync({ force: false })
  .then(() => {
    console.log("✅ Model synchronization completed");
    if (require.main === module) {
      // seedInventoryFromGoods(); // Seed the inventory if the script is executed directly
    }
  })
  .catch(err => console.error("❌ Error synchronizing models:", err));

module.exports = { sequelize, Goods, Manager, Orders, Suppliers, Inventory };