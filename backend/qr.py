import qrcode
import os

# alokkumarbharti31-2@oksbi

def generate_upi_qr(upi_id, name, amount):
    # Create UPI URL
    upi_url = f"upi://pay?pa={upi_id}&pn={name}&am={amount}&cu=INR"
    
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(upi_url)
    qr.make(fit=True)
    
    # Save QR code as image
    img = qr.make_image(fill_color="black", back_color="white")
    img.show()

    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(current_dir, f"upi_qr_{amount}.png")
    img.save(output_path)

# Example
generate_upi_qr("alokkumarbharti31-2@oksbi", "Alok kumar", 100)