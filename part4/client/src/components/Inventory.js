import React, { useState } from 'react';

const Inventory = ({ fetchInventoryFunc, onSubmit }) => {
    console.log("Inventory component loaded");

    const [inventory, setInventory] = useState([]);
    const [message, setMessage] = useState(null);

    const fetchInventory = async () => {
        setMessage(null);
        try {
            const response = await fetchInventoryFunc();
            setInventory(response.inventory);
            setMessage({ type: 'success', text: '✅ Inventory loaded successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Error loading inventory.' });
        }
    };

    const handleAmountChange = (index, value) => {
        const updatedInventory = [...inventory];
        updatedInventory[index].minimal_amount = Number(value); 
        setInventory(updatedInventory);
    };    

    const handleMinimalAmount = async (index) => {
        const item = inventory[index];
        setMessage(null);
        try {
            await onSubmit({
                id: item.id,
                minimal_amount: item.minimal_amount
            });
            setMessage({ type: 'success', text: `✅ Minimal amount updated for ${item.goodName}` });
        } catch (error) {
            setMessage({ type: 'error', text: `❌ Error updating minimal amount for ${item.goodName}` });
        }
    };

    return (
        <div className="good-details-container">
            <h2>Inventory</h2>
            <button onClick={() => fetchInventory()}>Refresh Inventory</button>
            {message && <div className={`message ${message.type}`}>{message.text}</div>}
            {inventory.map((item, index) => (
                <div className="good-info" key={item.id}>
                    <p><strong>Good Name:</strong> {item.good_id}</p>
                    <p><strong>Current Amount:</strong> {item.current_amount}</p>
                    <div>
                        <label>
                            <strong>Minimal Amount:</strong>
                            <input
                                type="number"
                                value={item.minimal_amount}
                                onChange={(e) => handleAmountChange(index, e.target.value)}
                                min="0"
                            />
                        </label>
                    </div>
                    <button onClick={() => handleMinimalAmount(index)}>Save Minimal Amount</button>
                    <hr style={{ margin: '20px 0' }} />
                </div>
            ))}
        </div>
    );
};

export default Inventory;
