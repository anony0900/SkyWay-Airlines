import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import AirlineHome from './components/AirlineHome';
import Bookings from './components/Bookings';
import BookingHistory from './components/BookingHistory';
import FlightStatus from './components/FlightStatus';
import BookingConfirmation from './components/BookingConfirmation'
import BookingSummary from './components/BookingSummary';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/airline-home" element={<AirlineHome />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/flight-status" element={<FlightStatus />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/booking-summary" element={<BookingSummary />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/generate-flight-pdf" element={<Confirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
