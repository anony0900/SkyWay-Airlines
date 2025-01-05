// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <h1 className="main-title">Welcome to SkyWay Airlines</h1>

        <p className="main-texts">
          Embark on a journey of comfort and luxury with SkyWay Airlines.
          Experience seamless travel across the globe with our world-class
          service
        </p>
        <br></br>
        <h2 className="little-title">Please login or sign up to continue</h2>

        <div className="buttons-container">
          <button className="nav-buttons" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="nav-buttons" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
