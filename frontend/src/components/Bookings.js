// Bookings.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Bookings.css";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
    class: "economy",
  });

  const [availableFlights, setAvailableFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBack = () => {
    navigate("/airline-home");
  };

  const handleSelectFlight = (flight) => {
    const enhancedFlight = {
      ...flight,
      origin: flight.origin,
      destination: flight.destination,
    };

    console.log("Enhanced flight object:", enhancedFlight);

    navigate("/booking-confirmation", {
      state: { selectedFlight: enhancedFlight },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Add query parameters based on form data
      const queryParams = new URLSearchParams({
        access_key: "e96a878c1430488600bfdc65f391d264",
        dep_iata: bookingData.origin,
        arr_iata: bookingData.destination,
      });

      const response = await fetch(
        `https://api.aviationstack.com/v1/flights?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }

      const data = await response.json();

      // Transform the API response to match your component's expected format
      const transformedFlights = data.data.map((flight) => ({
        id: flight.flight.iata,
        airline: flight.airline.name,
        flightNumber: flight.flight.iata,
        departureTime: flight.departure.scheduled,
        arrivalTime: flight.arrival.scheduled,
        origin: flight.departure.iata,
        destination: flight.arrival.iata,
        price: "N/A", // Aviation Stack doesn't provide pricing
        availableSeats: "N/A", // Aviation Stack doesn't provide seat information
      }));

      setAvailableFlights(transformedFlights);
    } catch (err) {
      setError("Error fetching flights: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookings-container">
      <nav className="navbar">
        <div className="nav-brand">SkyWay Airlines</div>
        <button className="back-btn" onClick={handleBack}>
          Back to Home
        </button>
      </nav>

      <div className="booking-content">
        <h1>Book Your Flight</h1>
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Origin</label>
            <input
              type="text"
              name="origin"
              value={bookingData.origin}
              onChange={handleChange}
              placeholder="Departure City"
              required
            />
          </div>

          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              value={bookingData.destination}
              onChange={handleChange}
              placeholder="Arrival City"
              required
            />
          </div>

          <div className="form-group">
            <label>Departure Date</label>
            <input
              type="date"
              name="departureDate"
              value={bookingData.departureDate}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Search Flights
          </button>
        </form>
        {/* Display error if any */}
        {error && <div className="error-message">{error}</div>}

        {/* Display available flights */}
        {availableFlights.length > 0 && (
          <div className="available-flights">
            <h2>Available Flights</h2>
            <div className="flights-grid">
              {availableFlights.map((flight) => (
                <div key={flight.id} className="flight-card">
                  <h3>{flight.airline}</h3>
                  <div className="flight-details">
                    <p>Flight Number: {flight.flightNumber}</p>
                    <p>Departure: {flight.departureTime}</p>
                    <p>Arrival: {flight.arrivalTime}</p>
                    <p>Price: ${flight.price}</p>
                    <p>Available Seats: {flight.availableSeats}</p>
                    <button
                      className="select-flight-btn"
                      onClick={() => handleSelectFlight(flight)}
                    >
                      Select Flight
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
