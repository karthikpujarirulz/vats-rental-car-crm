"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Phone, MapPin, Calendar, Car, FileText, Edit, X, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { Customer } from "@/lib/mock-data"

interface BookingRecord {
  id: string
  bookingId: string
  carDetails: string
  startDate: string
  endDate: string
  duration: number
  totalAmount: number
  advanceAmount: number
  status: "Active" | "Completed" | "Cancelled" | "Pending"
  createdAt: string
  notes?: string
}

interface CustomerDetailsProps {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
}

export default function CustomerDetails({ customer, isOpen, onClose }: CustomerDetailsProps) {
  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (customer && isOpen) {
      loadBookingHistory()
    }
  }, [customer, isOpen])

  const loadBookingHistory = async () => {
    if (!customer) return

    setLoading(true)
    try {
      // Simulate API call - in real app, fetch from backend
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock booking data for this customer
      const mockBookings: BookingRecord[] = [
        {
          id: "1",
          bookingId: "VAT-20241212-001",
          carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
          startDate: "2024-12-12",
          endDate: "2024-12-15",
          duration: 3,
          totalAmount: 15000,
          advanceAmount: 5000,
          status: "Active",
          createdAt: "2024-12-12",
          notes: "Customer requested GPS navigation",
        },
        {
          id: "2",
          bookingId: "VAT-20241201-002",
          carDetails: "Hyundai Creta 2023 (MH-04-CD-5678)",
          startDate: "2024-12-01",
          endDate: "2024-12-03",
          duration: 2,
          totalAmount: 12000,
          advanceAmount: 4000,
          status: "Completed",
          createdAt: "2024-12-01",
        },
        {
          id: "3",
          bookingId: "VAT-20241115-003",
          carDetails: "Tata Nexon 2021 (MH-04-EF-9012)",
          startDate: "2024-11-15",
          endDate: "2024-11-18",
          duration: 3,
          totalAmount: 18000,
          advanceAmount: 6000,
          status: "Completed",
          createdAt: "2024-11-15",
        },
        {
          id: "4",
          bookingId: "VAT-20241010-004",
          carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
          startDate: "2024-10-10",
          endDate: "2024-10-12",
          duration: 2,
          totalAmount: 10000,
          advanceAmount: 3000,
          status: "Cancelled",
          createdAt: "2024-10-10",
          notes: "Cancelled due to emergency",
        },
      ]

      setBookingHistory(mockBookings)
    } catch (error) {
      console.error("Error loading booking history:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Clock className="h-4 w-4" />
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "Pending":
        return <AlertCircle className="h-4 w-4" />
      case "Cancelled":
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const totalBookings = bookingHistory.length
  const completedBookings = bookingHistory.filter((b) => b.status === "Completed").length
  const totalRevenue = bookingHistory.filter((b) => b.status === "Completed").reduce((sum, b) => sum + b.totalAmount, 0)
  const averageBookingValue = completedBookings > 0 ? totalRevenue / completedBookings : 0

  if (!customer) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{customer.name}</CardTitle>
                    <CardDescription className="text-base">{customer.customerId}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">
                      Customer since {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Customer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{customer.address}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Documents:</span>
                    <div className="flex space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${customer.aadharUrl ? "bg-green-500" : "bg-gray-300"}`}
                        title="Aadhar Card"
                      />
                      <div
                        className={`w-3 h-3 rounded-full ${customer.dlUrl ? "bg-green-500" : "bg-gray-300"}`}
                        title="Driving License"
                      />
                      <div
                        className={`w-3 h-3 rounded-full ${customer.photoUrl ? "bg-green-500" : "bg-gray-300"}`}
                        title="Photo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBookings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedBookings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">₹{totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  ₹{Math.round(averageBookingValue).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking History
              </CardTitle>
              <CardDescription>Complete booking history for {customer.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : bookingHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600">This customer hasn't made any bookings yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Advance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookingHistory.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.bookingId}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate">{booking.carDetails}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                              <div className="text-gray-500">to {new Date(booking.endDate).toLocaleDateString()}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{booking.duration} days</Badge>
                          </TableCell>
                          <TableCell className="font-medium">₹{booking.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>₹{booking.advanceAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(booking.status)}
                                {booking.status}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Section */}
          {bookingHistory.some((b) => b.notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookingHistory
                    .filter((b) => b.notes)
                    .map((booking) => (
                      <div key={booking.id} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{booking.bookingId}</p>
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
