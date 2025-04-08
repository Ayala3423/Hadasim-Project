const express = require('express');
const { getOrders, loginSupplier, signupSupplier, createGood, changeOrderStatus, getGoods } = require("../controllers/supplierController");
const {verifyToken} = require("../middleware/authMiddleware"); 
const router = express.Router();

router.get("/orders", verifyToken, getOrders); 
router.post("/change-status", verifyToken, changeOrderStatus);
router.post("/create-good", verifyToken, createGood); 
router.get("/show-goods", verifyToken, getGoods); 

router.post("/login", loginSupplier);
router.post("/signup", signupSupplier);

module.exports = router;