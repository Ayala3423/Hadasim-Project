const { validateFields } = require("../middleware/validationMiddleware");
const { hashPassword, generateToken, comparePassword } = require("../middleware/authMiddleware");
const Suppliers = require("../models/suppliers");
const Orders = require("../models/orders");
const Goods = require("../models/goods");
const SupplierGoods = require("../models/SupplierGoods");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Supplier registration
exports.signupSupplier = [
  validateFields(['company_name', 'phone_number', 'password', 'representative_name']), // Validate the fields in the request body
  async (req, res) => {
    const { company_name, phone_number, password, representative_name } = req.body;

    try {
      // Check if the supplier already exists
      const existingSupplier = await Suppliers.findOne({
        where: {
          company_name: company_name,
          phone_number: phone_number
        }
      });

      if (existingSupplier) {
        return res.status(400).json({ error: "Supplier with this company name or phone number already exists" });
      }

      // Hash the password for storage
      const hashedPassword = await hashPassword(password);

      // Create the new supplier
      const newSupplier = await Suppliers.create({
        company_name,
        representative_name,
        phone_number,
        password: hashedPassword
      });

      // Generate a JWT token for the new supplier
      const token = generateToken(newSupplier.id, newSupplier.company_name);

      res.status(201).json({
        message: "Supplier successfully registered",
        token,
        supplier: newSupplier
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Error registering supplier" });
    }
  }
];

// Supplier login
exports.loginSupplier = [
  validateFields(['company_name', 'password']), // Validate required fields
  async (req, res) => {
    const { company_name, password } = req.body;

    try {
      // Find the supplier by company name
      const user = await Suppliers.findOne({ where: { company_name } });
      if (!user) {
        return res.status(401).json({ error: "Company name does not exist" });
      }

      // Check if the password matches
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // Generate a JWT token for the logged-in supplier
      const token = generateToken(user.id, user.company_name);
      res.json({ message: "Login successful", token, supplier: user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  }
];

// Get all orders for the supplier
exports.getOrders = async (req, res) => {
  try {
    const company_name = req.user.name; // Get supplier's company name from JWT token
    const supplier = await Suppliers.findOne({ where: { company_name } });
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Fetch orders associated with the supplier
    const orders = await Orders.findAll({ where: { supplier_id: supplier.id } });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "General error fetching orders" });
  }
};

// Create a new good for the supplier
exports.createGood = async (req, res) => {
  const { good_name, good_price, minimal_amount } = req.body;
  console.log("📦 body:", req.body);

  const supplier_id = req.user.id;

  try {
    // Create a new good in the database
    const newGood = await Goods.create({
      good_name: good_name,
      good_price: good_price,
      minimal_amount: minimal_amount
    });

    // Link the good to the supplier using the SupplierGoods model
    await SupplierGoods.create({
      supplier_id: supplier_id,
      good_id: newGood.id,
    });

    return res.status(201).json({ message: "Good created successfully", good: newGood });
  } catch (error) {
    console.error("Error creating good:", error);
    return res.status(500).json({ error: "Error creating good" });
  }
};

// Change the status of an order
exports.changeOrderStatus = async (req, res) => {
  const { order } = req.body;
  console.log("📦 body:", req.body);

  try {
    const supplier_id = req.user.id;

    // Find the existing order that belongs to the supplier
    const existingOrder = await Orders.findOne({
      where: {
        id: order.id,
        supplier_id: supplier_id
      }
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found or does not belong to you" });
    }

    // Update the order status
    existingOrder.status = "in_process";
    await existingOrder.save();

    return res.status(200).json({ message: "Order status updated successfully", order: existingOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Error updating order status" });
  }
};

// Get all goods for the supplier
exports.getGoods = async (req, res) => {
  console.log(req.user.name);

  try {
    const company_name = req.user.name;
    console.log("company_name:", company_name);

    const supplier = await Suppliers.findOne({ where: { company_name } });
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // שליפת כל הטובין שספק מסוים מספק
    const goods = await Goods.findAll({
      include: {
        model: SupplierGoods,  // מקשר את SupplierGoods לטבלת Goods
        where: { supplier_id: supplier.id },  // מסנן את הטובין לפי supplier_id
        required: true  // מבטיח רק את הטובין שיש להם קשר ב-SupplierGoods (INNER JOIN)
      }
    });

    if (goods.length === 0) {
      return res.status(404).json({ message: "No goods found for this supplier" });
    }

    res.status(200).json({ goods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching goods" });
  }
};