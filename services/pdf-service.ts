import jsPDF from "jspdf"
import type { Booking, Customer, Car } from "./firebase-service"

export interface AgreementData {
  booking: Booking
  customer: Customer
  car: Car
  companyDetails: {
    name: string
    address: string
    phone: string
    email: string
  }
}

export const pdfService = {
  generateRentalAgreement(data: AgreementData): jsPDF {
    const doc = new jsPDF()
    const { booking, customer, car, companyDetails } = data

    // Company Header
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text(companyDetails.name, 105, 20, { align: "center" })

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(companyDetails.address, 105, 30, { align: "center" })
    doc.text(`Phone: ${companyDetails.phone} | Email: ${companyDetails.email}`, 105, 40, { align: "center" })

    // Title
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("CAR RENTAL AGREEMENT", 105, 60, { align: "center" })

    // Booking Details
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    let yPos = 80

    doc.text(`Booking ID: ${booking.bookingId}`, 20, yPos)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, yPos)
    yPos += 15

    // Customer Details Section
    doc.setFont("helvetica", "bold")
    doc.text("CUSTOMER DETAILS:", 20, yPos)
    yPos += 10

    doc.setFont("helvetica", "normal")
    doc.text(`Name: ${customer.name}`, 20, yPos)
    yPos += 8
    doc.text(`Phone: ${customer.phone}`, 20, yPos)
    yPos += 8
    doc.text(`Address: ${customer.address}`, 20, yPos)
    yPos += 8
    doc.text(`Customer ID: ${customer.customerId}`, 20, yPos)
    yPos += 15

    // Car Details Section
    doc.setFont("helvetica", "bold")
    doc.text("VEHICLE DETAILS:", 20, yPos)
    yPos += 10

    doc.setFont("helvetica", "normal")
    doc.text(`Make & Model: ${car.make} ${car.model}`, 20, yPos)
    yPos += 8
    doc.text(`Year: ${car.year}`, 20, yPos)
    doc.text(`Fuel Type: ${car.fuelType}`, 100, yPos)
    yPos += 8
    doc.text(`Transmission: ${car.transmission}`, 20, yPos)
    doc.text(`Plate Number: ${car.plateNumber}`, 100, yPos)
    yPos += 15

    // Rental Details Section
    doc.setFont("helvetica", "bold")
    doc.text("RENTAL DETAILS:", 20, yPos)
    yPos += 10

    doc.setFont("helvetica", "normal")
    doc.text(`Start Date: ${new Date(booking.startDate).toLocaleDateString()}`, 20, yPos)
    doc.text(`End Date: ${new Date(booking.endDate).toLocaleDateString()}`, 100, yPos)
    yPos += 8
    doc.text(`Duration: ${booking.duration} days`, 20, yPos)
    yPos += 8
    doc.text(`Advance Amount: ₹${booking.advanceAmount.toLocaleString()}`, 20, yPos)
    doc.text(`Payment Mode: ${booking.paymentMode}`, 100, yPos)
    yPos += 8
    if (booking.totalAmount) {
      doc.text(`Total Amount: ₹${booking.totalAmount.toLocaleString()}`, 20, yPos)
      yPos += 8
    }
    if (booking.notes) {
      doc.text(`Notes: ${booking.notes}`, 20, yPos)
      yPos += 15
    } else {
      yPos += 10
    }

    // Terms and Conditions
    doc.setFont("helvetica", "bold")
    doc.text("TERMS AND CONDITIONS:", 20, yPos)
    yPos += 10

    doc.setFont("helvetica", "normal")
    const terms = [
      "1. The renter must have a valid driving license.",
      "2. The vehicle must be returned in the same condition.",
      "3. Any damage to the vehicle will be charged separately.",
      "4. Late return charges apply after the agreed time.",
      "5. The renter is responsible for all traffic violations.",
      "6. Insurance coverage is limited as per policy terms.",
      "7. No smoking or pets allowed in the vehicle.",
    ]

    terms.forEach((term) => {
      doc.text(term, 20, yPos)
      yPos += 6
    })

    yPos += 15

    // Signature Section
    doc.setFont("helvetica", "bold")
    doc.text("SIGNATURES:", 20, yPos)
    yPos += 15

    doc.setFont("helvetica", "normal")
    doc.text("Customer Signature:", 20, yPos)
    doc.text("Company Representative:", 120, yPos)
    yPos += 20

    doc.text("_____________________", 20, yPos)
    doc.text("_____________________", 120, yPos)
    yPos += 10

    doc.text(`${customer.name}`, 20, yPos)
    doc.text("Authorized Signatory", 120, yPos)
    yPos += 5

    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, yPos)

    // Footer
    doc.setFontSize(10)
    doc.text("This is a computer generated document and does not require physical signature.", 105, 280, {
      align: "center",
    })

    return doc
  },

  async downloadAgreement(data: AgreementData) {
    const doc = this.generateRentalAgreement(data)
    doc.save(`rental-agreement-${data.booking.bookingId}.pdf`)
  },

  async getAgreementBlob(data: AgreementData): Promise<Blob> {
    const doc = this.generateRentalAgreement(data)
    return doc.output("blob")
  },
}
