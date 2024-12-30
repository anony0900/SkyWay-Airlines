import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingHistory.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch booking history from your API
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookinghistory');
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch booking history');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/airline-home');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="booking-history">
      <nav className="navbar">
        <div className="nav-brand">SkyWay Airlines</div>
        <button onClick={handleBack} className="back-btn">Back to Home</button>
      </nav>

      <div className="booking-main-content">
        <h1>My Booking History</h1>
        <div className="bookings-container">
          {bookings.length === 0 ? (
            <p className="no-bookings">No bookings found</p>
          ) : (
            bookings.map((booking, index) => (
              <div key={index} className="booking-card">
                <div className="booking-header">
                  <h3>Flight: {booking.flight}</h3>
                  <span className="booking-status">Confirmed</span>
                </div>
                <div className="booking-details">
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Seat:</strong> {booking.seat}</p>
                  <p><strong>Passenger:</strong> {booking.name}</p>
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
