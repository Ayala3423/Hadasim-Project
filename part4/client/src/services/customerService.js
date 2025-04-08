import axios from "axios";
const API_URL = "http://localhost:5000/customer";

export const purchaseGood = async (data) => {
    try {
        const { good_name, quantity } = data;
        const response = await axios.post(`${API_URL}/purchase`, { good_name, quantity });
        return response.data;
    } catch (error) {
        console.error("❌ Error purchasing:", error.response?.data || error.message);
        throw error;
    }
};