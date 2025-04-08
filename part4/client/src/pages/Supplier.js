import { useParams, Link, useNavigate } from 'react-router-dom';
import { signupSupplier, loginSupplier, getOrders, createGood, changeOrderStatus, logoutSupplier } from '../services/suppliersService';
import { useEffect, useState } from 'react';
import Form from '../components/Form'
import Orders from '../components/Orders'
import Goods from '../components/Goods'
import '../styles/Supplier.css';
import Cookies from 'js-cookie'; 

const Supplier = () => {
    const { section } = useParams();
    const navigate = useNavigate();
    const [supplierName, setSupplierName] = useState('');

    useEffect(() => {
        if (!Cookies.get('token') && section !== "login" && section !== "signup") {
            navigate("/suppliers/login");
        } else {
            const nameFromCookie = Cookies.get('supplierName');
            if (nameFromCookie) {
                setSupplierName(nameFromCookie);
            }
        }
    }, [section, navigate]);

    const renderSection = () => {
        switch (section) {
            case "signup":
                return <Form fields={[ 
                    { name: 'company_name', label: 'company_name', type: 'text' },
                    { name: 'phone_number', label: 'phone_number', type: 'number' },
                    { name: 'password', label: 'password', type: 'password' },
                    { name: 'representative_name', label: 'representative_name', type: 'text' }
                ]} onSubmit={signupSupplier} title={"Signup Supplier"} submitText={"Signup"} source={"/suppliers/orders"} />
            case "login":
                return <Form fields={[ 
                    { name: 'company_name', label: 'company_name', type: 'text' },
                    { name: 'password', label: 'password', type: 'password' }
                ]} onSubmit={loginSupplier} title={"Login Supplier"} submitText={"Login"} />;
            case "goods":
                return (<div><Goods /><Form fields={[ 
                    { name: 'good_name', label: 'good_name', type: 'text' },
                    { name: 'good_price', label: 'good_price', type: 'number' },
                    { name: 'minimal_amount', label: 'minimal_amount', type: 'number' }
                ]} onSubmit={createGood} title={"Add A Good"} submitText={"Add"} source={"/suppliers/orders"} /></div>);
            case "orders":
                return <Orders
                    title="Incoming Orders"
                    fetchOrdersFunc={getOrders}
                    changeStatusFunc={changeOrderStatus}
                    showCreateForm={false}
                    statusButton={(order, onClick) =>
                        order.status === "waiting" ? (
                            <button onClick={onClick} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-300">Waiting</button>
                        ) : order.status
                    }
                />;
            default:
                return <div>404 ERROR</div>;
        }
    };

    const handleLogout = () => {
        logoutSupplier();
        Cookies.remove('token');
        Cookies.remove('supplierName');
        setSupplierName('');
        navigate("/");
    };

    return (
        <div>
            <h1 className='supplierTitle'>{supplierName ? `Hello, ${supplierName}` : 'Supplier'}</h1>

            <nav style={{ marginBottom: '20px' }}>
                <Link to="/suppliers/signup" style={{ marginRight: '10px' }}>Signup</Link>
                <Link to="/suppliers/login" style={{ marginRight: '10px' }}>Login</Link>
                <Link to="/suppliers/goods" style={{ marginRight: '10px' }}>Goods</Link>
                <Link to="/suppliers/orders">Show Orders</Link>
                <button onClick={handleLogout} style={{ marginRight: '10px' }}>Logout</button>
            </nav>

            {renderSection()}
        </div>
    );
};

export default Supplier;