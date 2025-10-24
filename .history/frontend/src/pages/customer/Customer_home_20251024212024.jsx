import Navbar from "../../components/navbar/Navigation";
import "../../styles/customer/customer.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Customer_home() {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/get-data`);
        const data = await response.json();
        setFoods(data);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className="customer-page">
      <Navbar />
      <div className="customer-container">
        {foods.map((food) => (
          <div 
            key={food.menu} 
            className="food-item" 
            onClick={() => navigate(`/food/${food.menu}`)}
          >
            <div className="food-image-container">
              <img src={food.path} alt={food.menu} className="food-image" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
