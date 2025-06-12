"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, FileText } from "lucide-react"

interface BookingHistoryData {
  id: string
  bookingId: string
  customerName: string
  carDetails: string
  startDate: string
  endDate: string
  duration: number
  totalAmount: number
  status: string
  createdAt: string
}

export default function BookingHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")

  // Mock booking history data
  const bookingHistory: BookingHistoryData[] = [
    {
      id: "1",
      bookingId: "VAT-20241212-001",
      customerName: "Rajesh Kumar",
      carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
      startDate: "2024-12-12",
      endDate: "2024-12-15",
      duration: 3,
      totalAmount: 15000,
      status: "Active",
      createdAt: "2024-12-12",
    },
    {
      id: "2",
      bookingId: "VAT-20241210-002",
      customerName: "Priya Sharma",
      carDetails: "Hyundai Creta 2023 (MH-04-CD-5678)",
      startDate: "2024-12-10",
      endDate: "2024-12-12",
      duration: 2,
      totalAmount: 20000,
      status: "Returned",
      createdAt: "2024-12-10",
    },
    {
      id: "3",
      bookingId: "VAT-20241205-003",
      customerName: "Amit Patel",
      carDetails: "Tata Nexon 2021 (MH-04-EF-9012)",
      startDate: "2024-12-05",
      endDate: "2024-12-08",
      duration: 3,
      totalAmount: 18000,
      status: "Returned",
      createdAt: "2024-12-05",
    },
    {
      id: "4",
      bookingId: "VAT-20241201-004",
      customerName: "Sunita Joshi",
      carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
      startDate: "2024-12-01",
      endDate: "2024-12-03",
      duration: 2,
      totalAmount: 12000,
      status: "Cancelled",
      createdAt: "2024-12-01",
    },
    {
      id: "5",
      bookingId: "VAT-20241125-005",
      customerName: "Vikram Singh",
      carDetails: "Hyundai Creta 2023 (MH-04-CD-5678)",
      startDate: "2024-11-25",
      endDate: "2024-11-28",
      duration: 3,
      totalAmount: 22000,
      status: "Returned",
      createdAt: "2024-11-25",
    },
  ]

  const filteredBookings = bookingHistory.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carDetails.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase()

    const matchesDate = !dateFilter || booking.startDate.includes(dateFilter)

    return matchesSearch && matchesStatus && matchesDate
  })

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

  const totalRevenue = filteredBookings
    .filter((b) => b.status === "Returned")
    .reduce((sum, b) => sum + b.totalAmount, 0)

  const exportToCSV = () => {
    const headers = ["Booking ID", "Customer", "Car", "Start Date", "End Date", "Duration", "Amount", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map((booking) =>
        [
          booking.bookingId,
          booking.customerName,
          booking.carDetails,
          booking.startDate,
          booking.endDate,
          booking.duration,
          booking.totalAmount,
          booking.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vats-rental-bookings-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Booking History</h2>
          <p className="text-gray-600">View and manage all booking records</p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredBookings.filter((b) => b.status === "Returned").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredBookings.filter((b) => b.status === "Active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by customer, booking ID, or car..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="month"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by month"
            />
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setDateFilter("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Booking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Records</CardTitle>
          <CardDescription>
            Showing {filteredBookings.length} of {bookingHistory.length} bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Car Details</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.bookingId}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell className="max-w-xs truncate">{booking.carDetails}</TableCell>
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
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
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
        </CardContent>
      </Card>
    </div>
  )
}
