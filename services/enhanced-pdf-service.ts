import jsPDF from "jspdf"
import type { Booking, Customer, Car } from "@/lib/mock-data"

export interface EnhancedAgreementData {
  booking: Booking
  customer: Customer
  car: Car
  companyDetails: {
    name: string
    address: string
    phone: string
    email: string
    website?: string
    gst?: string
    logo?: string
  }
  terms?: string[]
  additionalClauses?: string[]
}

export class EnhancedPDFService {
  private addHeader(doc: jsPDF, companyDetails: EnhancedAgreementData["companyDetails"]) {
    // Company Logo (if available)
    if (companyDetails.logo) {
      // doc.addImage(companyDetails.logo, 'PNG', 20, 10, 30, 30)
    }

    // Company Name
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(44, 62, 80)
    doc.text(companyDetails.name, 105, 25, { align: "center" })

    // Company Details
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    doc.text(companyDetails.address, 105, 35, { align: "center" })

    let contactLine = `Phone: ${companyDetails.phone} | Email: ${companyDetails.email}`
    if (companyDetails.website) {
      contactLine += ` | ${companyDetails.website}`
    }
    doc.text(contactLine, 105, 42, { align: "center" })

    if (companyDetails.gst) {
      doc.text(`GST: ${companyDetails.gst}`, 105, 49, { align: "center" })
    }

    // Decorative line
    doc.setDrawColor(52, 152, 219)
    doc.setLineWidth(2)
    doc.line(20, 55, 190, 55)

    return 65 // Return next Y position
  }

  private addTitle(doc: jsPDF, yPos: number): number {
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(44, 62, 80)
    doc.text("CAR RENTAL AGREEMENT", 105, yPos, { align: "center" })

    // Subtitle
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    doc.text("Terms and Conditions for Vehicle Rental", 105, yPos + 8, { align: "center" })

    return yPos + 20
  }

  private addBookingInfo(doc: jsPDF, booking: Booking, yPos: number): number {
    // Booking info box
    doc.setFillColor(248, 249, 250)
    doc.rect(20, yPos, 170, 25, "F")
    doc.setDrawColor(200, 200, 200)
    doc.rect(20, yPos, 170, 25)

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(44, 62, 80)
    doc.text(`Booking ID: ${booking.bookingId}`, 25, yPos + 8)
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 140, yPos + 8)

    doc.setFont("helvetica", "normal")
    doc.text(`Rental Period: ${booking.duration} days`, 25, yPos + 16)
    doc.text(`Status: ${booking.status}`, 140, yPos + 16)

