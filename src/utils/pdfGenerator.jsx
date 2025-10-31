import { Canvg } from 'canvg';
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { Logo } from '../assets/image';

const pdfGenerator = async (ticketDetails, qrRef) => {
  const getQRImageDataUrl = async () => {
    const svg = qrRef.current.querySelector("svg");
    const svgString = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const v = await Canvg.fromString(ctx, svgString);
    await v.render();
    return canvas.toDataURL("image/png");
  };

  const {
    ticketNumber,
    status,
    busId,
    passengers,
    seats,
    boardingPoint,
    droppingPoint,
    totalFare,
    contactInfo,
    boardingTime,
    droppingTime,
    bookedAt
  } = ticketDetails;

  const qrImageData = await getQRImageDataUrl();

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const margin = 40;
  const pageWidth = pdf.internal.pageSize.getWidth();
  let y = margin;

  // Header
  pdf.setFillColor("#f8f9fa");
  pdf.rect(margin - 10, y - 20, pageWidth - margin * 2 + 20, 70, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.setTextColor("#0c0f53");
  pdf.text("SAWARI BUS E-TICKET", pageWidth / 2, y + 15, { align: "center" });
  pdf.addImage(Logo, "PNG", margin, margin - 15, 50, 50);
  y += 50;

  pdf.setFontSize(10);
  pdf.setTextColor("#555");
  pdf.text("Your Trusted Travel Partner", pageWidth / 2, y + 30, { align: "center" });
  y += 60;

  // Divider line
  pdf.setDrawColor("#0c0f53");
  pdf.setLineWidth(1);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Ticket number & status
  pdf.setFontSize(12);
  pdf.setTextColor("#000");
  pdf.setFont("helvetica", "normal");
  pdf.text(`Ticket No: ${ticketNumber}`, margin, y);

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(status.toLowerCase() === "confirmed" ? "#28a745" : "#dc3545");
  pdf.text(`Status: ${status.toUpperCase()}`, pageWidth - margin - 100, y);
  y += 25;

  // Light divider
  pdf.setDrawColor("#ccc");
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Journey Details header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor("#0c0f53");
  pdf.text("Journey Details", margin, y);
  y += 15;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor("#000");

  // Journey details array for consistent layout
  const journeyDetails = [
    ["Journey Date", busId.departureDate],
    ["Route", `${busId.source} to ${busId.destination}`],
    ["Bus Operator", busId.operator],
    ["Bus Type", busId.busType],
    ["Boarding Point", `${boardingPoint} (${boardingTime})`],
    ["Dropping Point", `${droppingPoint} (${droppingTime})`],
  ];

  journeyDetails.forEach(([label, value]) => {
    pdf.text(`${label}:`, margin, y + 15);
    pdf.setFont("helvetica", "bold");
    pdf.text(value, margin + 120, y + 15);
    pdf.setFont("helvetica", "normal");
    y += 18;
  });

  y += 10;
  pdf.setDrawColor("#ccc");
  pdf.line(margin, y, pageWidth - margin, y);
  y += 25;

  // Passenger Details header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor("#0c0f53");
  pdf.text("Passenger Details", margin, y);
  y += 10;

  // Prepare passenger data for autoTable
  const passengerData = passengers.map((p, idx) => [
    idx + 1,
    p.name,
    p.gender,
    p.age,
    seats[idx],
  ]);

  // Passenger table
  autoTable(pdf, {
    startY: y + 10,
    head: [["#", "Name", "Gender", "Age", "Seat"]],
    body: passengerData,
    theme: "striped",
    headStyles: { fillColor: "#0c0f53", textColor: 255, halign: "center" },
    styles: { halign: "center", fontSize: 11, cellPadding: 6 },
    margin: { left: margin, right: margin },
  });

  y = pdf.lastAutoTable.finalY + 25;
  pdf.setDrawColor("#ccc");
  pdf.line(margin, y, pageWidth - margin, y);
  y += 25;

  // Fare Summary header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor("#0c0f53");
  pdf.text("Fare Summary", margin, y);
  y += 20;

  // Fare breakdown
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor("#000");
  pdf.text(`Base Fare: Rs.${(totalFare * 0.9).toFixed(2)}`, margin, y);
  y += 18;
  pdf.text(`GST (10%): Rs.${(totalFare * 0.1).toFixed(2)}`, margin, y);
  y += 18;

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor("#28a745");
  pdf.text(`Total Fare: Rs.${totalFare.toFixed(2)}`, margin, y);
  y += 25;
  pdf.setDrawColor("#ccc");
  pdf.line(margin, y, pageWidth - margin, y);
  y += 25;

  // Contact Information header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor("#0c0f53");
  pdf.text("Contact Information", margin, y);
  y += 20;

  // Contact info details
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor("#000");
  pdf.text(`Mobile: ${contactInfo.mobile}`, margin, y);
  y += 18;
  pdf.text(`Email: ${contactInfo.email}`, margin, y);
  y += 25;

  // Add QR code image bottom right
  const qrSize = 80;
  pdf.addImage(qrImageData, "PNG", pageWidth - qrSize - margin, y - 20, qrSize, qrSize);

  pdf.text(`Booked At: ${new Date(bookedAt).toLocaleString()}`,margin,y);
  y+=18;

  // Footer line
  pdf.setDrawColor("#0c0f53");
  pdf.setLineWidth(1);
  pdf.line(margin, pdf.internal.pageSize.height - 60, pageWidth - margin, pdf.internal.pageSize.height - 60);

  // Save the PDF with a filename
  pdf.save(`Sawari_Ticket_${ticketNumber}.pdf`);
};

export default pdfGenerator;
