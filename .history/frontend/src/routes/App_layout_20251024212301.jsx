import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "../components/login/Login";
import Customer_home from "../pages/customer/Customer_home";
import Admin from "../pages/admin/Admin
import Home from "../pages/Home";
import Cart from "../pages/customer/Cart";
import Help from "../pages/customer/Help";
import Food_details from "../pages/customer/Food_details";
import Payment from "../pages/customer/Payment";

function App_layout() {
  const [role, setRole] = useState(localStorage.getItem("role")); // Track role in state
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role")); // Update role when localStorage changes
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  console.log("Current Role:", role);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login setRole={setRole} />} />
        <Route
          path="/Customer_home"
          element={role === "user" ? <Customer_home /> : <Navigate to="/" />}
        />
        <Route
          path="/Cart"
          element={role === "user" ? <Cart /> : <Navigate to="/" />}
        />
        <Route
          path="/Help"
          element={role === "user" ? <Help /> : <Navigate to="/" />}
        />
        <Route
          path="/food/:menu"
          element={role === "user" ? <Food_details /> : <Navigate to="/" />}
        />
        <Route
          path="/Admin"
          element={role === "admin" ? <Admin /> : <Navigate to="/" />}
        />
        <Route path="/Payment" element={<Payment />} />
      </Routes>
    </div>
  );
}

export default App_layout;
