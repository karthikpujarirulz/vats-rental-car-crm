"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Car, User, Calendar, AlertTriangle, CheckCircle, Clock, IndianRupee } from "lucide-react"
import { mockDataService, type Car as CarType, type Customer } from "@/lib/mock-data"

interface QuickBookingData {
  customerId: string
  customerName: string
  customerPhone: string
  carId: string
  startDate: string
  endDate: string
  startTime: string // New field
  endTime: string // New field
  duration: number
  dailyRate: number
  totalRentAmount: number
  advanceAmount: number
  paymentMode: string
  notes: string
}

interface QuickBookingDialogProps {
  onBookingCreated?: () => void
}

export default function QuickBookingDialog({ onBookingCreated }: QuickBookingDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: Customer, 2: Car, 3: Dates, 4: Payment, 5: Confirm
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [availableCars, setAvailableCars] = useState<CarType[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null)
  const [hasConflict, setHasConflict] = useState(false)

  const [bookingData, setBookingData] = useState<QuickBookingData>({
    customerId: "none",
    customerName: "",
    customerPhone: "",
    carId: "none",
    startDate: "",
    endDate: "",
    startTime: "10:00",
    endTime: "18:00",
    duration: 0,
    dailyRate: 0,
    totalRentAmount: 0,
    advanceAmount: 0,
    paymentMode: "Cash",
    notes: "",
  })

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  })

  // Default daily rates by car type
  const getDefaultDailyRate = (car: CarType) => {
    const baseRates: Record<string, number> = {
      Swift: 1500,
      Creta: 2500,
      Nexon: 2000,
      XUV300: 2200,
      City: 2000,
    }
    return baseRates[car.model] || 1800
  }

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      const duration = calculateDuration(bookingData.startDate, bookingData.endDate)
      const totalRentAmount = duration * bookingData.dailyRate
      setBookingData((prev) => ({
        ...prev,
        duration,
        totalRentAmount,
      }))

      if (bookingData.carId) {
        checkConflict()
      }
    }
  }, [bookingData.startDate, bookingData.endDate, bookingData.carId])

  useEffect(() => {
    // Recalculate total when daily rate or duration changes
    const totalRentAmount = bookingData.duration * bookingData.dailyRate
    setBookingData((prev) => ({ ...prev, totalRentAmount }))
  }, [bookingData.dailyRate, bookingData.duration])

  const loadData = async () => {
    try {
      const [customersData, carsData] = await Promise.all([
        mockDataService.getCustomers(),
        mockDataService.getAvailableCars(),
      ])
      setCustomers(customersData)
      setAvailableCars(carsData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const checkConflict = async () => {
    if (bookingData.carId && bookingData.startDate && bookingData.endDate) {
      const conflict = await mockDataService.checkConflict(
        bookingData.carId,
        bookingData.startDate,
        bookingData.endDate,
      )
      setHasConflict(conflict)
    }
  }

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)
    if (customer) {
      setSelectedCustomer(customer)
      setBookingData((prev) => ({
        ...prev,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
      }))
    }
  }

  const handleCarSelect = (carId: string) => {
    const car = availableCars.find((c) => c.id === carId)
    if (car) {
      setSelectedCar(car)
      const defaultRate = getDefaultDailyRate(car)
      setBookingData((prev) => ({
        ...prev,
        carId: car.id,
        dailyRate: defaultRate,
        totalRentAmount: prev.duration * defaultRate,
      }))
    }
  }

  const handleCreateNewCustomer = async () => {
    if (newCustomer.name && newCustomer.phone && newCustomer.address) {
      try {
        const customerId = await mockDataService.generateCustomerId()
        const customer = await mockDataService.addCustomer({
          ...newCustomer,
          customerId,
        })

        setCustomers((prev) => [...prev, customer])
        setSelectedCustomer(customer)
        setBookingData((prev) => ({
          ...prev,
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phone,
        }))

        setNewCustomer({ name: "", phone: "", address: "" })
        setStep(2)
      } catch (error) {
        console.error("Error creating customer:", error)
      }
    }
  }

  const handleCreateBooking = async () => {
    if (hasConflict) return

    try {
      setLoading(true)
      const bookingId = await mockDataService.generateBookingId()

      const booking = {
        bookingId,
        customerId: bookingData.customerId,
        customerName: bookingData.customerName,
        carId: bookingData.carId,
        carDetails: selectedCar
          ? `${selectedCar.make} ${selectedCar.model} ${selectedCar.year} (${selectedCar.plateNumber})`
          : "",
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        duration: bookingData.duration,
        dailyRate: bookingData.dailyRate,
        totalAmount: bookingData.totalRentAmount,
        advanceAmount: bookingData.advanceAmount,
        paymentMode: bookingData.paymentMode,
        status: "Active" as const,
        notes: bookingData.notes,
      }

      await mockDataService.addBooking(booking)

      // Reset form
      setBookingData({
        customerId: "none",
        customerName: "",
        customerPhone: "",
        carId: "none",
        startDate: "",
        endDate: "",
        startTime: "10:00",
        endTime: "18:00",
        duration: 0,
        dailyRate: 0,
        totalRentAmount: 0,
        advanceAmount: 0,
        paymentMode: "Cash",
        notes: "",
      })
      setSelectedCustomer(null)
      setSelectedCar(null)
      setStep(1)
      setIsOpen(false)

      onBookingCreated?.()
    } catch (error) {
      console.error("Error creating booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 5) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return bookingData.customerId !== "" && bookingData.customerId !== "none"
      case 2:
        return bookingData.carId !== "" && bookingData.carId !== "none"
      case 3:
        return bookingData.startDate !== "" && bookingData.endDate !== "" && !hasConflict
      case 4:
        return bookingData.advanceAmount > 0 && bookingData.dailyRate > 0
      default:
        return true
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Select Customer"
      case 2:
        return "Choose Vehicle"
      case 3:
        return "Set Dates"
      case 4:
        return "Payment & Pricing"
      case 5:
        return "Confirm Booking"
      default:
        return "Quick Booking"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Quick Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-blue-600" />
            <span>{getStepTitle()}</span>
          </DialogTitle>
          <DialogDescription>Step {step} of 5 - Create a new rental booking quickly</DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step 1: Customer Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Select Existing Customer</Label>
              <Select
                value={bookingData.customerId || "none"}
                onValueChange={(value) => value !== "none" && handleCustomerSelect(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" disabled>
                    Choose a customer
                  </SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>
                          {customer.name} - {customer.phone}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-center text-gray-500">OR</div>

            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Add New Customer</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter complete address"
                  rows={2}
                />
              </div>
              <Button
                onClick={handleCreateNewCustomer}
                disabled={!newCustomer.name || !newCustomer.phone || !newCustomer.address}
                className="w-full"
              >
                Create Customer & Continue
              </Button>
            </div>

            {selectedCustomer && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Customer Selected</span>
                </div>
                <p className="text-sm text-green-700">
                  {selectedCustomer.name} - {selectedCustomer.phone}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Car Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Available Vehicles</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {availableCars.map((car) => (
                  <div
                    key={car.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      bookingData.carId === car.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleCarSelect(car.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Car className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium">
                            {car.make} {car.model} {car.year}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {car.plateNumber} • {car.fuelType} • {car.transmission}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">₹{getDefaultDailyRate(car)}/day</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedCar && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Vehicle Selected</span>
                </div>
                <p className="text-sm text-green-700">
                  {selectedCar.make} {selectedCar.model} {selectedCar.year} ({selectedCar.plateNumber})
                </p>
                <p className="text-sm text-blue-700 font-medium">Daily Rate: ₹{bookingData.dailyRate}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Date Selection */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, endDate: e.target.value }))}
                  min={bookingData.startDate || new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pickup Time</Label>
                <Input
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, startTime: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Vehicle pickup time</p>
              </div>
              <div>
                <Label>Return Time</Label>
                <Input
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, endTime: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Expected return time</p>
              </div>
            </div>

            {bookingData.duration > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Duration: {bookingData.duration} days</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Rent Amount</p>
                    <p className="text-lg font-bold text-blue-600">₹{bookingData.totalRentAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {hasConflict && (
              <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded">
                <AlertTriangle className="h-4 w-4" />
                <span>Booking conflict detected! This car is already booked for the selected dates.</span>
              </div>
            )}

            {!hasConflict && bookingData.carId && bookingData.startDate && bookingData.endDate && (
              <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded">
                <CheckCircle className="h-4 w-4" />
                <span>No conflicts found. Car is available for the selected dates!</span>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Payment & Pricing Details */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Daily Rate (₹)</Label>
                <Input
                  type="number"
                  value={bookingData.dailyRate}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, dailyRate: Number.parseInt(e.target.value) || 0 }))
                  }
                  placeholder="1500"
                />
                <p className="text-xs text-gray-500 mt-1">Customize the daily rental rate</p>
              </div>
              <div>
                <Label>Total Rent Amount (₹)</Label>
                <div className="relative">
                  <Input type="number" value={bookingData.totalRentAmount} readOnly className="bg-gray-50" />
                  <IndianRupee className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Auto-calculated: {bookingData.duration} days × ₹{bookingData.dailyRate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Advance Amount (₹)</Label>
                <Input
                  type="number"
                  value={bookingData.advanceAmount}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, advanceAmount: Number.parseInt(e.target.value) || 0 }))
                  }
                  placeholder="5000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Remaining: ₹{(bookingData.totalRentAmount - bookingData.advanceAmount).toLocaleString()}
                </p>
              </div>
              <div>
                <Label>Payment Mode</Label>
                <Select
                  value={bookingData.paymentMode || "Cash"}
                  onValueChange={(value) => setBookingData((prev) => ({ ...prev, paymentMode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
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
              <Label>Notes / Special Instructions</Label>
              <Textarea
                value={bookingData.notes}
                onChange={(e) => setBookingData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special conditions or notes"
                rows={3}
              />
            </div>

            {/* Pricing Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Pricing Summary</h4>
              <div className="flex justify-between text-sm">
                <span>Daily Rate:</span>
                <span>₹{bookingData.dailyRate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span>{bookingData.duration} days</span>
              </div>
              <div className="flex justify-between text-sm font-medium border-t pt-2">
                <span>Total Rent:</span>
                <span>₹{bookingData.totalRentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Advance Paid:</span>
                <span>₹{bookingData.advanceAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-orange-600">
                <span>Balance Due:</span>
                <span>₹{(bookingData.totalRentAmount - bookingData.advanceAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Booking Summary</h4>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Customer:</span>
                  <p className="font-medium">{bookingData.customerName}</p>
                  <p className="text-gray-600">{bookingData.customerPhone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Vehicle:</span>
                  <p className="font-medium">
                    {selectedCar?.make} {selectedCar?.model} {selectedCar?.year}
                  </p>
                  <p className="text-gray-600">{selectedCar?.plateNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p className="font-medium">{bookingData.duration} days</p>
                  <p className="text-gray-600">
                    {new Date(bookingData.startDate).toLocaleDateString()} at {bookingData.startTime} -{" "}
                    {new Date(bookingData.endDate).toLocaleDateString()} at {bookingData.endTime}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Pricing:</span>
                  <p className="font-medium">₹{bookingData.dailyRate}/day</p>
                  <p className="text-gray-600">Total: ₹{bookingData.totalRentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Payment:</span>
                  <p className="font-medium">₹{bookingData.advanceAmount.toLocaleString()} advance</p>
                  <p className="text-gray-600">{bookingData.paymentMode}</p>
                </div>
                <div>
                  <span className="text-gray-600">Balance:</span>
                  <p className="font-medium text-orange-600">
                    ₹{(bookingData.totalRentAmount - bookingData.advanceAmount).toLocaleString()}
                  </p>
                  <p className="text-gray-600">Due on return</p>
                </div>
              </div>

              {bookingData.notes && (
                <div>
                  <span className="text-gray-600">Notes:</span>
                  <p className="text-sm bg-white p-2 rounded border">{bookingData.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={prevStep} disabled={step === 1}>
            Previous
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>

            {step < 5 ? (
              <Button onClick={nextStep} disabled={!canProceed()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleCreateBooking} disabled={loading || hasConflict}>
                {loading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Booking"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
