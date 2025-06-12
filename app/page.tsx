"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  IndianRupee,
} from "lucide-react"

// Import components
import CarInventory from "./components/car-inventory"
import CustomerDatabase from "./components/customer-database"
import RentalBookings from "./components/rental-bookings"
import BookingHistory from "./components/booking-history"
import BookingCalendar from "@/components/calendar/booking-calendar"
import AnalyticsDashboard from "@/components/analytics/analytics-dashboard"
import SettingsPage from "@/components/settings/settings-page"
import QuickBookingDialog from "@/components/quick-booking/quick-booking-dialog"
import { mockDataService } from "@/lib/mock-data"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardStats, setDashboardStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalCustomers: 0,
    activeBookings: 0,
    totalRevenue: 0,
    pendingReturns: 0,
  })
  const [loading, setLoading] = useState(true)

  // Load dashboard statistics
  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      const [cars, customers, bookings] = await Promise.all([
        mockDataService.getCars(),
        mockDataService.getCustomers(),
        mockDataService.getBookings(),
      ])

      const availableCars = cars.filter((car) => car.status === "Available").length
      const activeBookings = bookings.filter((booking) => booking.status === "Active").length
      const totalRevenue = bookings
        .filter((booking) => booking.status === "Returned")
        .reduce((sum, booking) => sum + (booking.totalAmount || booking.advanceAmount), 0)

      setDashboardStats({
        totalCars: cars.length,
        availableCars,
        totalCustomers: customers.length,
        activeBookings,
        totalRevenue,
        pendingReturns: activeBookings,
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDataUpdate = () => {
    // Refresh dashboard stats when data is updated
    loadDashboardStats()
  }

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vats Rental CRM</h1>
              <p className="text-gray-600">Complete car rental management system</p>
            </div>
            <div className="flex items-center space-x-4">
              <QuickBookingDialog onBookingCreated={handleDataUpdate} />
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                System Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cars">Cars</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Cars"
                value={dashboardStats.totalCars}
                icon={Car}
                color="text-blue-600"
                description="Fleet size"
              />
              <StatCard
                title="Available Cars"
                value={dashboardStats.availableCars}
                icon={CheckCircle}
                color="text-green-600"
                description="Ready for rental"
              />
              <StatCard
                title="Total Customers"
                value={dashboardStats.totalCustomers}
                icon={Users}
                color="text-purple-600"
                description="Registered customers"
              />
              <StatCard
                title="Active Bookings"
                value={dashboardStats.activeBookings}
                icon={Calendar}
                color="text-orange-600"
                description="Currently rented"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Revenue"
                value={`₹${dashboardStats.totalRevenue.toLocaleString()}`}
                icon={IndianRupee}
                color="text-green-600"
                description="Completed bookings"
              />
              <StatCard
                title="Pending Returns"
                value={dashboardStats.pendingReturns}
                icon={Clock}
                color="text-yellow-600"
                description="Cars to be returned"
              />
              <StatCard
                title="System Status"
                value="Operational"
                icon={TrendingUp}
                color="text-blue-600"
                description="All systems running"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <QuickBookingDialog onBookingCreated={handleDataUpdate} />
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("cars")}>
                    <Car className="h-4 w-4 mr-2" />
                    Manage Fleet
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("customers")}>
                    <Users className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("analytics")}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>Important notifications and reminders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>All systems operational</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span>{dashboardStats.pendingReturns} pending returns</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Car className="h-4 w-4 text-blue-600" />
                    <span>{dashboardStats.availableCars} cars available for booking</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cars">
            <CarInventory />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerDatabase />
          </TabsContent>

          <TabsContent value="bookings">
            <RentalBookings />
          </TabsContent>

          <TabsContent value="history">
            <BookingHistory />
          </TabsContent>

          <TabsContent value="calendar">
            <BookingCalendar />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
