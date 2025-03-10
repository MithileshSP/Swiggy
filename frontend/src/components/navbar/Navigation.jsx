import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import "../navbar/navigation.css";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("role");
        navigate("/Login");
    };

    const isActive = (path) => location.pathname === path ? "active" : "";

    return (
        <div className="navbar">
            <div className="nav-links">
                {role === "user" && (
                    <>
                        <Button className={`nav-button ${isActive("/Customer_home")}`} onClick={() => navigate("/Customer_home")}>
                            Home
                        </Button>
                        <Button className={`nav-button ${isActive("/Cart")}`} onClick={() => navigate("/Cart")}>
                            Cart
                        </Button>
                        <Button className={`nav-button ${isActive("/Help")}`} onClick={() => navigate("/Help")}>
                            Help
                        </Button>
                    </>
                )}
                {role === "admin" && (
                    <Button className={`nav-button ${isActive("/Admin")}`} onClick={() => navigate("/Admin")}>
                        Home
                    </Button>
                )}
            </div>
            <div className="signin-container">
                <Button className="nav-button" onClick={handleLogout}>
                    Sign-in
                </Button>
            </div>
        </div>
    );
}
