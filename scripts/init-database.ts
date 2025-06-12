import { carService, customerService, bookingService } from "../services/firebase-service"

async function initializeDatabase() {
  console.log("Initializing Vats Rental database...")

  try {
    // Add sample cars
    console.log("Adding sample cars...")
    const cars = [
      {
        make: "Maruti",
        model: "Swift",
        year: 2022,
        fuelType: "Petrol",
        transmission: "Manual",
        plateNumber: "MH-04-AB-1234",
        status: "Available" as const,
      },
      {
        make: "Hyundai",
        model: "Creta",
        year: 2023,
        fuelType: "Diesel",
        transmission: "Automatic",
        plateNumber: "MH-04-CD-5678",
        status: "Available" as const,
      },
      {
        make: "Tata",
        model: "Nexon",
        year: 2021,
        fuelType: "Petrol",
        transmission: "Manual",
        plateNumber: "MH-04-EF-9012",
        status: "Under Maintenance" as const,
      },
      {
        make: "Mahindra",
        model: "XUV300",
        year: 2022,
        fuelType: "Diesel",
        transmission: "Manual",
        plateNumber: "MH-04-GH-3456",
        status: "Available" as const,
      },
      {
        make: "Honda",
        model: "City",
        year: 2023,
        fuelType: "Petrol",
        transmission: "CVT",
        plateNumber: "MH-04-IJ-7890",
        status: "Available" as const,
      },
    ]

    for (const car of cars) {
      await carService.addCar(car)
    }

    // Add sample customers
    console.log("Adding sample customers...")
    const customers = [
      {
        name: "Rajesh Kumar",
        phone: "+91 9876543210",
        address: "Thane West, Maharashtra 400601",
        customerId: "VATS-CUST-001",
      },
      {
        name: "Priya Sharma",
        phone: "+91 8765432109",
        address: "Kalyan, Maharashtra 421301",
        customerId: "VATS-CUST-002",
      },
      {
        name: "Amit Patel",
        phone: "+91 7654321098",
        address: "Dombivli, Maharashtra 421201",
        customerId: "VATS-CUST-003",
      },
      {
        name: "Sunita Joshi",
        phone: "+91 6543210987",
        address: "Bhiwandi, Maharashtra 421302",
        customerId: "VATS-CUST-004",
      },
      {
        name: "Vikram Singh",
        phone: "+91 5432109876",
        address: "Ulhasnagar, Maharashtra 421003",
        customerId: "VATS-CUST-005",
      },
    ]

    for (const customer of customers) {
      await customerService.addCustomer(customer)
    }

    // Add sample bookings
    console.log("Adding sample bookings...")
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const bookings = [
      {
        bookingId: "VAT-20241212-001",
        customerId: "VATS-CUST-001",
        customerName: "Rajesh Kumar",
        carId: "car1", // This would be the actual Firebase document ID
        carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
        startDate: today.toISOString().split("T")[0],
        endDate: tomorrow.toISOString().split("T")[0],
        duration: 1,
        advanceAmount: 5000,
        totalAmount: 15000,
        paymentMode: "Cash",
        status: "Active" as const,
        notes: "Wedding function",
      },
      {
        bookingId: "VAT-20241210-002",
        customerId: "VATS-CUST-002",
        customerName: "Priya Sharma",
        carId: "car2",
        carDetails: "Hyundai Creta 2023 (MH-04-CD-5678)",
        startDate: "2024-12-10",
        endDate: "2024-12-12",
        duration: 2,
        advanceAmount: 8000,
        totalAmount: 20000,
        paymentMode: "UPI",
        status: "Returned" as const,
      },
    ]

    for (const booking of bookings) {
      await bookingService.addBooking(booking)
    }

    console.log("Database initialization completed successfully!")
    console.log("Sample data added:")
    console.log(`- ${cars.length} cars`)
    console.log(`- ${customers.length} customers`)
    console.log(`- ${bookings.length} bookings`)
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

// Run the initialization
initializeDatabase()
