// AirlineHome.js
import React, { use, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AirlineHome.css";

const AirlineHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  console.log("email ", email);

  const handleLogout = () => {
    // Add any logout logic here (clearing tokens, etc.)
    localStorage.clear();
    navigate("/");
  };

  const handleBooking = () => {
    navigate("/bookings");
  };
  const handleBookingHistory = () => {
    navigate("/booking-history", {
      state: { email: email },
    });
  };
  const handleFlightStatus = () => {
    navigate("/flight-status");
  };
  const handlePrivacy = () => {
    navigate("/info", { state: { page: "privacy" } });
  };
  const handleTerms = () => {
    navigate("/info", { state: { page: "terms" } });
  };
  const handleAbout = () => {
    navigate("/info", { state: { page: "about" } });
  };
      

  return (
    <div className="airline-home">
      <nav className="navbar">
        <div className="nav-brand">SkyWay Airlines</div>
        <div className="nav-links">
          <button onClick={handleLogout} className="logout-btn1">
            Logout
          </button>
        </div>
      </nav>

      <div className="main-content">
        <h1>Welcome to SkyWay Airlines Dashboard</h1>
        <div className="dashboard-cards">
          <div className="card">
            <h3>Book Flight</h3>
            <p>Search and book your next flight</p>
            <button onClick={handleBooking} className="book-btn">
              click here
            </button>
          </div>
          <div className="card">
            <h3>My Bookings</h3>
            <p>View your flight bookings</p>
            <button onClick={handleBookingHistory} className="book-btn">
              click here
            </button>
          </div>
          <div className="card">
            <h3>Flight Status</h3>
            <p>Check your flight status</p>
            <button onClick={handleFlightStatus} className="book-btn">
              click here
            </button>
          </div>
        </div>
        {/* Additional content sections to create scrolling */}
        <div className="content-section">
          <h2>Popular Destinations</h2>
          <div className="dashboard-cards">
            {/* Add more cards for destinations */}
            <div className="card">
              <h3>Paris</h3>
              <p>Explore the city of love</p>
              <a href="https://en.wikipedia.org/wiki/Paris" style={{ cursor: "pointer" }} className="click-btn"
              target="_blank"
              >Click to Explore</a>
            </div>
            <div className="card">
              <h3>New York</h3>
              <p>The city that never sleeps</p>
              <a href="https://en.wikipedia.org/wiki/New York" style={{ cursor: "pointer" }} className="click-btn"
              target="_blank"
              >Click to Explore</a>
            </div>
            <div className="card">
              <h3>Tokyo</h3>
              <p>Experience modern Japan</p>
              <a href="https://en.wikipedia.org/wiki/Tokyo" style={{ cursor: "pointer" }} className="click-btn"
              target="_blank"
              >Click to Explore</a>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Special Offers</h2>
          <div className="dashboard-cards">
            {/* Add more cards for offers */}
            <div className="card">
              <h3>Summer Special</h3>
              <p>20% off on international flights</p>
            </div>
            <div className="card">
              <h3>Weekend Getaway</h3>
              <p>Special deals on domestic flights</p>
            </div>
            <div className="card">
              <h3>Family Package</h3>
              <p>Kids fly free on selected routes</p>
            </div>
          </div>
        </div>
      </div>
      {/* New Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-sections">
            <h4 className="contact">Contact Us</h4>
            <p className="contact">Email: support@skyway.com</p>
            <p className="contact">Phone: +1 (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <div className="social-links">
              <ul>
                <li>
                  <a onClick={handleAbout} style={{ cursor: "pointer" }}>
                    About Us
                  </a>
                </li>
                <li>
                  <a onClick={handleTerms} style={{ cursor: "pointer" }}>
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a onClick={handlePrivacy} style={{ cursor: "pointer" }}>
                  Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <ul>
                <li>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="contact">
            &copy; 2024 SkyWay Airlines. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AirlineHome;
