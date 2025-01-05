// Confirmation.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import "./Confirmation.css";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails, totalPrice } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);

  // console.log("Booking Details:", bookingDetails);
  // console.log("Price:", totalPrice);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    navigate("/airline-home");
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: "Flight Booking Confirmation",
      author: "SkyWay Airlines",
      subject: "Flight Ticket",
      keywords: "flight, booking, confirmation",
    });

    // Create gradient header
    const pageWidth = doc.internal.pageSize.width;
    const headerHeight = 30;

    // Draw gradient header using multiple rectangles to simulate gradient
    const steps = 40; // number of rectangles to create smooth gradient
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;

      // Calculate gradient colors
      const r = Math.round(6 + (142 - 6) * ratio); // from #0646b4 to #8e10e1
      const g = Math.round(70 + (16 - 70) * ratio);
      const b = Math.round(180 + (225 - 180) * ratio);

      doc.setFillColor(r, g, b);
      doc.rect(
        (pageWidth * i) / steps,
        0,
        pageWidth / steps + 1, // +1 to avoid gaps
        headerHeight,
        "F"
      );
    }

    // Add white text over gradient
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("SkyWay Airlines", 105, 15, { align: "center" });
    doc.setFontSize(16);
    doc.text("Booking Confirmation", 105, 25, { align: "center" });

    // Reset text color for content
    doc.setTextColor(0, 0, 0);

    // Add booking reference section
    doc.setFontSize(12);
    doc.setDrawColor(6, 70, 180);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    let yPos = 50;

    // Booking Reference
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Booking Reference:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(bookingDetails.bookingId || "N/A", 80, yPos);

    yPos += 10;

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Booking Date:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(bookingDetails.bookingDate || "N/A", 80, yPos);

    yPos += 20;

    // Flight Details Section
    doc.setFillColor(246, 246, 246);
    doc.rect(20, yPos, 170, 10, "F");
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Flight Details", 25, yPos + 7);

    yPos += 20;
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");

    // Helper function to add row
    const addRow = (label, value) => {
      doc.text(label, 25, yPos);
      doc.text(value, 100, yPos);
      yPos += 10;
    };

    if (bookingDetails.flightDetails) {
      addRow("Origin:", bookingDetails.flightDetails.origin || "N/A");
      addRow("Destination:", bookingDetails.flightDetails.destination || "N/A");
      addRow(
        "Date & Time:",
        bookingDetails.flightDetails.departureTime || "N/A"
      );
      addRow(
        "Flight Number:",
        bookingDetails.flightDetails.flightNumber || "N/A"
      );
    }

    yPos += 10;

    doc.setFillColor(246, 246, 246);
    doc.rect(20, yPos, 170, 10, "F");
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Passenger Details", 25, yPos + 7);

    yPos += 20;
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");

    // Add passenger details
    if (bookingDetails.passengerInfo) {
      addRow("Name:", bookingDetails.passengerInfo.fullname || "N/A");
      addRow("Email:", bookingDetails.passengerInfo.email || "N/A");
      addRow("Phone:", bookingDetails.passengerInfo.phone || "N/A");
      addRow("Class:", bookingDetails.passengerInfo.classtype || "N/A");
    }

    yPos += 20;
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(`Total Amount: Rs ${totalPrice}`, 22, yPos);

    const qrData = JSON.stringify({
      bookingId: bookingDetails.bookingId,
      bookingDate: bookingDetails.bookingDate,
      flightDetails: bookingDetails.flightDetails,
      passengerInfo: bookingDetails.passengerInfo,
      totalPrice: totalPrice,
    });

    QRCode.toDataURL(qrData)
      .then((qrCodeUrl) => {
        const qrSize = 40; // QR code size
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;

        // Position QR code at bottom right with some padding
        const qrX = pageWidth - qrSize - 15; // 15 units padding from right
        const qrY = pageHeight - qrSize - 35; // 35 units padding from bottom to accommodate footer

        // Add QR code
        doc.addImage(qrCodeUrl, "PNG", qrX, qrY, qrSize, qrSize);

        // Add text below QR code
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(
          "Scan to verify",
          qrX + qrSize / 2, // Center align with QR code
          qrY + qrSize + 5, // 5 units padding below QR code
          { align: "center" }
        );

        const footerY = 273;
        for (let i = 0; i < steps; i++) {
          const ratio = i / steps;
          const r = Math.round(6 + (142 - 6) * ratio);
          const g = Math.round(70 + (16 - 70) * ratio);
          const b = Math.round(180 + (225 - 180) * ratio);

          doc.setFillColor(r, g, b);
          doc.rect(
            (pageWidth * i) / steps,
            footerY,
            pageWidth / steps + 1,
            25,
            "F"
          );
        }

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text("Thank you for choosing SkyWay Airlines", 105, footerY + 10, {
          align: "center",
        });
        doc.text("This is a computer generated document", 105, footerY + 15, {
          align: "center",
        });

        doc.save("flight-booking.pdf");
      })
      .catch((err) => {
        console.error("QR code generation error:", err);
      });
  };

  return (
    <div className="confirmation-page">
      <nav className="navbar">
        <div className="nav-brand">SkyWay Airlines</div>
        <button className="back-btn" onClick={handleLogout}>
          Back to Home
        </button>
      </nav>

      <div className="confirmation-main-content">
        <div className="flight-confirmation-wrapper">
          {isLoading ? (
            <>
              <h2 className="flight-confirmation-title">
                Generating your flight ticket...
              </h2>
              <div className="flight-spinner-wrapper">
                <div className="flight-spinner"></div>
                <p className="flight-waiting-text">Please wait</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="flight-confirmation-title">
                Your flight ticket is ready!
              </h2>
              <p className="flight-confirmation-message">
                You can now download your flight ticket for future reference.
              </p>
              <button className="flight-download-btn" onClick={generatePDF}>
                Download Ticket
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
