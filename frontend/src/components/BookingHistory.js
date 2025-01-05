import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingHistory.css";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem("email");

  useEffect(() => {
    console.log("Email passed to BookingHistory:", email);
    if (!email) {
      setError("Email parameter is required");
      return;
    }
    fetchBookingHistory();
  }, [email]);

  const fetchBookingHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/bookinghistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("data", data);

      if (response.ok) {
        // Check if bookings array is empty
        setBookings(Array.isArray(data) ? data : []);
      } else {
        // Handle server-side errors
        setError(data.error || "Failed to fetch booking history");
      }
    } catch (err) {
      // Handle client-side errors (e.g., network issues)
      console.error("Fetch error:", err);
      setError("Failed to fetch booking history");
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  const handleBack = () => {
    navigate("/airline-home");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="booking-history">
      <nav className="navbar">
        <div className="nav-brand">SkyWay Airlines</div>
        <button onClick={handleBack} className="back-btn">
          Back to Home
        </button>
      </nav>

      <div className="booking-main-content">
        <h1>My Booking History</h1>
        <div className="bookings-container">
          {bookings.length === 0 ? (
            <p className="no-bookings">No bookings yet</p> 
          ) : (
            bookings.map((booking, index) => (
              <div key={index} className="booking-card">
                <div className="booking-header">
                  <h3>Flight Details</h3>
                  <span className="booking-status">Confirmed</span>
                </div>
                <div className="booking-details">
                  <div className="flight-info">
                    <p>
                      <strong>Airline:</strong> {booking.Flight_Details.Airline}
                    </p>
                    <p>
                      <strong>Flight:</strong>{" "}
                      {booking.Flight_Details.Flight_Number}
                    </p>
                    <p>
                      <strong>From:</strong> {booking.Flight_Details.origin}
                    </p>
                    <p>
                      <strong>To:</strong> {booking.Flight_Details.Destination}
                    </p>
                    <p>
                      <strong>Departure:</strong>{" "}
                      {booking.Flight_Details.Arrival_Time}
                    </p>
                    <p>
                      <strong>Arrival:</strong>{" "}
                      {booking.Flight_Details.Departure_Time}
                    </p>
                  </div>
                  <div className="passenger-info">
                    <p>
                      <strong>Passenger Name:</strong>{" "}
                      {booking.passengerInfo.Full_Name}
                    </p>
                    <p>
                      <strong>Email:</strong> {booking.passengerInfo.Email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {booking.passengerInfo.Phone}
                    </p>
                    <p>
                      <strong>Class:</strong> {booking.passengerInfo.Class_Type}
                    </p>
                  </div>
                  <div className="price-info">
                    <p>
                      <strong>Price:</strong> ${booking.Price}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
