export interface Customer {
  id: string
  customerId: string
  name: string
  phone: string
  address: string
  aadharUrl?: string
  dlUrl?: string
  photoUrl?: string
  createdAt: string
}

export interface Car {
  id: string
  make: string
  model: string
  year: number
  plateNumber: string
  fuelType: string
  transmission: string
  status: "Available" | "Rented" | "Maintenance"
  dailyRate?: number
}

export interface Booking {
  id?: string
  bookingId: string
  customerId: string
  customerName: string
  carId: string
  carDetails: string
  startDate: string
  endDate: string
  startTime: string // New field for pickup time
  endTime: string // New field for return time
  duration: number
  dailyRate?: number
  totalAmount?: number
  depositAmount: number
  totalRentReceived: number
  paymentMode: string
  status: "Active" | "Returned" | "Pending" | "Cancelled"
  notes?: string
  createdAt: string
  returnedAt?: string
  depositRefunded?: boolean
}

class MockDataService {
  private customers: Customer[] = [
    {
      id: "1",
      customerId: "VATS-CUST-001",
      name: "Rajesh Kumar",
      phone: "+91 9876543210",
      address: "123 Main Street, Thane, Maharashtra 400601",
      aadharUrl: "/mock-aadhar-1.jpg",
      dlUrl: "/mock-dl-1.jpg",
      photoUrl: "/mock-photo-1.jpg",
      createdAt: "2024-12-10",
    },
    {
      id: "2",
      customerId: "VATS-CUST-002",
      name: "Priya Sharma",
      phone: "+91 9876543211",
      address: "456 Oak Avenue, Mumbai, Maharashtra 400001",
      aadharUrl: "/mock-aadhar-2.jpg",
      dlUrl: "/mock-dl-2.jpg",
      photoUrl: "/mock-photo-2.jpg",
      createdAt: "2024-12-11",
    },
    {
      id: "3",
      customerId: "VATS-CUST-003",
      name: "Amit Patel",
      phone: "+91 9876543212",
      address: "789 Pine Road, Pune, Maharashtra 411001",
      createdAt: "2024-12-12",
    },
  ]

  private cars: Car[] = [
    {
      id: "1",
      make: "Maruti",
      model: "Swift",
      year: 2022,
      plateNumber: "MH-04-AB-1234",
      fuelType: "Petrol",
      transmission: "Manual",
      status: "Rented",
      dailyRate: 1500,
    },
    {
      id: "2",
      make: "Hyundai",
      model: "Creta",
      year: 2023,
      plateNumber: "MH-04-CD-5678",
      fuelType: "Diesel",
      transmission: "Automatic",
      status: "Available",
      dailyRate: 2500,
    },
    {
      id: "3",
      make: "Tata",
      model: "Nexon",
      year: 2021,
      plateNumber: "MH-04-EF-9012",
      fuelType: "Electric",
      transmission: "Automatic",
      status: "Available",
      dailyRate: 2000,
    },
    {
      id: "4",
      make: "Mahindra",
      model: "XUV300",
      year: 2022,
      plateNumber: "MH-04-GH-3456",
      fuelType: "Diesel",
      transmission: "Manual",
      status: "Available",
      dailyRate: 2200,
    },
    {
      id: "5",
      make: "Honda",
      model: "City",
      year: 2023,
      plateNumber: "MH-04-IJ-7890",
      fuelType: "Petrol",
      transmission: "CVT",
      status: "Available",
      dailyRate: 2000,
    },
  ]

