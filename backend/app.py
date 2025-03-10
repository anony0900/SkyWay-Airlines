from flask import Flask, jsonify, send_file, render_template, request, redirect, url_for, flash, session
from flask_cors import CORS
import random
import string
from io import BytesIO
import io
import base64
from pymongo import MongoClient, errors
import qrcode
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from datetime import datetime


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


app.secret_key = ''
uri = "mongodb+srv:..."

client = MongoClient(uri)

db = client["airline"]

collection1 = db["customers"]
collection2 = db["bookings"]


# Function to generate random alphanumeric string
def generate_captcha_text(length=6):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

# Function to generate captcha image and return base64 string
def generate_captcha():
    # Generate random text
    captcha_text = generate_captcha_text()
    
    # Create image
    width, height = 200, 60
    image = Image.new('RGB', (width, height), (255, 255, 255))
    font = ImageFont.truetype("arial.ttf", 40)
    draw = ImageDraw.Draw(image)
    
    # Add text to image
    text_width = draw.textlength(captcha_text, font=font)
    text_height = 40
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    draw.text((x, y), captcha_text, font=font, fill=(0, 0, 0))
    
    # Add noise (dots)
    for _ in range(1000):
        x = random.randint(0, width)
        y = random.randint(0, height)
        draw.point((x, y), fill=(random.randint(0, 255), 
                                random.randint(0, 255), 
                                random.randint(0, 255)))
    
    # Convert image to base64
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return {'image': img_str, 'text': captcha_text}

# Add these new routes to your Flask application
@app.route('/api/get-captcha', methods=['GET'])
def get_captcha():
    captcha_data = generate_captcha()
    return jsonify({'captcha_image': captcha_data['image'], 'captcha_text': captcha_data['text']})



@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user_captcha = data['captcha']

    if not user_captcha:
        return jsonify({'message': 'Invalid captcha'}), 400
    try:
        user = collection1.find_one({'email': email, 'password': password})

        if user:
            return jsonify({'message': 'User logged in successfully',
            'token:': "asdf1245bm"})
        else:
            return jsonify({'message': 'User login failed'})

    except errors.ConnectionFailure:
        return "Error: Unable to connect to the database."

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    password = data["password"]
    user_captcha = data['captcha']
    
    # Verify captcha
    if not user_captcha:
        return jsonify({'message': 'Invalid captcha'}), 400

    try:
        collection1.insert_one({'name': name, 'email': email, 'password': password})
        return jsonify({'message': 'User registered successfully',
        'token:': "asdf1245bm"})

    except errors.ConnectionFailure:
        return "Error: Unable to connect to the database."

@app.route('/api/booking', methods=['POST'])
def booking():
    metadata = request.get_json()
    if metadata:
        print(metadata)
    data = metadata.get("bookingDetails", {})
    print(data)
    try:
        price = data.get("totalPrice")
        booking_date = data.get("bookingDate")
        booking_Id = data.get("bookingId")

        flight_details = data.get("flightDetails", {})
        airline = flight_details.get("airline")
        arrival_time = flight_details.get("arrivalTime")
        departure_time = flight_details.get("departureTime")
        destination = flight_details.get("destination")
        flight_number = flight_details.get("flightNumber")
        origin = flight_details.get("origin")

        passenger_info = data.get("passengerInfo", {})
        passenger_class = passenger_info.get("classtype")
        email = passenger_info.get("email")
        fullname = passenger_info.get("fullname")
        phone = passenger_info.get("phone")

        # Database entry
        booking_data = {
            "Booking_Date": booking_date,
            "Booking_ID": booking_Id,
            "Flight_Details": {
                "Airline": airline,
                "Flight_Number": flight_number,
                "Arrival_Time": arrival_time,
                "Departure_Time": departure_time,
                "origin": origin,
                "Destination": destination,
            },
            "passengerInfo": {
                "Full_Name": fullname,
                "Phone": phone,
                "Email": email,
                "Class_Type": passenger_class,
            },
            "Price": price,
        }

        # Insert the data into the database
        collection2.insert_one(booking_data)
        return jsonify({"message": "Booking successful"})

    except errors.ConnectionFailure:
        return "Error: Unable to connect to the database."

    except Exception as e:
        return jsonify({"error": str(e)})

    

@app.route('/api/bookinghistory', methods=['POST'])
def get_bookings():
    try:
        # Extract the email from the request JSON
        data = request.get_json()
        email = data.get('email') if data else None
        
        if not email:
            return jsonify({"error": "Email parameter is required"}), 400

        # Query the database for bookings with the provided email
        bookings = list(collection2.find({"passengerInfo.Email": email}, {"_id": 0}))
        print("bookings",bookings)
        if bookings:
            return jsonify(bookings), 200
        else:
            return jsonify({
                "message": "No bookings found for this email",
                "data": []
            }), 200 

    except errors.ConnectionFailure as e:
        print(f"Database connection error: {str(e)}")
        return jsonify({"error": "Unable to connect to the database"}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Something went wrong"}), 500



@app.route('/api/payment', methods=['GET'])
def generate_upi_qr():
    amount = request.args.get('amount', type=float)
    if not amount:
        return jsonify({'error': 'Amount is required'}), 400
    upi_id = "alokkumarbharti31-2@oksbi"
    name = "Alokkumar Bharti"
    upi_url = f"upi://pay?pa={upi_id}&pn={name}&am={amount}&cu=INR"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(upi_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="gold", back_color="black")


    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype='image/png', as_attachment=False)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
