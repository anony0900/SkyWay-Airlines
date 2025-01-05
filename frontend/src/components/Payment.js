import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(90);
  const { bookingDetails, totalPrice } = location.state || {};
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location.state) {
      navigate("/airline-home");
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Fetch the QR code after 2 seconds
      fetchQRCode(totalPrice);
    }, 2000);

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          alert("Time's up! Redirecting to home...");
          navigate("/airline-home");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup intervals and timeouts on component unmount
    return () => {
      clearTimeout(timer);
      clearInterval(timerInterval);
    };
  }, [location.state, totalPrice, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const fetchQRCode = async (totalPrice) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/payment?amount=${encodeURIComponent(
          totalPrice
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch QR code");
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setQrCodeUrl(imageUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  const generateBookingId = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
    const minute = now.getMinutes().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based

    const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const alpha1 =
      alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
    const alpha2 =
      alphanumeric[Math.floor(Math.random() * alphanumeric.length)];

    const bookingId = `${day}${hour}${alpha1}${year}${minute}${alpha2}${month}`;

    return bookingId;
  };

  const handlePaymentComplete = async () => {
    try {
      const bookingId = generateBookingId();

      bookingDetails.bookingId = bookingId;
      bookingDetails.totalPrice = totalPrice;
      console.log("Booking Response:", bookingDetails);

      const response = await fetch("http://127.0.0.1:5000/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const data = await response.json();

      navigate("/generate-flight-ticket", {
        state: {
          bookingDetails,
          totalPrice,
        },
      });
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };

  if (error) {
    return (
      <div className="payment-container">
        <div className="payment-box">
          <h3>Error loading payment details</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav
        className="navbar"
        style={{
          background: "linear-gradient(45deg, #0646b4 0%, #8e10e1 100%)",
        }}
      >
        <div className="nav-brand">SkyWay Airline</div>
        <button
          className="logout-btn"
          onClick={() => navigate("/airline-home")}
        >
          Cancel & Return Home
        </button>
      </nav>
      <div className="payment-containers">
        <div className="payment-box">
          <h2>Please Complete Your Payment</h2>

          <div className="qr-code-section">
            <h4>Scan QR Code to Pay ₹{totalPrice}</h4>

            <div>
              <p
                className={timeLeft <= 30 ? "timer-warning" : ""}
                style={{
                  color: timeLeft <= 30 ? "#ff0000" : "#000000",
                  fontSize: timeLeft <= 30 ? "1.2em" : "1em",
                }}
              >
                Time Left: {formatTime(timeLeft)}
              </p>
              <p>QR Code for payment will be valid until the timer ends.</p>
            </div>

            <div className="qr-code-container">
              {isLoading ? (
                <div style={{ margin: "20px", fontSize: "2.1em" }}>
                  Generating QR...
                </div>
              ) : qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Payment QR Code"
                  style={{
                    maxWidth: "300px",
                    margin: "20px auto",
                    display: "block",
                  }}
                />
              ) : (
                <p style={{ color: "red" }}>
                  Error loading QR code. Please try again.
                </p>
              )}
            </div>

            <p className="payment-instructions">
              1. Open your UPI-enabled payment app
              <br />
              2. Scan the QR code
              <br />
              3. Complete the payment
            </p>
            <button
              className="payment-complete-btn"
              onClick={handlePaymentComplete}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              I have completed the payment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