  private bookings: Booking[] = [
    {
      id: "1",
      bookingId: "VAT-20241212-001",
      customerId: "1",
      customerName: "Rajesh Kumar",
      carId: "1",
      carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
      startDate: "2024-12-12",
      endDate: "2024-12-15",
      startTime: "10:00",
      endTime: "18:00",
      duration: 3,
      dailyRate: 1500,
      totalAmount: 4500,
      depositAmount: 5000,
      totalRentReceived: 4500,
      paymentMode: "Cash",
      status: "Active",
      notes: "Wedding function",
      createdAt: "2024-12-12",
      depositRefunded: false,
    },
    {
      id: "2",
      bookingId: "VAT-20241210-002",
      customerId: "2",
      customerName: "Priya Sharma",
      carId: "2",
      carDetails: "Hyundai Creta 2023 (MH-04-CD-5678)",
      startDate: "2024-12-10",
      endDate: "2024-12-12",
      startTime: "09:00",
      endTime: "20:00",
      duration: 2,
      dailyRate: 2500,
      totalAmount: 5000,
      depositAmount: 8000,
      totalRentReceived: 5000,
      paymentMode: "UPI",
      status: "Returned",
      createdAt: "2024-12-10",
      returnedAt: "2024-12-12",
      depositRefunded: true,
    },
  ]

  // Existing methods remain the same, just update return types
  async getCustomers(): Promise<Customer[]> {
    return [...this.customers]
  }

  async getCars(): Promise<Car[]> {
    return [...this.cars]
  }

  async getBookings(): Promise<Booking[]> {
    return [...this.bookings]
  }

  async getAvailableCars(): Promise<Car[]> {
    return this.cars.filter((car) => car.status === "Available")
  }

  async addCustomer(customer: Omit<Customer, "id">): Promise<Customer> {
    const newCustomer = {
      ...customer,
      id: (this.customers.length + 1).toString(),
    }
    this.customers.push(newCustomer)
    return newCustomer
  }

  async addBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    const newBooking = {
      ...booking,
      id: (this.bookings.length + 1).toString(),
    }
    this.bookings.push(newBooking)

    // Update car status to rented
    const carIndex = this.cars.findIndex((car) => car.id === booking.carId)
    if (carIndex !== -1) {
      this.cars[carIndex].status = "Rented"
    }

    return newBooking
  }

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking | null> {
    const index = this.bookings.findIndex((booking) => booking.id === bookingId)
    if (index === -1) return null

    this.bookings[index] = { ...this.bookings[index], ...updates }

    // If marking as returned, update car status
    if (updates.status === "Returned") {
      const carIndex = this.cars.findIndex((car) => car.id === this.bookings[index].carId)
      if (carIndex !== -1) {
        this.cars[carIndex].status = "Available"
      }
      this.bookings[index].returnedAt = new Date().toISOString()
    }

    return this.bookings[index]
  }

  async checkConflict(carId: string, startDate: string, endDate: string): Promise<boolean> {
    return this.bookings.some(
      (booking) =>
        booking.carId === carId &&
        booking.status === "Active" &&
        ((startDate >= booking.startDate && startDate <= booking.endDate) ||
          (endDate >= booking.startDate && endDate <= booking.endDate) ||
          (startDate <= booking.startDate && endDate >= booking.endDate)),
    )
  }

  async generateCustomerId(): Promise<string> {
    const count = this.customers.length + 1
    return `VATS-CUST-${count.toString().padStart(3, "0")}`
  }

  async generateBookingId(): Promise<string> {
    const today = new Date()
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "")
    const count = this.bookings.length + 1
    return `VAT-${dateStr}-${count.toString().padStart(3, "0")}`
  }

  // New method to handle deposit refund
  async refundDeposit(bookingId: string): Promise<boolean> {
    const booking = this.bookings.find((b) => b.id === bookingId)
    if (booking && booking.status === "Returned" && !booking.depositRefunded) {
      booking.depositRefunded = true
      return true
    }
    return false
  }

  // Get financial summary
  async getFinancialSummary() {
    const totalDeposits = this.bookings.reduce((sum, booking) => sum + booking.depositAmount, 0)
    const totalRentReceived = this.bookings.reduce((sum, booking) => sum + booking.totalRentReceived, 0)
    const depositsToRefund = this.bookings
      .filter((b) => b.status === "Returned" && !b.depositRefunded)
      .reduce((sum, booking) => sum + booking.depositAmount, 0)

    return {
      totalDeposits,
      totalRentReceived,
      depositsToRefund,
      activeBookings: this.bookings.filter((b) => b.status === "Active").length,
    }
  }
}

export const mockDataService = new MockDataService()
