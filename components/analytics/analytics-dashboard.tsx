"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Target, Award, CarIcon } from "lucide-react"
import { mockDataService } from "@/lib/mock-data"

interface AnalyticsData {
  totalRevenue: number
  monthlyRevenue: number
  totalBookings: number
  activeBookings: number
  utilizationRate: number
  averageBookingValue: number
  topCustomers: Array<{ name: string; bookings: number; revenue: number }>
  monthlyTrends: Array<{ month: string; revenue: number; bookings: number }>
  carPerformance: Array<{ car: string; bookings: number; revenue: number; utilization: number }>
  revenueByPaymentMode: Array<{ mode: string; amount: number; percentage: number }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("6months")

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      const [bookings, cars, customers] = await Promise.all([
        mockDataService.getBookings(),
        mockDataService.getCars(),
        mockDataService.getCustomers(),
      ])

      const completedBookings = bookings.filter((b) => b.status === "Returned")
      const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
      const currentMonth = new Date().getMonth()
      const monthlyBookings = completedBookings.filter((b) => new Date(b.createdAt).getMonth() === currentMonth)
      const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)

      // Calculate utilization rate
      const totalCarDays = cars.length * 30 // Assuming 30 days
      const bookedDays = bookings.reduce((sum, b) => sum + b.duration, 0)
      const utilizationRate = (bookedDays / totalCarDays) * 100

      // Top customers analysis
      const customerStats = customers.map((customer) => {
        const customerBookings = completedBookings.filter((b) => b.customerId === customer.id)
        const revenue = customerBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
        return {
          name: customer.name,
          bookings: customerBookings.length,
          revenue,
        }
      })
      const topCustomers = customerStats.sort((a, b) => b.revenue - a.revenue).slice(0, 5)

      // Monthly trends (last 6 months)
      const monthlyTrends = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthBookings = completedBookings.filter((b) => new Date(b.createdAt).getMonth() === date.getMonth())
        monthlyTrends.push({
          month: date.toLocaleDateString("en-US", { month: "short" }),
          revenue: monthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
          bookings: monthBookings.length,
        })
      }

      // Car performance analysis
      const carPerformance = cars.map((car) => {
        const carBookings = completedBookings.filter((b) => b.carId === car.id)
        const revenue = carBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
        const totalDays = carBookings.reduce((sum, b) => sum + b.duration, 0)
        const utilization = (totalDays / 30) * 100 // Assuming 30 days period

        return {
          car: `${car.make} ${car.model}`,
          bookings: carBookings.length,
          revenue,
          utilization,
        }
      })

      // Revenue by payment mode
      const paymentModes = ["Cash", "UPI", "Card", "Bank Transfer"]
      const revenueByPaymentMode = paymentModes.map((mode) => {
        const modeBookings = completedBookings.filter((b) => b.paymentMode === mode)
        const amount = modeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
        const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0

        return { mode, amount, percentage }
      })

      setAnalytics({
        totalRevenue,
        monthlyRevenue,
        totalBookings: bookings.length,
        activeBookings: bookings.filter((b) => b.status === "Active").length,
        utilizationRate,
        averageBookingValue: completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0,
        topCustomers,
        monthlyTrends,
        carPerformance,
        revenueByPaymentMode,
      })
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return <div className="flex items-center justify-center py-8">Loading analytics...</div>
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
            <CarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.utilizationRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.averageBookingValue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.7% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="performance">Car Performance</TabsTrigger>
          <TabsTrigger value="customers">Top Customers</TabsTrigger>
          <TabsTrigger value="payments">Payment Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Booking Trends</CardTitle>
              <CardDescription>Monthly revenue and booking volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analytics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#82ca9d" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Car Performance Analysis</CardTitle>
              <CardDescription>Revenue and utilization by vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.carPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="car" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                  <Bar dataKey="utilization" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Customers by Revenue</CardTitle>
                <CardDescription>Highest value customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topCustomers.map((customer, index) => (
                    <div key={customer.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.bookings} bookings</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{customer.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Distribution</CardTitle>
                <CardDescription>Booking frequency distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.topCustomers}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {analytics.topCustomers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Mode Distribution</CardTitle>
                <CardDescription>Revenue breakdown by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.revenueByPaymentMode}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ mode, percentage }) => `${mode} ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {analytics.revenueByPaymentMode.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method Performance</CardTitle>
                <CardDescription>Revenue by payment mode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.revenueByPaymentMode.map((payment, index) => (
                    <div key={payment.mode} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium">{payment.mode}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{payment.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
