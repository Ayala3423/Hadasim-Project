import React, { useEffect, useState } from 'react';
import Form from './Form';
import '../styles/Orders.css';

const GenericOrders = ({
    title = "My Orders",
    fetchOrdersFunc,
    createOrderFunc = null,
    changeStatusFunc,
    showCreateForm = false,
    statusButton = null,
}) => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setMessage(null);
            try {
                const response = await fetchOrdersFunc();
                setOrders(response.orders);
                setMessage({ type: "success", text: "✅ Orders loaded successfully!" });
            } catch (error) {
                setMessage({ type: "error", text: "❌ Error loading orders." });
            }
        };
        fetchOrders();
    }, []);

    const handleStatusClick = async (order) => {
        try {
            const response = await changeStatusFunc(order);
            setOrders(response.order);
            setMessage({ type: "success", text: "✅ Status updated!" });
        } catch (error) {
            setMessage({ type: "error", text: "❌ Error updating status." });
        }
    };

    const handleOrderCreation = async (orderData) => {
        try {
            await createOrderFunc(orderData.supplier_name, orderData.good_name);
            setMessage({ type: "success", text: "✅ Order created successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: "❌ Error creating order." });
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>

            {message && (
                <div className={`p-2 mb-4 text-center rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            <div>
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div
                            key={order.id}
                            className={`p-2 mb-2 border rounded order-item ${order.status === "waiting" ? "status-waiting" :
                                    order.status === "completed" ? "status-completed" :
                                        "status-confirmation"
                                }`}
                        >
                            <p><strong>Supplier:</strong> {order.supplier_name}</p>
                            <p><strong>Good Name:</strong> {order.good_name}</p>
                            <p><strong>Status:</strong> {
                                statusButton ? (
                                    statusButton(order, () => handleStatusClick(order))
                                ) : order.status
                            }</p>
                        </div>

                    ))
                ) : (
                    <p>There are no orders to show</p>
                )}
            </div>

            {showCreateForm && (
                <div className="pt-4 border-t">
                    <Form
                        fields={[
                            { name: "supplier_name", label: "Supplier Name", type: "text", required: true },
                            { name: "good_name", label: "Good Name", type: "text", required: true }
                        ]}
                        onSubmit={handleOrderCreation}
                        title="Create Order"
                        submitText="Create Order"
                    />
                </div>
            )}
        </div>
    );
};

export default GenericOrders;
