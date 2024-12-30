import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingConfirmation.css";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    console.log("Location State:", location.state);

    if (location.state && location.state.selectedFlight) {
      console.log("Selected Flight:", location.state.selectedFlight);
      setBookingDetails(location.state.selectedFlight);
    } else {
      console.log("No flight details found, redirecting...");

      navigate("/bookings", {
        state: {
          bookingDetails,
        },
      });
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassengerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    try {
      // Here you would typically make an API call to save the booking
      const bookingData = {
        flightDetails: bookingDetails,
        passengerInfo: passengerDetails,
        bookingDate: new Date().toISOString(),
        classtype: passengerDetails.classtype,
      };
      // console.log("Booking data with class:", bookingData);

      navigate("/booking-summary", { state: { bookingData } });
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  const handleLogout = () => {
    navigate("/bookings");
  };

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">SkyWay Airlines</div>
        <div className="nav-links">
          <button onClick={handleLogout} className="logout-btn">
            Back
          </button>
        </div>
      </nav>
      <div className="booking-confirmation-container">
        <h1>Confirm Your Booking!!!</h1>

        <div className="flight-details-section">
          <h2>Flight Details</h2>
          <div className="flight-info">
            <p>
              <strong>Flight:</strong> {bookingDetails.airline}
            </p>
            <p>
              <strong>Flight Number:</strong> {bookingDetails.flightNumber}
            </p>
            <p>
              <strong>Origin:</strong> {bookingDetails.origin}
            </p>
            <p>
              <strong>Destination:</strong> {bookingDetails.destination}
            </p>
            <p>
              <strong>Departure Date & Time:</strong>{" "}
              {bookingDetails.departureTime}
            </p>
            <p>
              <strong>Arrival Date & Time:</strong> {bookingDetails.arrivalTime}
            </p>
          </div>
        </div>

        <div className="passenger-form-section">
          <h3>Passenger Information</h3>
          <form onSubmit={handleConfirmBooking}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={passengerDetails.fullname}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={passengerDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={passengerDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="classtype">Class</label>
              <select
                id="classtype"
                name="classtype"
                value={passengerDetails.class}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="">Select Class</option>
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="firstclass">First Class</option>
              </select>
            </div>

            <button type="submit" className="confirm-button">
              Review & Make Payment
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmation;
