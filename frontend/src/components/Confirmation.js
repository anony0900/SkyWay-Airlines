// Confirmation.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "./Confirmation.css";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails, totalPrice } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);

  console.log("Booking Details:", bookingDetails);
  console.log("Price:", totalPrice);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    navigate("/airline-home");
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.text("Flight Booking Confirmation", 20, 20);

    doc.setFontSize(14);
    let yPos = 40;

    // Helper function to format and add text
    const addText = (key, value) => {
      const formattedKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());

      doc.text(`${formattedKey}: ${value}`, 20, yPos);
      yPos += 10;
    };

    Object.entries(bookingDetails).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        addText(key, "");
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          addText(nestedKey, nestedValue);
        });
      } else {
        // Add regular key-value pairs
        addText(key, value);
      }
    });

    // Save the PDF
    doc.save("flight-booking.pdf");
  };

  return (
    <div className="confirmation-page">
      <nav className="navbar">
        <div className="nav-brand">SkyWay Airlines</div>
        <button className="back-btn" onClick={handleLogout}>
          Back to Home
        </button>
      </nav>

      <div className="confirmation-main-content">
        <div className="flight-confirmation-wrapper">
          {isLoading ? (
            <>
              <h2 className="flight-confirmation-title">
                Generating your flight ticket...
              </h2>
              <div className="flight-spinner-wrapper">
                <div className="flight-spinner"></div>
                <p className="flight-waiting-text">Please wait</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="flight-confirmation-title">
                Your flight ticket is ready!
              </h2>
              <p className="flight-confirmation-message">
                You can now download your flight ticket for future reference.
              </p>
              <button className="flight-download-btn" onClick={generatePDF}>
                Download Ticket
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
