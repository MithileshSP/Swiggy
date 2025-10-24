import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "../../styles/customer/cart.css";
import Navbar from "../../components/navbar/Navigation";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get-cart`);
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const increaseQuantity = async (menu) => {
        try {
CZ
            if (!response.ok) throw new Error("Failed to update quantity");

            fetchCartItems();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const decreaseQuantity = async (menu) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/decrease-quantity/${menu}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
});


            if (!response.ok) throw new Error("Failed to decrease quantity");

            fetchCartItems();
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    const deleteItem = async (menu) => {
        try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/delete-from-cart/${encodeURIComponent(menu)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
});


            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Failed to delete item");
            }

            alert(result.message);
            fetchCartItems();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Error deleting item. Please try again.");
        }
    };

    // Calculate total price of all items
    const totalAmount = cartItems.reduce((sum, item) => sum + item.total_price, 0);

    return (
        
        <div className="cart-container">
            <Navbar/>
            <h2>Cart</h2>
            {cartItems.length === 0 ? (
                <p>No items in cart.</p>
            ) : (
                <>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.menu}>
                                <img src={item.path} alt={item.menu} />
                                <h3>{item.menu}</h3>
                                <p>Price per item: ₹{item.price}</p>
                                <p>Total Price: ₹{item.total_price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <button onClick={() => decreaseQuantity(item.menu)}>-</button>
                                <button onClick={() => increaseQuantity(item.menu)}>+</button>
                                <button onClick={() => deleteItem(item.menu)}>Delete</button>
                            </li>
                        ))}
                    </ul>

                    {/* Display Total Amount and Payment Button */}
                    <div className="cart-footer">
                        <h3>Total Amount: ₹{totalAmount}</h3>
                        <button 
                            className="payment-btn" 
                            onClick={() => navigate("/payment", { state: { totalAmount: totalAmount } })}
                        >
                        Make Payment
                        </button>

                    </div>
                </>
            )}
        </div>
    );
}
