const express = require('express');
const { createOrder, getOrders, loginManager, signupManager, changeOrderStatus, updateAmounts, showInventory } = require("../controllers/managerController");
const {verifyToken} = require("../middleware/authMiddleware"); 
const router = express.Router();

router.post("/ordering", verifyToken, createOrder); 
router.post("/change-status", verifyToken, changeOrderStatus); 
router.post("/update-amounts", verifyToken, updateAmounts);
router.get("/orders", verifyToken, getOrders); 
router.get("/show-inventory", verifyToken, showInventory);

router.post("/login", loginManager);
router.post("/signup", signupManager);

module.exports = router;
