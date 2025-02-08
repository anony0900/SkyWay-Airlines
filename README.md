# SkyWay Airlines - Flight Ticket Booking Web App

SkyWay Airlines is a full-featured flight booking web application built using React and Flask. It includes CAPTCHA and email OTP verification for secure signup and login. The app integrates the AviationStack API to fetch flight details, enables users to book tickets, check flight status, view booking history, and manage their profiles. Ticket generation is implemented after successful payment.

## Features
- Secure signup/login with CAPTCHA and email OTP verification
- Flight search and booking functionality
- Flight status checking
- Booking history and user profile management
- AviationStack API integration for real-time flight details
- Ticket generation after payment confirmation

## Technologies Used
- Frontend: React (JavaScript, CSS)
- Backend: Flask (Python)
- Database: MongoDB
- API: AviationStack API for flight details
- Authentication: Email OTP verification & CAPTCHA

## Installation & Setup
### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run the Flask backend:
   ```sh
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```

## File Structure
```
SkyWay-Airlines/
│── backend/
│   │── app.py            # Main Flask app
│   │── key.py            # API key management
│   │── qr.py             # QR code generation (if applicable)
│   │── requirements.txt  # Backend dependencies
│
│── frontend/
│   │── public/
│   │── src/
│       │── components/
│       │── App.js            # Main React component
│       │── App.css           # Styles
│       │── index.js          # Entry point
│       │── index.css         # Global styles
│       │── reportWebVitals.js
│       │── setupTests.js
│
```

## Usage
1. Register an account using email OTP verification.
2. Log in with secure authentication.
3. Search for available flights using the integrated AviationStack API.
4. Book a flight and proceed with payment.
5. View booking history and check flight status.
6. Manage user profile and personal details.

## API Integration
- **AviationStack API**: Used to fetch real-time flight details and status updates.

## Contributions
Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.

## Author
Alokkumar Bharti(https://github.com/anony0900)

