import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; 
import { signupManager, loginManager, getOrders, createOrder, changeOrderStatus, logoutManager, showInventory, updateAmounts } from '../services/managerService';
import Form from '../components/Form';
import Orders from '../components/Orders';
import Inventory from '../components/Inventory';
import '../styles/Manager.css';

const Manager = () => {
    const { section } = useParams();
    const navigate = useNavigate();
    const [managerName, setManagerName] = useState('');

    useEffect(() => {
        console.log(Cookies.get('managerName'));
        
        if (!Cookies.get('token') && section !== "login" && section !== "signup") {
            navigate("/manager/login");
        } else {
            const nameFromCookie = Cookies.get('managerName');
            if (nameFromCookie) {
                setManagerName(nameFromCookie);
            }
        }
    }, [section, navigate]);

    const renderSection = () => {
        switch (section) {
            case "signup":
                return <Form fields={[{ name: 'name', label: 'name', type: 'text' }, { name: 'email', label: 'email', type: 'email' }, { name: 'password', label: 'password', type: 'password' }]} onSubmit={signupManager} title={"Signup Manager"} submitText={"Signup"} source={"/manager/orders"} />;
            case "login":
                return <Form fields={[{ name: 'name', label: 'name', type: 'text' }, { name: 'password', label: 'password', type: 'password' }]} onSubmit={loginManager} title={"Login Manager"} submitText={"Login"} source={"/manager/orders"} />;
            case "inventory":
                return <Inventory fetchInventoryFunc={showInventory} onSubmit={updateAmounts} />;
            case "orders":
                return <Orders title="My Orders" fetchOrdersFunc={getOrders} createOrderFunc={createOrder} changeStatusFunc={changeOrderStatus} showCreateForm={true} statusButton={(order, onClick) => order.status === "in_process" ? (<button onClick={onClick} className="bg-blue-200 text-blue-800 px-2 py-1 rounded hover:bg-blue-300">Confirmation</button>) : order.status} />;
            default:
                return <div>404 ERROR</div>;
        }
    };

    const handleLogout = () => {
        logoutManager();
        Cookies.remove('token'); 
        Cookies.remove('managerName'); 
        setManagerName('');
        navigate("/");
    };

    return (
        <div>
            <h1 className='managerTitle'>{managerName ? `Hello, ${managerName}` : 'Manager'}</h1>

            <nav style={{ marginBottom: '20px' }}>
                <Link to="/manager/signup" style={{ marginRight: '10px' }}>Signup</Link>
                <Link to="/manager/login" style={{ marginRight: '10px' }}>Login</Link>
                <Link to="/manager/inventory" style={{ marginRight: '10px' }}>Inventory</Link>
                <Link to="/manager/orders">Show Orders</Link>
                <button onClick={handleLogout} style={{ marginRight: '10px' }}>Logout</button>
            </nav>

            {renderSection()}
        </div>
    );
};

export default Manager;