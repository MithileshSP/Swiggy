import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/customer/payment.css";
import qr from "../../assets/qrcode.jpg"
export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Retrieve total amount from Cart.jsx
    const totalAmount = location.state?.totalAmount || 0;

    const handlePayment = async () => {
        try {
            // Call API to clear cart from database
            const response = await fetch("http://localhost:7000/clear-cart", {
                method: "DELETE",
            });
    
            if (!response.ok) throw new Error("Failed to clear cart");
    
            alert("Payment successful! Thank you for your purchase.");
            navigate("/"); // Redirect to home page
    
        } catch (error) {
            console.error("Error clearing cart:", error);
            alert("Payment successful, but failed to clear cart.");
        }
    };
    
    return (
        <div className="payment-container">
            <h2>Payment Page</h2>
            <p>Total Amount to Pay: ₹{totalAmount}</p>

            {/* QR Image */}
            <div className="qr-container">
                <p>Scan this QR code to pay:</p>
                <img src={qr} alt="QR Code" className="qr-image" />
            </div>

            <button className="confirm-payment-btn" onClick={handlePayment}>
                Confirm Payment
            </button>
        </div>
    );
}
