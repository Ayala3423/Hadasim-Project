import axios from "axios";
import Cookies from "js-cookie"; 

const API_URL = "http://localhost:5000/manager";

// Sign up manager
export const signupManager = async (data) => {
    try {
        const { name, email, password } = data;
        const response = await axios.post(`${API_URL}/signup`, { name, email, password });
        return response.data;
    } catch (error) {
        console.error("❌ Error signing up manager:", error.response?.data || error.message);
        throw error;
    }
};

// Login manager
export const loginManager = async (data) => {
    try {
        const { name, password } = data;
        const response = await axios.post(`${API_URL}/login`, { name, password });
        return response.data;
    } catch (error) {
        console.error("❌ Error logging in manager:", error.response?.data || error.message);
        throw error;
    }
};

// Get orders for the manager
export const getOrders = async () => {
    try {
        const token = Cookies.get('token'); // Retrieve token from cookie
        const response = await axios.get(`${API_URL}/orders`, {
            headers: {
                authorization: `Bearer ${token}` // Sending token in headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching orders:", error.response?.data || error.message);
        throw error;
    }
};

// Create a new order
export const createOrder = async (supplier_name, good_name) => {
    try {
        const token = Cookies.get('token'); // Retrieve token from cookie
        const response = await axios.post(`${API_URL}/ordering`, { supplier_name, good_name }, {
            headers: {
                authorization: `Bearer ${token}` // Sending token in headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error creating order:", error.response?.data || error.message);
        throw error;
    }
};

// Change the status of an order
export const changeOrderStatus = async (order) => {
    try {
        const token = Cookies.get('token'); // Retrieve token from cookie
        const response = await axios.post(`${API_URL}/change-status`, { order }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error updating status:", error.response?.data || error.message);
        throw error;
    }
};

// Update minimal amounts in inventory
export const updateAmounts = async (data) => {
    try {
        const { id, minimal_amount } = data;
        const token = Cookies.get('token'); // Retrieve token from cookie
        console.log({ id, minimal_amount });
        const response = await axios.post(`${API_URL}/update-amounts`, { id, minimal_amount }, {
            headers: {
                authorization: `Bearer ${token}` // Sending token in headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error updating amount:", error.response?.data || error.message);
        throw error;
    }
};

// Show inventory
export const showInventory = async () => {
    try {
        const token = Cookies.get('token'); // Retrieve token from cookie
        const response = await axios.get(`${API_URL}/show-inventory`, {
            headers: {
                authorization: `Bearer ${token}` // Sending token in headers
            }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("❌ Error show inventory:", error.response?.data || error.message);
        throw error;
    }
};

// Logout manager by removing the token from cookies
export const logoutManager = () => {
    Cookies.remove('token'); // Remove the token from cookie
};