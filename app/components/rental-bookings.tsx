"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Calendar, FileText, Car, IndianRupee, RefreshCw, CheckCircle } from "lucide-react"
import { mockDataService, type Booking, type Customer, type Car as CarType } from "@/lib/mock-data"
import { enhancedPdfService, type EnhancedAgreementData } from "@/services/enhanced-pdf-service"

export default function RentalBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [cars, setCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    customerId: "none",
    carId: "none",
    startDate: "",
    endDate: "",
    startTime: "10:00", // Default pickup time
    endTime: "18:00", // Default return time
    dailyRate: 0,
    depositAmount: 0,
    totalRentReceived: 0,
    paymentMode: "Cash",
    notes: "",
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [bookingsData, customersData, carsData] = await Promise.all([
        mockDataService.getBookings(),
        mockDataService.getCustomers(),
        mockDataService.getCars(),
      ])
      setBookings(bookingsData)
      setCustomers(customersData)
      setCars(carsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateBookingId = () => {
    const today = new Date()
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "")
    const count = bookings.length + 1
    return `VAT-${dateStr}-${count.toString().padStart(3, "0")}`
  }

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getDefaultDailyRate = (carId: string) => {
    const car = cars.find((c) => c.id === carId)
    if (!car) return 1500

    // Set default rates based on car model
    const model = car.model.toLowerCase()
    if (model.includes("swift")) return 1500
    if (model.includes("creta")) return 2500
    if (model.includes("nexon")) return 2000
    if (model.includes("xuv")) return 2200
    if (model.includes("city")) return 2000
    return 1800 // Default rate
  }

  const checkConflict = async (carId: string, startDate: string, endDate: string) => {
    return await mockDataService.checkConflict(carId, startDate, endDate)
  }

  const handleCreateBooking = async () => {
    if (newBooking.customerId && newBooking.carId && newBooking.startDate && newBooking.endDate) {
      const hasConflict = await checkConflict(newBooking.carId, newBooking.startDate, newBooking.endDate)

      if (hasConflict) {
        alert("Booking conflict detected! This car is already booked for the selected dates.")
        return
      }

      const customer = customers.find((c) => c.id === newBooking.customerId)
      const car = cars.find((c) => c.id === newBooking.carId)
      const duration = calculateDuration(newBooking.startDate, newBooking.endDate)
      const dailyRate = newBooking.dailyRate || getDefaultDailyRate(newBooking.carId)
      const totalAmount = dailyRate * duration

      const bookingData = {
        bookingId: generateBookingId(),
        customerId: newBooking.customerId,
        customerName: customer?.name || "",
        carId: newBooking.carId,
        carDetails: car ? `${car.make} ${car.model} ${car.year} (${car.plateNumber})` : "",
        startDate: newBooking.startDate,
        endDate: newBooking.endDate,
        startTime: newBooking.startTime || "10:00",
        endTime: newBooking.endTime || "18:00",
        duration,
        dailyRate,
        totalAmount,
        depositAmount: newBooking.depositAmount || 0,
        totalRentReceived: newBooking.totalRentReceived || 0,
        paymentMode: newBooking.paymentMode || "Cash",
        status: "Active" as const,
        notes: newBooking.notes,
        depositRefunded: false,
      }

      try {
        await mockDataService.addBooking(bookingData)
        await loadData() // Refresh data after adding
        setNewBooking({
          customerId: "none",
          carId: "none",
          startDate: "",
          endDate: "",
          startTime: "10:00",
          endTime: "18:00",
          dailyRate: 0,
          depositAmount: 0,
          totalRentReceived: 0,
          paymentMode: "Cash",
          notes: "",
        })
        setIsBookingDialogOpen(false)
      } catch (error) {
        console.error("Error creating booking:", error)
        alert("Error creating booking. Please try again.")
      }
    }
  }

  const handleMarkReturned = async (bookingId: string) => {
    try {
      await mockDataService.updateBooking(bookingId, { status: "Returned" })
      await loadData() // Refresh data after update
    } catch (error) {
      console.error("Error updating booking:", error)
      alert("Error updating booking. Please try again.")
    }
  }

  const handleRefundDeposit = async (bookingId: string) => {
    try {
      const success = await mockDataService.refundDeposit(bookingId)
      if (success) {
        await loadData() // Refresh data after refund
        alert("Deposit refunded successfully!")
      } else {
        alert("Unable to refund deposit. Please check booking status.")
      }
    } catch (error) {
      console.error("Error refunding deposit:", error)
      alert("Error refunding deposit. Please try again.")
    }
  }

  const handleGenerateAgreement = async (booking: Booking) => {
    try {
      const customer = customers.find((c) => c.id === booking.customerId)
      const car = cars.find((c) => c.id === booking.carId)

      if (!customer || !car) {
        alert("Customer or car data not found. Cannot generate agreement.")
        return
      }

      const agreementData: EnhancedAgreementData = {
        booking,
        customer,
        car,
        companyDetails: {
          name: "Vats Rental Services",
          address: "123 Main Street, Thane, Maharashtra 400601",
          phone: "+91 9876543210",
          email: "info@vatsrental.com",
          website: "www.vatsrental.com",
          gst: "27ABCDE1234F1Z5",
        },
      }

      await enhancedPdfService.downloadEnhancedAgreement(agreementData)
    } catch (error) {
      console.error("Error generating agreement:", error)
      alert("Error generating agreement. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Returned":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const availableCars = cars.filter((car) => car.status === "Available")
  const duration =
    newBooking.startDate && newBooking.endDate ? calculateDuration(newBooking.startDate, newBooking.endDate) : 0
  const dailyRate = newBooking.dailyRate || (newBooking.carId ? getDefaultDailyRate(newBooking.carId) : 0)
  const totalAmount = duration * dailyRate

  // Update daily rate when car selection changes
  const handleCarChange = (carId: string) => {
    const defaultRate = getDefaultDailyRate(carId)
    setNewBooking({ ...newBooking, carId, dailyRate: defaultRate })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rental Bookings</h2>
          <p className="text-gray-600">Manage active and upcoming bookings with deposit tracking</p>
        </div>
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
              <DialogDescription>Create a new rental booking with deposit and rent tracking</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Select
                    value={newBooking.customerId || "none"}
                    onValueChange={(value) => setNewBooking({ ...newBooking, customerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" disabled>
                        Select customer
                      </SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.customerId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="car">Car</Label>
                  <Select value={newBooking.carId || "none"} onValueChange={handleCarChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select car" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" disabled>
                        Select car
                      </SelectItem>
                      {availableCars.map((car) => (
                        <SelectItem key={car.id} value={car.id}>
                          {car.make} {car.model} {car.year} ({car.plateNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newBooking.startDate}
                    onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newBooking.endDate}
                    onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                    min={newBooking.startDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Pickup Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newBooking.startTime}
                    onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Vehicle pickup time</p>
                </div>
                <div>
                  <Label htmlFor="endTime">Return Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newBooking.endTime}
                    onChange={(e) => setNewBooking({ ...newBooking, endTime: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Expected return time</p>
                </div>
              </div>

              {duration > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                      Duration: {duration} days
                    </span>
                    <span className="flex items-center">
                      <IndianRupee className="h-4 w-4 text-green-600 mr-1" />
                      Total Rent: ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dailyRate">Daily Rate (₹)</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    value={newBooking.dailyRate}
                    onChange={(e) => setNewBooking({ ...newBooking, dailyRate: Number.parseInt(e.target.value) })}
                    placeholder="2000"
                  />
                </div>
                <div>
                  <Label htmlFor="deposit">Security Deposit (₹)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={newBooking.depositAmount}
                    onChange={(e) => setNewBooking({ ...newBooking, depositAmount: Number.parseInt(e.target.value) })}
                    placeholder="5000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Refundable on car return</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rentReceived">Total Rent Received (₹)</Label>
                  <Input
                    id="rentReceived"
                    type="number"
                    value={newBooking.totalRentReceived}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, totalRentReceived: Number.parseInt(e.target.value) })
                    }
                    placeholder="4500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Amount collected for rent</p>
                </div>
                <div>
                  <Label htmlFor="payment">Payment Mode</Label>
                  <Select
                    value={newBooking.paymentMode || "Cash"}
                    onValueChange={(value) => setNewBooking({ ...newBooking, paymentMode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes / Conditions</Label>
                <Textarea
                  id="notes"
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                  placeholder="Any special conditions or notes"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBooking}>Create Booking</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-4">Create your first rental booking to get started.</p>
          <Button onClick={() => setIsBookingDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Booking
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.bookingId}</CardTitle>
                    <CardDescription>{booking.customerName}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span>{booking.carDetails}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {new Date(booking.startDate).toLocaleDateString()} at {booking.startTime} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()} at {booking.endTime}
                    </span>
                    <Badge variant="outline">{booking.duration} days</Badge>
                  </div>

                  {/* Enhanced Financial Display */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    {booking.dailyRate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          Daily Rate:
                        </span>
                        <span className="font-medium">₹{booking.dailyRate.toLocaleString()}/day</span>
                      </div>
                    )}
                    {booking.totalAmount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Rent Amount:</span>
                        <span className="font-bold text-blue-600">₹{booking.totalAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rent Received:</span>
                      <span className="font-medium text-green-600">
                        ₹{booking.totalRentReceived.toLocaleString()} ({booking.paymentMode})
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Security Deposit:</span>
                      <span className="font-medium text-orange-600">₹{booking.depositAmount.toLocaleString()}</span>
                    </div>
                    {booking.totalAmount && booking.totalRentReceived < booking.totalAmount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rent Pending:</span>
                        <span className="font-medium text-red-600">
                          ₹{(booking.totalAmount - booking.totalRentReceived).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {booking.status === "Returned" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Deposit Status:</span>
                        <span
                          className={`font-medium ${booking.depositRefunded ? "text-green-600" : "text-orange-600"}`}
                        >
                          {booking.depositRefunded ? "✓ Refunded" : "⏳ Pending Refund"}
                        </span>
                      </div>
                    )}
                  </div>

                  {booking.notes && <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{booking.notes}</div>}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(booking.createdAt).toLocaleDateString()}
                    {booking.returnedAt && (
                      <>
                        <br />
                        Returned: {new Date(booking.returnedAt).toLocaleDateString()}
                      </>
                    )}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleGenerateAgreement(booking)}>
                      <FileText className="h-4 w-4 mr-1" />
                      Agreement
                    </Button>
                    {booking.status === "Active" && (
                      <Button size="sm" onClick={() => handleMarkReturned(booking.id!)}>
                        Mark Returned
                      </Button>
                    )}
                    {booking.status === "Returned" && !booking.depositRefunded && (
                      <Button size="sm" variant="outline" onClick={() => handleRefundDeposit(booking.id!)}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refund Deposit
                      </Button>
                    )}
                    {booking.depositRefunded && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Deposit Refunded
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
