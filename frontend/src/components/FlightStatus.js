import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FlightStatus.css";

const FlightStatus = () => {
  const [flightNumber, setFlightNumber] = useState("");
  const [date, setDate] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleBack = () => {
    navigate("/airline-home");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const ACCESS_KEY = "e96a878c1430488600bfdc65f391d264";

    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://api.aviationstack.com/v1/flights?access_key=${ACCESS_KEY}&flight_iata=${flightNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flight status");
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const selectedFlight = data.data.find((flight) => {
          const flightDate = new Date(flight.flight_date)
            .toISOString()
            .split("T")[0];
          return flightDate === date;
        });

        if (selectedFlight) {
          const formattedResult = {
            flightNumber: selectedFlight.flight.iata,
            status: getStatusText(selectedFlight.flight_status),
            departure: {
              time: formatTime(selectedFlight.departure.scheduled),
              terminal: selectedFlight.departure.terminal || "N/A",
              gate: selectedFlight.departure.gate || "N/A",
              airport: `${selectedFlight.departure.airport} (${selectedFlight.departure.iata})`,
            },
            arrival: {
              time: formatTime(selectedFlight.arrival.scheduled),
              terminal: selectedFlight.arrival.terminal || "N/A",
              gate: selectedFlight.arrival.gate || "N/A",
              airport: `${selectedFlight.arrival.airport} (${selectedFlight.arrival.iata})`,
            },
            airline: selectedFlight.airline.name,
          };
          setSearchResult(formattedResult);
        } else {
          setError("No flight found for the specified date");
        }
      } else {
        setError("Flight not found");
      }
    } catch (error) {
      console.error("Error fetching flight status:", error);
      setError("Unable to fetch flight status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      scheduled: "On Time",
      active: "In Air",
      landed: "Landed",
      cancelled: "Cancelled",
      incident: "Incident",
      diverted: "Diverted",
      delayed: "Delayed",
    };
    return statusMap[status] || status;
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flight-status-container">
      <nav className="navbar">
        <div className="nav-brand">SkyWay Airlines</div>
        <button onClick={handleBack} className="back-btn">
          Back to Home
        </button>
      </nav>

      <div className="main-contents">
        <h1>Check Flight Status</h1>

        <div className="search-form">
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label>Flight Number</label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="Enter flight number (e.g., AA123)"
                required
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="search-btn">
              Search Flight
            </button>
          </form>
        </div>

        {loading && <div className="loading">Searching for flight...</div>}

        {error && <div className="error-message">{error}</div>}

        {searchResult && !loading && (
          <div className="flight-details">
            <h2>Flight Details</h2>
            <div className="detail-row">
              <span>Flight Number:</span>
              <span>{searchResult.flightNumber}</span>
            </div>
            <div className="detail-row">
              <span>Airline:</span>
              <span>{searchResult.airline}</span>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <span className={`status ${searchResult.status.toLowerCase()}`}>
                {searchResult.status}
              </span>
            </div>

            <div className="flight-section">
              <h3>Departure</h3>
              <div className="detail-row">
                <span>Airport:</span>
                <span>{searchResult.departure.airport}</span>
              </div>
              <div className="detail-row">
                <span>Time:</span>
                <span>{searchResult.departure.time}</span>
              </div>
              <div className="detail-row">
                <span>Terminal:</span>
                <span>{searchResult.departure.terminal}</span>
              </div>
              <div className="detail-row">
                <span>Gate:</span>
                <span>{searchResult.departure.gate}</span>
              </div>
            </div>

            <div className="flight-section">
              <h3>Arrival</h3>
              <div className="detail-row">
                <span>Airport:</span>
                <span>{searchResult.arrival.airport}</span>
              </div>
              <div className="detail-row">
                <span>Time:</span>
                <span>{searchResult.arrival.time}</span>
              </div>
              <div className="detail-row">
                <span>Terminal:</span>
                <span>{searchResult.arrival.terminal}</span>
              </div>
              <div className="detail-row">
                <span>Gate:</span>
                <span>{searchResult.arrival.gate}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightStatus;
