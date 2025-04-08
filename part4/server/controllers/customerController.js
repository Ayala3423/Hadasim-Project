const Goods = require("../models/goods");
const Inventory = require("../models/inventory");
const Suppliers = require("../models/suppliers");
const Orders = require("../models/orders");

exports.purchaseGood = async (req, res) => {
    const { good_name, quantity } = req.body;
    console.log(req.body);

    try {
        // Step 1: Check inventory
        const good = await Goods.findOne({ where: { good_name } });

        if (!good) {
            throw new Error('Product not found in GOODS table');
        }

        const inventory = await Inventory.findOne({ where: { good_id: good.id } });
        if (!inventory) return res.status(404).json({ error: "Item not found in inventory" });
        console.log(inventory.current_amount, quantity);

        if (inventory.current_amount < quantity) {
            return res.status(400).json({ error: "Not enough in stock" });
        }

        // Step 2: Update inventory
        inventory.current_amount -= quantity;
        await inventory.save();

        // Step 3: Check if reorder is needed
        if (inventory.current_amount < inventory.minimal_amount) {
            const good = await Goods.findOne({ where: { id: good.id }, include: Suppliers });

            if (!good || !good.Supplier) {
                return res.status(200).json({
                    message: "Purchase successful, but no supplier available to reorder this item"
                });
            }

            // Step 4: Create new order from supplier
            await Orders.create({
                good_id: good.id,
                supplier_id: good.supplier_id,
                manager_id: null, // If relevant, you can add manager's ID from the token
                status: "waiting"
            });

            return res.status(200).json({
                message: "Purchase successful, item reordered automatically from supplier",
                reorder: true
            });
        }

        // Step 5: Everything fine
        return res.status(200).json({ message: "Purchase successful" });

    } catch (error) {
        console.error("Purchase error:", error);
        return res.status(500).json({ error: "Error processing purchase" });
    }
};