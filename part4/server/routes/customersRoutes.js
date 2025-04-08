const express = require('express')
const { purchaseGood } = require("../controllers/customerController");
const router = express.Router();

router.post("/purchase", purchaseGood);

module.exports = router;