    return yPos + 35
  }

  private addParticipantDetails(doc: jsPDF, customer: Customer, car: Car, yPos: number): number {
    // Customer Section
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(44, 62, 80)
    doc.text("CUSTOMER DETAILS", 20, yPos)

    yPos += 10
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(60, 60, 60)

    const customerDetails = [
      [`Name:`, customer.name],
      [`Phone:`, customer.phone],
      [`Address:`, customer.address],
      [`Customer ID:`, customer.customerId],
    ]

    customerDetails.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold")
      doc.text(label, 20, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(value, 60, yPos)
      yPos += 6
    })

    // Document verification section
    yPos += 5
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(44, 62, 80)
    doc.text("DOCUMENT VERIFICATION", 20, yPos)

    yPos += 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    const documentDetails = [
      [`Aadhar Card:`, customer.aadharUrl ? "✓ Verified & Uploaded" : "✗ Not Provided"],
      [`Driving License:`, customer.dlUrl ? "✓ Verified & Uploaded" : "✗ Not Provided"],
      [`Customer Photo:`, customer.photoUrl ? "✓ Captured & Stored" : "✗ Not Captured"],
    ]

    documentDetails.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold")
      doc.text(label, 20, yPos)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(value.includes("✓") ? 0 : 255, value.includes("✓") ? 128 : 0, 0)
      doc.text(value, 80, yPos)
      doc.setTextColor(60, 60, 60)
      yPos += 6
    })

    yPos += 8

    // Vehicle Section
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(44, 62, 80)
    doc.text("VEHICLE DETAILS", 20, yPos)

    yPos += 10
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    const vehicleDetails = [
      [`Make & Model:`, `${car.make} ${car.model}`],
      [`Year:`, car.year.toString()],
      [`Fuel Type:`, car.fuelType],
      [`Transmission:`, car.transmission],
      [`Registration:`, car.plateNumber],
      [`Vehicle Status:`, car.status],
    ]

    vehicleDetails.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold")
      doc.text(label, 20, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(value, 60, yPos)
      yPos += 6
    })

    return yPos + 10
  }

  private addRentalDetails(doc: jsPDF, booking: Booking, yPos: number): number {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(44, 62, 80)
    doc.text("RENTAL DETAILS & FINANCIAL BREAKDOWN", 20, yPos)

    yPos += 10
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    const rentalDetails = [
      [`Start Date & Time:`, `${new Date(booking.startDate).toLocaleDateString("en-IN")} at ${booking.startTime}`],
      [`End Date & Time:`, `${new Date(booking.endDate).toLocaleDateString("en-IN")} at ${booking.endTime}`],
      [`Duration:`, `${booking.duration} days`],
    ]

    // Add daily rate if available
    if (booking.dailyRate) {
      rentalDetails.push([`Daily Rate:`, `₹${booking.dailyRate.toLocaleString()}/day`])
    }

    if (booking.totalAmount) {
      rentalDetails.push([`Total Rental Amount:`, `₹${booking.totalAmount.toLocaleString()}`])
    }

    rentalDetails.push(
      [`Rent Received:`, `₹${booking.totalRentReceived.toLocaleString()}`],
      [`Security Deposit:`, `₹${booking.depositAmount.toLocaleString()}`],
      [`Payment Mode:`, booking.paymentMode],
    )

    // Calculate pending rent
    if (booking.totalAmount && booking.totalRentReceived < booking.totalAmount) {
      const pendingRent = booking.totalAmount - booking.totalRentReceived
      rentalDetails.push([`Rent Pending:`, `₹${pendingRent.toLocaleString()}`])
    }

    rentalDetails.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold")
      doc.text(label, 20, yPos)
      doc.setFont("helvetica", "normal")
      // Highlight important amounts
      if (label.includes("Total") || label.includes("Pending")) {
        doc.setTextColor(220, 53, 69) // Red for important amounts
      } else if (label.includes("Deposit")) {
        doc.setTextColor(255, 165, 0) // Orange for deposit
      } else if (label.includes("Received")) {
        doc.setTextColor(0, 128, 0) // Green for received amounts
      }
      doc.text(value, 90, yPos)
      doc.setTextColor(60, 60, 60) // Reset color
      yPos += 6
    })

    // Time-specific terms
    yPos += 5
    doc.setFontSize(9)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(100, 100, 100)
    doc.text("* Vehicle must be picked up and returned at the specified times", 20, yPos)
    yPos += 4
    doc.text("* Late return charges apply after the agreed return time", 20, yPos)
    yPos += 4
    doc.text("* Security deposit is refundable upon vehicle return in good condition", 20, yPos)
    yPos += 4
    doc.text("* Any damages or violations will be deducted from the security deposit", 20, yPos)
    yPos += 6

    if (booking.notes) {
      yPos += 5
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(60, 60, 60)
      doc.text("Special Notes:", 20, yPos)
      yPos += 6
      doc.setFont("helvetica", "normal")
      const notes = doc.splitTextToSize(booking.notes, 150)
      doc.text(notes, 20, yPos)
      yPos += notes.length * 5
    }

    return yPos + 10
  }

  private addDocumentRequirements(doc: jsPDF, customer: Customer, yPos: number): number {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(44, 62, 80)
    doc.text("DOCUMENT REQUIREMENTS & VERIFICATION", 20, yPos)

    yPos += 10
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(60, 60, 60)

    const requirements = [
      "1. Valid Aadhar Card (Original + Photocopy) - " + (customer.aadharUrl ? "✓ Submitted" : "✗ Pending"),
      "2. Valid Driving License (Original + Photocopy) - " + (customer.dlUrl ? "✓ Submitted" : "✗ Pending"),
      "3. Customer Photograph - " + (customer.photoUrl ? "✓ Captured" : "✗ Pending"),
      "4. All documents have been verified and copies retained by the rental company.",
      "5. Customer declares that all provided documents are genuine and valid.",
      "6. Security deposit is held as guarantee for vehicle return and damage coverage.",
    ]

    requirements.forEach((requirement) => {
      const color = requirement.includes("✓") ? [0, 128, 0] : requirement.includes("✗") ? [255, 0, 0] : [60, 60, 60]
      doc.setTextColor(color[0], color[1], color[2])
      const splitText = doc.splitTextToSize(requirement, 170)
      doc.text(splitText, 20, yPos)
      yPos += splitText.length * 4 + 2
    })

    return yPos + 10
  }

  private addTermsAndConditions(doc: jsPDF, yPos: number, customTerms?: string[]): number {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(44, 62, 80)
    doc.text("TERMS AND CONDITIONS", 20, yPos)

    yPos += 10
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(60, 60, 60)

    const defaultTerms = [
      "The renter must possess a valid driving license and be at least 21 years of age.",
      "The vehicle must be returned in the same condition as received, normal wear excepted.",
      "Security deposit is refundable upon vehicle return in good condition within 7 working days.",
      "Any damage to the vehicle will be assessed and deducted from the security deposit.",
      "Late return charges of ₹500 per hour will apply after the agreed return time.",
      "The renter is responsible for all traffic violations, fines, and penalties during the rental period.",
      "Insurance coverage is limited as per the policy terms. Renter is liable for damages exceeding coverage.",
      "Smoking, consumption of alcohol, and transportation of pets are strictly prohibited in the vehicle.",
      "The vehicle should not be used for commercial purposes or driven outside the agreed geographical limits.",
      "In case of breakdown or accident, the renter must immediately inform the rental company.",
      "The rental company reserves the right to terminate the agreement in case of misuse of the vehicle.",
      "All documents provided by the customer have been verified and found to be genuine.",
      "The customer is liable for any legal issues arising from false or invalid documents.",
      "Security deposit will be forfeited in case of theft, total loss, or major damage to the vehicle.",
    ]

    const terms = customTerms || defaultTerms

    terms.forEach((term, index) => {
      const termText = `${index + 1}. ${term}`
      const splitText = doc.splitTextToSize(termText, 170)
      doc.text(splitText, 20, yPos)
      yPos += splitText.length * 4 + 2
    })

    return yPos + 10
  }

  private addSignatureSection(doc: jsPDF, customer: Customer, yPos: number): number {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(44, 62, 80)
    doc.text("SIGNATURES & ACKNOWLEDGMENT", 20, yPos)

    yPos += 15

    // Document acknowledgment
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("I acknowledge that I have provided all required documents and they have been verified.", 20, yPos)
    yPos += 5
    doc.text("I agree to all terms and conditions mentioned in this agreement.", 20, yPos)
    yPos += 5
    doc.text("I understand that the security deposit is refundable upon proper vehicle return.", 20, yPos)
    yPos += 15

    // Customer signature
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Customer Signature:", 20, yPos)
    doc.text("Company Representative:", 120, yPos)

    yPos += 20
    doc.line(20, yPos, 80, yPos)
    doc.line(120, yPos, 180, yPos)

    yPos += 8
    doc.setFont("helvetica", "bold")
    doc.text(customer.name, 20, yPos)
    doc.text("Authorized Signatory", 120, yPos)

    yPos += 6
    doc.setFont("helvetica", "normal")
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 20, yPos)
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 120, yPos)

    return yPos + 15
  }

  private addFooter(doc: jsPDF, companyDetails: EnhancedAgreementData["companyDetails"]) {
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(150, 150, 150)
    doc.text("This is a computer-generated document. For any queries, please contact us.", 105, pageHeight - 15, {
      align: "center",
    })
    doc.text(`Generated on ${new Date().toLocaleString("en-IN")} | ${companyDetails.name}`, 105, pageHeight - 8, {
      align: "center",
    })
  }

  generateEnhancedRentalAgreement(data: EnhancedAgreementData): jsPDF {
    const doc = new jsPDF()
    const { booking, customer, car, companyDetails } = data

    let yPos = this.addHeader(doc, companyDetails)
    yPos = this.addTitle(doc, yPos)
    yPos = this.addBookingInfo(doc, booking, yPos)
    yPos = this.addParticipantDetails(doc, customer, car, yPos)
    yPos = this.addRentalDetails(doc, booking, yPos)

    // Check if we need a new page
    if (yPos > 180) {
      doc.addPage()
      yPos = 20
    }

    yPos = this.addDocumentRequirements(doc, customer, yPos)

    // Check if we need a new page
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }

    yPos = this.addTermsAndConditions(doc, yPos, data.terms)

    // Check if we need a new page for signatures
    if (yPos > 220) {
      doc.addPage()
      yPos = 20
    }

    this.addSignatureSection(doc, customer, yPos)
    this.addFooter(doc, companyDetails)

    return doc
  }

  async downloadEnhancedAgreement(data: EnhancedAgreementData) {
    const doc = this.generateEnhancedRentalAgreement(data)
    doc.save(`rental-agreement-${data.booking.bookingId}.pdf`)
  }

  async getEnhancedAgreementBlob(data: EnhancedAgreementData): Promise<Blob> {
    const doc = this.generateEnhancedRentalAgreement(data)
    return doc.output("blob")
  }
}

export const enhancedPdfService = new EnhancedPDFService()
