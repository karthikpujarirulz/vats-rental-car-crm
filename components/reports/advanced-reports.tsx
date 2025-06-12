"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Filter, Calendar, TrendingUp, Car, Users } from "lucide-react"
import { mockDataService, type Booking, type Car as CarType, type Customer } from "@/lib/mock-data"

interface ReportData {
  totalRevenue: number
  totalBookings: number
  averageBookingValue: number
  topPerformingCar: string
  topCustomer: string
  occupancyRate: number
}

export default function AdvancedReports() {
  const [reportType, setReportType] = useState("revenue")
  const [dateRange, setDateRange] = useState("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [carFilter, setCarFilter] = useState("all")
  const [customerFilter, setCustomerFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  const [bookings, setBookings] = useState<Booking[]>([])
  const [cars, setCars] = useState<CarType[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [reportData, setReportData] = useState<ReportData>({
    totalRevenue: 0,
    totalBookings: 0,
    averageBookingValue: 0,
    topPerformingCar: "",
    topCustomer: "",
    occupancyRate: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    generateReport()
  }, [reportType, dateRange, startDate, endDate, carFilter, customerFilter, bookings])

  const loadData = async () => {
    try {
      const [bookingsData, carsData, customersData] = await Promise.all([
        mockDataService.getBookings(),
        mockDataService.getCars(),
        mockDataService.getCustomers(),
      ])
      setBookings(bookingsData)
      setCars(carsData)
      setCustomers(customersData)
    } catch (error) {
      console.error("Error loading report data:", error)
    }
  }

  const generateReport = () => {
    let filteredBookings = [...bookings]

    // Apply date filter
    if (dateRange === "custom" && startDate && endDate) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.startDate >= startDate && booking.endDate <= endDate,
      )
    } else if (dateRange === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const weekAgoStr = weekAgo.toISOString().split("T")[0]
      filteredBookings = filteredBookings.filter((booking) => booking.startDate >= weekAgoStr)
    } else if (dateRange === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      const monthAgoStr = monthAgo.toISOString().split("T")[0]
      filteredBookings = filteredBookings.filter((booking) => booking.startDate >= monthAgoStr)
    }

    // Apply car filter
    if (carFilter !== "all") {
      filteredBookings = filteredBookings.filter((booking) => booking.carId === carFilter)
    }

    // Apply customer filter
    if (customerFilter !== "all") {
      filteredBookings = filteredBookings.filter((booking) => booking.customerId === customerFilter)
    }

    // Calculate metrics
    const totalRevenue = filteredBookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || booking.advanceAmount),
      0,
    )
    const totalBookings = filteredBookings.length
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

    // Find top performing car
    const carBookings = filteredBookings.reduce(
      (acc, booking) => {
        acc[booking.carId] = (acc[booking.carId] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const topCarId = Object.entries(carBookings).sort(([, a], [, b]) => b - a)[0]?.[0]
    const topCar = cars.find((car) => car.id === topCarId)
    const topPerformingCar = topCar ? `${topCar.make} ${topCar.model}` : "N/A"

    // Find top customer
    const customerBookings = filteredBookings.reduce(
      (acc, booking) => {
        acc[booking.customerId] = (acc[booking.customerId] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const topCustomerId = Object.entries(customerBookings).sort(([, a], [, b]) => b - a)[0]?.[0]
    const topCustomer = customers.find((customer) => customer.id === topCustomerId)?.name || "N/A"

    // Calculate occupancy rate
    const totalCarDays = cars.length * 30 // Assuming 30 days
    const bookedDays = filteredBookings.reduce((sum, booking) => sum + booking.duration, 0)
    const occupancyRate = totalCarDays > 0 ? (bookedDays / totalCarDays) * 100 : 0

    setReportData({
      totalRevenue,
      totalBookings,
      averageBookingValue,
      topPerformingCar,
      topCustomer,
      occupancyRate,
    })
  }

  const exportReport = (format: "pdf" | "csv") => {
    setLoading(true)

    // Simulate export process
    setTimeout(() => {
      const filename = `vats-rental-report-${reportType}-${Date.now()}.${format}`

      if (format === "csv") {
        // Create CSV content
        const csvContent = [
          ["Metric", "Value"],
          ["Total Revenue", `₹${reportData.totalRevenue.toLocaleString()}`],
          ["Total Bookings", reportData.totalBookings.toString()],
          ["Average Booking Value", `₹${reportData.averageBookingValue.toFixed(2)}`],
          ["Top Performing Car", reportData.topPerformingCar],
          ["Top Customer", reportData.topCustomer],
          ["Occupancy Rate", `${reportData.occupancyRate.toFixed(1)}%`],
        ]
          .map((row) => row.join(","))
          .join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      } else {
        // For PDF, we would typically use a library like jsPDF
        alert(`PDF export would be implemented with a PDF library. Report: ${filename}`)
      }

      setLoading(false)
    }, 1000)
  }

  const reportTypes = [
    { value: "revenue", label: "Revenue Analysis" },
    { value: "fleet", label: "Fleet Performance" },
    { value: "customer", label: "Customer Insights" },
    { value: "occupancy", label: "Occupancy Report" },
  ]

  const dateRanges = [
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
    { value: "quarter", label: "Last 3 Months" },
    { value: "year", label: "Last Year" },
    { value: "custom", label: "Custom Range" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Reports</h2>
          <p className="text-gray-600">Generate comprehensive business reports and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportReport("csv")} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => exportReport("pdf")} disabled={loading}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Report Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Filter by Car</Label>
              <Select value={carFilter} onValueChange={setCarFilter}>
                <SelectTrigger>
                  <SelectValue />
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
            </div>

            <div>
              <Label>Filter by Customer</Label>
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {dateRange === "custom" && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{reportData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {reportData.totalBookings} bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Booking Value</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{reportData.averageBookingValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Per booking average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Car className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{reportData.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Fleet utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performing Car</CardTitle>
            <Car className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-orange-600">{reportData.topPerformingCar}</div>
            <p className="text-xs text-muted-foreground">Most booked vehicle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Customer</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-indigo-600">{reportData.topCustomer}</div>
            <p className="text-xs text-muted-foreground">Most frequent customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalBookings}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Report Data</CardTitle>
          <CardDescription>
            {reportTypes.find((t) => t.value === reportType)?.label} for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Booking ID</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Vehicle</th>
                  <th className="text-left p-2">Duration</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 10).map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{booking.bookingId}</td>
                    <td className="p-2">{booking.customerName}</td>
                    <td className="p-2">{booking.carDetails}</td>
                    <td className="p-2">{booking.duration} days</td>
                    <td className="p-2">₹{(booking.totalAmount || booking.advanceAmount).toLocaleString()}</td>
                    <td className="p-2">
                      <Badge variant={booking.status === "Active" ? "default" : "secondary"}>{booking.status}</Badge>
                    </td>
                    <td className="p-2">{new Date(booking.startDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookings.length > 10 && (
            <div className="text-center mt-4 text-sm text-gray-500">
              Showing 10 of {bookings.length} bookings. Export for complete data.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
