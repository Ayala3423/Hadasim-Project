import React, { useEffect, useState } from 'react';
import { getGoods } from '../services/suppliersService';
import '../styles/Orders.css';

const Goods = () => {
    console.log("Goods component loaded");
    const [goods, setGoods] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchGoods = async () => {
            setMessage(null); 
            try {
                const response = await getGoods(); 
                setGoods(response.goods); 
                setMessage({ type: "success", text: "✅ Goods loaded successfully!" });
            } catch (error) {
                setMessage({ type: "error", text: "❌ Error loading goods." });
            }
        };
        fetchGoods();
    }, []);

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">My Goods</h2>

            {message && (
                <div className={`p-2 mb-4 text-center rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            <div>
                {goods.length > 0 ? (
                    goods.map(good => (
                        <div key={good.id} className="p-2 mb-2 border rounded">
                            <p><strong>Good Name:</strong> {good.good_name}</p>
                        </div>
                    ))
                ) : (
                    <p>There are no goods to show</p>
                )}
            </div>
        </div>
    );
};

export default Goods;