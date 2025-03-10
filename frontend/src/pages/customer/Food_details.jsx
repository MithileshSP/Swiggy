import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/customer/food_details.css";

export default function Food_details() {
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { menu } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFood = async () => {
            try {
                console.log(`Fetching food details for: ${menu}`);
                const response = await fetch(`http://localhost:7000/get-food/${encodeURIComponent(menu)}`);

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched food data:", data);

                if (data.error) {
                    setError(data.error);
                } else {
                    setFood(data);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setError("Failed to load food. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (menu) fetchFood();
    }, [menu]);
    const handleAddToCart = async () => {
        if (!food || !food.menu || !food.price || !food.path) {
            alert("Food details are incomplete!");
            return;
        }
    
        const cartItem = {
            menu: food.menu,
            price: food.price,
            path: food.path,
            review: food.review || "No review available",
            quantity: 1,  // Default quantity
        };
    
        try {
            const response = await fetch("http://localhost:7000/add-to-cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartItem),
            });
    
            if (!response.ok) throw new Error("Failed to add item to cart");
    
            alert("Item added to cart successfully!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add item to cart.");
        }
    };
    
    return (
        <div className="food-details-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
            <button className="cart-button" onClick={() => navigate("/Cart")}>🛒 Cart</button>
            
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : food ? (
                <div className="food-details">
                    {/* <img src={food.path} alt={food.menu} className="food-image" /> */}
                    <h2>{food.menu}</h2>
                    <p>Price: ₹{food.price}</p>
                    <p><strong>Review:</strong> {food.review}</p>
                    <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
                </div>
            ) : (
                <p>No Food found.</p>
            )}
        </div>
    );
}
