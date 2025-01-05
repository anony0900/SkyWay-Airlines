import React, { useState, useEffect } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import "./InfoPages.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/airline-home"); // Redirect to the homepage
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">
          SkyWay Airlines
        </Link>
      </div>
      <div className="nav-center">
        <Link to="/airline-home" className="nav-link">
          Home
        </Link>
        <Link to="/flight-status" className="nav-link">
          Flights
        </Link>
        <Link to="/booking-history" className="nav-link">
          My Bookings
        </Link>
      </div>
      <div className="nav-right">
        <button onClick={handleBack} className="logout-btn">
          Back
        </button>
      </div>
    </nav>
  );
};
const InfoPages = () => {
  const location = useLocation();
  const [activePage, setActivePage] = useState(location.state?.page || "about");

  useEffect(() => {
    if (location.state?.page) {
      setActivePage(location.state.page);
    }
  }, [location.state]);

  const renderContent = () => {
    switch (activePage) {
      case "about":
        return (
          <div className="about-content">
            <h2>About Us</h2>
            <p>
              Welcome to SkyWay Airlines, your trusted partner in air travel
              since 2020. We are committed to providing safe, comfortable, and
              reliable air transportation services to our valued customers.
            </p>

            <h3>Our Mission</h3>
            <p>
              To deliver exceptional travel experiences while maintaining the
              highest standards of safety, reliability, and customer service.
            </p>

            <h3>Our Vision</h3>
            <p>
              To be the most preferred airline choice, connecting people and
              places with comfort and care.
            </p>

            <div className="key-features">
              <h3>Why Choose Us?</h3>
              <ul>
                <li>Modern fleet of aircraft</li>
                <li>Extensive network coverage</li>
                <li>Professional and friendly staff</li>
                <li>Competitive fares</li>
                <li>Enhanced safety protocols</li>
              </ul>
            </div>
          </div>
        );

      case "terms":
        return (
          <div className="terms-content">
            <h2>Terms & Conditions</h2>
            <div className="terms-section">
              <h3>1. Booking and Ticketing</h3>
              <p>
                All bookings are subject to availability and pricing at the time
                of purchase. Tickets are non-transferable and must be used in
                sequence.
              </p>
            </div>

            <div className="terms-section">
              <h3>2. Cancellation Policy</h3>
              <p>
                Cancellations must be made at least 24 hours before scheduled
                departure. Refunds will be processed according to the fare type
                and timing of cancellation.
              </p>
            </div>

            <div className="terms-section">
              <h3>3. Baggage Policy</h3>
              <p>
                Each passenger is entitled to specific baggage allowances based
                on their ticket class. Additional baggage fees may apply.
              </p>
            </div>

            <div className="terms-section">
              <h3>4. Check-in Requirements</h3>
              <p>
                Passengers must check in at least 2 hours prior to domestic
                flights and 3 hours prior to international flights.
              </p>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="privacy-content">
            <h2>Privacy Policy</h2>
            <div className="privacy-section">
              <h3>Information We Collect</h3>
              <p>
                We collect personal information including but not limited to:
              </p>
              <ul>
                <li>Name and contact details</li>
                <li>Payment information</li>
                <li>Travel documentation</li>
                <li>Flight preferences</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h3>How We Use Your Information</h3>
              <ul>
                <li>Processing your bookings</li>
                <li>Communicating flight updates</li>
                <li>Improving our services</li>
                <li>Legal compliance</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h3>Data Security</h3>
              <p>
                We implement appropriate security measures to protect your
                personal information from unauthorized access, alteration, or
                disclosure.
              </p>
            </div>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="info-pages">
        <div className="page-navigation">
          <button
            className={`nav-button ${activePage === "about" ? "active" : ""}`}
            onClick={() => setActivePage("about")}
          >
            About Us
          </button>
          <button
            className={`nav-button ${activePage === "terms" ? "active" : ""}`}
            onClick={() => setActivePage("terms")}
          >
            Terms & Conditions
          </button>
          <button
            className={`nav-button ${activePage === "privacy" ? "active" : ""}`}
            onClick={() => setActivePage("privacy")}
          >
            Privacy Policy
          </button>
        </div>
        <div className="content-container">{renderContent()}</div>
      </div>
    </div>
  );
};

export default InfoPages;
