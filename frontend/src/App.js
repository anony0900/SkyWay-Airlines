import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import AirlineHome from "./components/AirlineHome";
import Bookings from "./components/Bookings";
import BookingHistory from "./components/BookingHistory";
import FlightStatus from "./components/FlightStatus";
import BookingConfirmation from "./components/BookingConfirmation";
import BookingSummary from "./components/BookingSummary";
import Payment from "./components/Payment";
import Confirmation from "./components/Confirmation";
import ProtectedRoute from "./components/ProtectedRoute";
import InfoPages from "./components/InfoPages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route
          path="/airline-home"
          element={
            <ProtectedRoute>
              <AirlineHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-history"
          element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flight-status"
          element={
            <ProtectedRoute>
              <FlightStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-confirmation"
          element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-summary"
          element={
            <ProtectedRoute>
              <BookingSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate-flight-ticket"
          element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/info"
          element={
            <ProtectedRoute>
              <InfoPages />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
