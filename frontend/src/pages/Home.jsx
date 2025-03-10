import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import right_image from "../assets/home_right_image.jpg";
import left_image from "../assets/home_left_image.jpg";
import swiggy_logo from "../assets/Swiggy_logo.png";
import service1 from "../assets/left_tag.jpg";
import service2 from "../assets/right_tag.jpg";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa6";
import { HiOutlineSearch } from "react-icons/hi";
import { GoArrowUpRight } from "react-icons/go";
export default function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <img src={left_image} alt="leftimage" id="leftpic" />
      <img src={right_image} alt="rightimage" id="rightpic" />

      <div className="navbar">
        <div className="logo">
          <img src={swiggy_logo} alt="Swiggy Logo" />
        </div>
        <div className="nav-buttons">
          <a href="https://www.swiggy.com/corporate/">Swiggy Corporate</a>
          <a href="https://partner.swiggy.com/login#/swiggy">Partner with us</a>
          <a href="https://play.google.com/store/apps/details?id=in.swiggy.android&hl=en_IN&pli=1"><button className="app-btn">Get the Apps <span id="app-icon"><GoArrowUpRight /></span></button></a>
          <button className="sign-in" onClick={() => navigate("/Login")}>Sign in</button>
        </div>
      </div>

      <div className="text">
        Order food. Shop <br /> groceries. Swiggy it!
        <div className="search-section">
          
          <div className="dropdown">
            <div className="input-box" onClick={() => setShowDropdown(!showDropdown)}>
             <span id="icon"><FaLocationDot /></span><span id="input-text">Enter your delivery location</span>
              <span className="arrow"><IoIosArrowDown /></span>
            </div>

            {showDropdown && (
              <div className="dropdown-menu">
                <div onClick={() => { setLocation("Use my current location"); setShowDropdown(false); }}>
                   <span id="drop-text"><span id="drop-icon"><FaLocationArrow /></span>Use my current location</span>
                </div>
              </div>
            )}
          </div>

          <button className="search-button" onClick={() => navigate("/search")}>
          <span id="search-text">Search for restaurant, item or more</span><span id="search-icon"><HiOutlineSearch /></span> 
          </button>
        </div>
      </div>
      <div className="services">
        <div className="service-card">
         <a href="https://www.swiggy.com/restaurants"><img src={service1} alt="Service 1"  /></a>
        </div>
        <div className="service-card">
          <a href="https://www.swiggy.com/instamart?entryId=1234&entryName=mainTileEntry4&v=1"><img src={service2} alt="Service 2" /></a>
        </div>
      </div>
    </div>
  );
}
