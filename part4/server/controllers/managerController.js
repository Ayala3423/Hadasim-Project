const { validateFields } = require("../middleware/validationMiddleware");
const { hashPassword, generateToken, comparePassword } = require("../middleware/authMiddleware");
const Managers = require("../models/managers");
const Orders = require("../models/orders");
const Suppliers = require("../models/suppliers");
const Goods = require("../models/goods");
const Inventory = require("../models/inventory");

exports.signupManager = [
  validateFields(['name', 'email', 'password']), // Validate required fields
  async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password); // Hash password before saving
      const newManager = await Managers.create({ name, email, password: hashedPassword });
      const token = generateToken(newManager.id, newManager.name); // Generate JWT token

      res.status(201).json({
        message: "Manager successfully registered",
        token,
        manager: newManager,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error registering manager", details: error.message });
    }
  }
];

exports.loginManager = [
  validateFields(['name', 'password']), // Validate required fields
  async (req, res) => {
    const { name, password } = req.body;

    try {
      const user = await Managers.findOne({ where: { name } });
      if (!user) {
        return res.status(404).json({ error: "User not found", name });
      }

      const isMatch = await comparePassword(password, user.password); // Compare password
      if (!isMatch) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      const token = generateToken(user.id, user.name); // Generate JWT token
      res.json({ message: "Login successful", token, manager: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Login failed" });
    }
  }
];

exports.createOrder = async (req, res) => {
  const { supplier_name, good_name } = req.body;
  console.log(req.body);

  try {
    const manager_id = req.user.id;

    // Check if supplier exists
    const supplier = await Suppliers.findOne({ where: { company_name: supplier_name } });
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Check if good exists
    const good = await Goods.findOne({ where: { good_name: good_name } });
    if (!good) {
      return res.status(404).json({ error: "Good not found" });
    }

    const newOrder = await Orders.create({
      supplier_id: supplier.id,
      manager_id,
      good_id: good.id,
      status: "waiting"
    });

    res.status(201).json({ message: "Order created and inventory updated", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating order or updating inventory" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    // Fetch all orders with related supplier and good data
    const orders = await Orders.findAll({
      include: [
        { model: Suppliers, attributes: ['company_name'] },
        { model: Goods, attributes: ['good_name'] }
      ]
    });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      orders: orders.map(({ id, supplier_id, manager_id, good_id, status, Supplier, Good }) => ({
        id,
        supplier_id,
        manager_id,
        good_id,
        status,
        supplier_name: Supplier?.company_name || null,
        good_name: Good?.good_name || null
      }))
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

exports.changeOrderStatus = async (req, res) => {
  const { order } = req.body;

  try {
    // Find the order to update
    const existingOrder = await Orders.findOne({
      where: {
        id: order.id,
        good_id: order.good_id,
        supplier_id: order.supplier_id
      }
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found or does not belong to you" });
    }

    existingOrder.status = "completed";
    await existingOrder.save();
    const orders = await Orders.findAll();

    
    const inventoryItem = await Inventory.findOne({ where: { good_id: good.id } });
    if (!inventoryItem) {
      const newInventoryItem = await Inventory.create({
        good_id: good.id,
        minimal_amount: 0,  
        current_amount: 1 
      });
      await newInventoryItem.save();
    }

    inventoryItem.current_amount += 1;
    await inventoryItem.save();

    return res.status(200).json({ message: "Order status updated successfully", order: orders });

  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Error updating order status" });
  }
};

exports.updateAmounts = async (req, res) => {
  const { id, minimal_amount } = req.body;
  console.log("📦 body:", req.body);

  try {
    // Find inventory item to update
    const existingInventory = await Inventory.findOne({
      where: {
        id: id
      }
    });

    if (!existingInventory) {
      return res.status(404).json({ message: "Inventory record not found" });
    }

    existingInventory.minimal_amount = minimal_amount;
    console.log(existingInventory);

    await existingInventory.save();

    return res.status(200).json({ message: "Minimal amount updated successfully", inventory: existingInventory });

  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({ error: "Error updating inventory" });
  }
};

exports.showInventory = async (req, res) => {
  console.log("showInventory called");

  try {
    const inventory = await Inventory.findAll();
    console.log("📦 body:", inventory);

    if (!inventory.length) {
      return res.status(404).json({ message: "No inventory" });
    }
    return res.status(200).json({ message: "Inventory retrieved successfully", inventory: inventory });

  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: error.message || "Error fetching inventory" });
  }
};