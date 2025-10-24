import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/login.css";
import React from "react";
import swiggy_logo from "../../assets/swiggy-logo2.jpg";
import dosa_img from "../../assets/dosa.jpg"
import insta_mart from "../../assets/instamart.jpg"
import food from "../../assets/food.jpg"
import dineout from "../../assets/dineout.jpg"
import genie from "../../assets/genie.jpg"
import minis from "../../assets/minis-1.jpg"
export default function Login({ setRole }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:7000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.length > 0) {
                const role = data[0].role;
                localStorage.setItem("role", role);
                setRole(role);

                if (role === "user") {
                    navigate("/Customer_home");
                } else if (role === "admin") {
                    navigate("/Admin");
                }
            } else {
                alert(data.error || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Server error. Please try again later.");
        }
    };

    return (
        <div className="login-page">
            <div className="logos">
                <img src={swiggy_logo} alt="Swiggy Logo" />
            </div>
            <div className="image">
            <img src={dosa_img} alt="dosa img" />
            </div>
            <div><img src={insta_mart} alt="instamart" className="instamart" /></div>
            <div><img src={food} alt="food" className="food"/></div>
            <div><img src={dineout} alt="dineout" className="dineout"/></div>
            <div><img src={genie} alt="genie" className="genie"/></div>
            <div><img src={minis} alt="minis" className="minis"/></div>
            <div className="login-container">
            
            <h2>Login</h2>
            <input className="login-box"
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input className="login-box" 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleLogin} className="submit-btn">Login</button>
            </div>
        </div>
    );
}