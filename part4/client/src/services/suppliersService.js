import axios from "axios";
import Cookies from "js-cookie"; // Importing js-cookie library

const API_URL = "http://localhost:5000/suppliers";

// Sign up supplier
export const signupSupplier = async (data) => {
    try {
        const { company_name, phone_number, password, representative_name } = data;
        const response = await axios.post(`${API_URL}/signup`, {
            company_name,
            phone_number,
            password,
            representative_name
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error signing up supplier:", error.response?.data || error.message);
        throw error;
    }
};

// Login supplier
export const loginSupplier = async (data) => {
    try {
        const { company_name, password } = data;
        const response = await axios.post(`${API_URL}/login`, { company_name, password });
        return response.data;
    } catch (error) {
        console.error("❌ Error logging in supplier:", error.response?.data || error.message);
        throw error;
    }
};

// Get orders for the supplier
export const getOrders = async () => {
    try {
        const token = Cookies.get('token'); // Retrieve token from cookie
        const response = await axios.get(`${API_URL}/orders`, {
            headers: {
                Authorization: `Bearer ${token}` // Sending token in headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching orders:", error.response?.data || error.message);
        throw error;
    }
};

// Get goods for the supplier
export const getGoods = async () => {
    console.log("Fetching goods...");
    
    try {
        const token = Cookies.get('token'); // Retrieve token from cookie
        const response = await axios.get(`${API_URL}/show-goods`, {
            headers: {
                Authorization: `Bearer ${token}` // Sending token in headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching goods:", error.response?.data || error.message);
        throw error;
    }
};

// Create a new good for the supplier
export const createGood = async (data) => {
    try {
        const { good_name, good_price, minimal_amount } = data;
        const token = Cookies.get('token'); // Retrieve token from cookie
        console.log(token);
        
        const response = await axios.post(`${API_URL}create-good`, {
            good_name,
            good_price,
            minimal_amount
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Sending token in headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error creating good:", error.response?.data || error.message);
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
        console.error("❌ Error updating order status:", error.response?.data || error.message);
        throw error;
    }
};

// Logout supplier by removing the token from cookies
export const logoutSupplier = () => {
    Cookies.remove('token'); // Remove the token from cookie
};