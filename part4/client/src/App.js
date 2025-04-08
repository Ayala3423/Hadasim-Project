import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Manager from "./pages/Manager"
import Supplier from "./pages/Supplier"
import Home from "./pages/Home"
import Customer from "./pages/Customer"

function App() {
    console.log("App component rendered");

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/manager/:section" element={<Manager />} />
                <Route path="/suppliers/:section" element={<Supplier />} />
                <Route path="/customers/:section" element={<Customer />} />
            </Routes>

        </Router>
    );
}

export default App;