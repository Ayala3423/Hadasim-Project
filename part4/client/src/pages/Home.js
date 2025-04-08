import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; 

const Home = () => {
    const navigate = useNavigate();

    const handleClick = (source) => {
        navigate(source);
    };

    return (
        <div className="home-container">
            <h1 className="home-title">Welcome To Our Grocery!</h1>
            <div className="home-buttons">
                <button onClick={() => handleClick("/manager/login")} className="home-btn manager-btn">Manager</button>
                <button onClick={() => handleClick("/suppliers/login")} className="home-btn supplier-btn">Supplier</button>
                <button onClick={() => handleClick("/customers/purchase")} className="home-btn supplier-btn">Customer</button>
            </div>
        </div>
    );
};

export default Home;
