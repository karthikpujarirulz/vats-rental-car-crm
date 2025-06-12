"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { ChevronLeft, ChevronRight } from "lucide-react"
import { mockDataService, type Booking, type Car as CarType } from "@/lib/mock-data"

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  bookings: Booking[]
}

interface BookingCalendarProps {
  onDateSelect?: (date: Date) => void
  onBookingSelect?: (booking: Booking) => void
}

export default function BookingCalendar({ onDateSelect, onBookingSelect }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [cars, setCars] = useState<CarType[]>([])
  const [selectedCar, setSelectedCar] = useState<string>("all")
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    generateCalendarDays()
  }, [currentDate, bookings, selectedCar])

  const loadData = async () => {
    try {
      const [bookingsData, carsData] = await Promise.all([mockDataService.getBookings(), mockDataService.getCars()])
      setBookings(bookingsData)
      setCars(carsData)
    } catch (error) {
      console.error("Error loading calendar data:", error)
    }
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const endDate = new Date(lastDay)
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))

    const days: CalendarDay[] = []
    const current = new Date(startDate)

    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0]
      const dayBookings = bookings.filter((booking) => {
        if (selectedCar !== "all" && booking.carId !== selectedCar) return false
        return (
          (booking.startDate <= dateStr && booking.endDate >= dateStr) ||
          booking.startDate === dateStr ||
          booking.endDate === dateStr
        )
      })

      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        bookings: dayBookings,
      })

      current.setDate(current.getDate() + 1)
    }

    setCalendarDays(days)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getBookingColor = (booking: Booking) => {
    switch (booking.status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Returned":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Booking Calendar</h2>
          <p className="text-gray-600">Visual overview of all bookings</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedCar} onValueChange={setSelectedCar}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by car" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cars</SelectItem>
              {cars.map((car) => (
                <SelectItem key={car.id} value={car.id}>
                  {car.make} {car.model} ({car.plateNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <CardDescription>{bookings.filter((b) => b.status === "Active").length} active bookings</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-24 p-1 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  !day.isCurrentMonth ? "bg-gray-50 opacity-50" : ""
                } ${isToday(day.date) ? "bg-blue-50 border-blue-200" : ""}`}
                onClick={() => onDateSelect?.(day.date)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`text-sm ${
                      isToday(day.date) ? "font-bold text-blue-600" : day.isCurrentMonth ? "" : "text-gray-400"
                    }`}
                  >
                    {day.date.getDate()}
                  </span>
                  {day.bookings.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {day.bookings.length}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  {day.bookings.slice(0, 2).map((booking) => (
                    <Dialog key={booking.id}>
                      <DialogTrigger asChild>
                        <div
                          className={`text-xs p-1 rounded cursor-pointer truncate ${getBookingColor(booking)}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBooking(booking)
                          }}
                        >
                          {booking.customerName}
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Booking Details</DialogTitle>
                          <DialogDescription>{booking.bookingId}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Start Date & Time</label>
                              <p className="text-sm">{new Date(booking.startDate).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-500">Pickup: {booking.startTime}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">End Date & Time</label>
                              <p className="text-sm">{new Date(booking.endDate).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-500">Return: {booking.endTime}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Duration</label>
                              <p className="text-sm">{booking.duration} days</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Status</label>
                              <Badge className={getBookingColor(booking)}>{booking.status}</Badge>
                            </div>
                          </div>
                          {booking.notes && (
                            <div>
                              <label className="text-sm font-medium">Notes</label>
                              <p className="text-sm bg-gray-50 p-2 rounded">{booking.notes}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                  {day.bookings.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">+{day.bookings.length - 2} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-sm">Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span className="text-sm">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
              <span className="text-sm">Returned</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-sm">Cancelled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
