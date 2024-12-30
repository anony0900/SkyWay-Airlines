import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSummary.css";

const BookingSummary = () => {
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  const passengerInfo = bookingData?.passengerInfo;
  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingDetails, setBookingDetails] = useState("");

  const [cardNumber, setCardNumber] = useState("");

  // Sample base prices for routes (in a real app, this would come from a backend)
  const basePrice = {
    domestic: 5000,
    international: 15000,
  };

  // Class multipliers
  const classMultiplier = {
    economy: 1,
    business: 2.5,
    firstclass: 4,
  };

  useEffect(() => {
    if (location.state?.bookingData) {
      setBookingDetails(bookingData);

      try {
        const baseAmount = basePrice.domestic;
        const classType = bookingData.classtype.toLowerCase();
        if (!classMultiplier[classType]) {
          throw new Error("Invalid class type");
        }
        const classPrice = baseAmount * classMultiplier[classType];
        console.log("Class price:", classPrice);
        // const finalPrice = classPrice * parseInt(bookingData.passengers); for passenger count
        const finalPrice = classPrice; // no need to add more passengers
        // console.log('Passenger count:', bookingData.passengers);
        console.log("Final price:", finalPrice);
        setTotalPrice(finalPrice);
      } catch (error) {
        console.error("Error calculating price:", error);
        setTotalPrice(0);
      }
    }
  }, [location]);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    navigate("/payment", {
      state: {
        bookingDetails,
        totalPrice,
      },
    });
  };

  const handleLogout = () => {
    navigate("/airline-home");
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">SkyWay Airlines</div>
        <div className="nav-links">
          <button onClick={handleLogout} className="logout-btn">
            Home
          </button>
        </div>
      </nav>
    <div className="payment-container">
      <div className="payment-box">
        <h2>Payment Details</h2>
        {bookingDetails && (
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <p>
              <strong>Airline:</strong> {bookingData.flightDetails.airline}
            </p>
            <p>
              <strong>Flight Number:</strong> {bookingData.flightDetails.flightNumber}
            </p>
            <p>
              <strong>Origin:</strong> {bookingData.flightDetails.origin}
            </p>
            <p>
              <strong>Destination:</strong>{" "}
              {bookingData.flightDetails.destination}
            </p>
            <p>
              <strong>Departure Date & Time:</strong>{" "}
              {bookingData.flightDetails.departureTime}
            </p>
            <p>
              <strong>Class:</strong> {bookingData.classtype}
            </p>
            <p>
              <strong>Passenger name:</strong> {passengerInfo.fullname}
            </p>
            <p>
              <strong>Passenger email:</strong> {passengerInfo.email}
            </p>
            <p>
              <strong>Passenger phone:</strong> {passengerInfo.phone}
            </p>
            <h4>Total Amount: ₹ {totalPrice}</h4>
          </div>
        )}

        <form onSubmit={handlePaymentSubmit}>
          <button type="submit" className="payment-button">
            Pay ₹{totalPrice}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default BookingSummary;
