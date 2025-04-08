import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseGood } from '../services/customerService';
import Form from '../components/Form'
import '../styles/Customer.css';

const Customer = () => {
    const navigate = useNavigate();

    return (
        <div className="customer-container">
            <div className="customer-buttons">
                <Form
                    fields={[
                        {
                            label: 'Good Name',
                            name: 'good_name',
                            type: 'text',
                            required: true,
                        },
                        {
                            label: 'Quantity',
                            name: 'quantity',
                            type: 'number',
                            required: true
                        }
                    ]}
                    onSubmit={purchaseGood}
                    title="Purchase"
                    submitText="Add To Cart"
                    source="/"
                />
                <div className="exit-button-container">
                    <button onClick={() => navigate("/")} style={{ marginRight: '10px' }}>Exit</button>
                </div>
            </div>
        </div>
    );
};

export default Customer;