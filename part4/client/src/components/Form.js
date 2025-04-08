import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';
import Cookies from 'js-cookie'; 

const Form = ({ fields, onSubmit, title, submitText, source }) => {
    console.log("Form component loaded");
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    );
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            console.log("Submitting form data:", formData);

            const response = await onSubmit(formData);
            setMessage({ type: "success", text: "✅ Success!" });
            Cookies.set("token", response["token"], { expires: 7, path: "/" });
            if(response["manager"]) Cookies.set('managerName', response.manager.name, { expires: 7, path: "/" });
            if(response["supplier"]) Cookies.set('supplierName', response.supplier.company_name, { expires: 7, path: "/" });
            if (source) {
                navigate(source);
            }
        } catch (error) {
            setMessage({ type: "error", text: "❌ Submission error." });
            setFormData(
                fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
            );
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
            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                    <div key={field.name}>
                        <label className="block text-gray-700">{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder={field.placeholder || ''}
                            required={field.required !== false}
                        />
                    </div>
                ))}
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                    {submitText}
                </button>
            </form>
        </div>
    );
};

export default Form;
