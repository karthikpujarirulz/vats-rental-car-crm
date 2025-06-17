"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Car, Users, IndianRupee, Calendar, Activity, Target, Brain, Zap } from "lucide-react"

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
    forecast: number
  }
  bookings: {
    total: number
    completed: number
    active: number
    cancelled: number
  }
  fleet: {
    utilization: number
    averageRate: number
    topPerformer: string
    maintenanceCost: number
  }
  customers: {
    total: number
    returning: number
    satisfaction: number
    retention: number
  }
  predictions: {
    nextMonthRevenue: number
    peakSeason: string
    recommendedFleetSize: number
    profitMargin: number
  }
}

export default function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [loading, setLoading] = useState(true)

  // Mock analytics data
  const mockAnalyticsData: AnalyticsData = {
    revenue: {
      current: 185000,
      previous: 165000,
      growth: 12.1,
      forecast: 205000,
    },
    bookings: {
      total: 45,
      completed: 38,
      active: 5,
      cancelled: 2,
    },
    fleet: {
      utilization: 78.5,
      averageRate: 2100,
      topPerformer: "Hyundai Creta",
      maintenanceCost: 32000,
    },
    customers: {
      total: 156,
      returning: 68,
      satisfaction: 4.6,
      retention: 73.5,
    },
    predictions: {
      nextMonthRevenue: 198000,
      peakSeason: "December-January",
      recommendedFleetSize: 12,
      profitMargin: 68.2,
    },
  }

  useEffect(() => {
    loadAnalyticsData()
  }, [selectedPeriod])

  const loadAnalyticsData = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setAnalyticsData(mockAnalyticsData)
    setLoading(false)
  }

  const StatCard = ({ title, value, change, icon: Icon, color, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center text-xs mt-1">
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
            )}
            <span className={trend === "up" ? "text-green-600" : "text-red-600"}>{change}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics & AI Insights</h2>
          <p className="text-gray-600">AI-powered business intelligence and predictive analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Brain className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Revenue Growth"
              value={`₹${analyticsData.revenue.current.toLocaleString()}`}
              change={`+${analyticsData.revenue.growth}%`}
              icon={IndianRupee}
              color="text-green-600"
              trend="up"
            />
            <StatCard
              title="Fleet Utilization"
              value={`${analyticsData.fleet.utilization}%`}
              change="+5.2%"
              icon={Car}
              color="text-blue-600"
              trend="up"
            />
            <StatCard
              title="Customer Satisfaction"
              value={`${analyticsData.customers.satisfaction}/5`}
              change="+0.3"
              icon={Users}
              color="text-purple-600"
              trend="up"
            />
            <StatCard
              title="Profit Margin"
              value={`${analyticsData.predictions.profitMargin}%`}
              change="+2.1%"
              icon={Target}
              color="text-orange-600"
              trend="up"
            />
          </div>

          {/* AI Insights */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span>AI Business Insights</span>
              </CardTitle>
              <CardDescription>Smart recommendations powered by machine learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Revenue Opportunity</h4>
                      <p className="text-sm text-gray-600">
                        Add 2 more SUVs to increase revenue by ₹45,000/month. High demand detected for premium vehicles.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Peak Season Alert</h4>
                      <p className="text-sm text-gray-600">
                        December-January shows 40% higher demand. Consider dynamic pricing strategy.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Maintenance Optimization</h4>
                      <p className="text-sm text-gray-600">
                        Schedule maintenance for Swift and Nexon next week to avoid peak season downtime.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Customer Retention</h4>
                      <p className="text-sm text-gray-600">
                        73% retention rate is excellent. Loyalty program could boost it to 85%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed Bookings</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(analyticsData.bookings.completed / analyticsData.bookings.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{analyticsData.bookings.completed}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Bookings</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(analyticsData.bookings.active / analyticsData.bookings.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{analyticsData.bookings.active}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cancelled Bookings</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{
                            width: `${(analyticsData.bookings.cancelled / analyticsData.bookings.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{analyticsData.bookings.cancelled}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fleet Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top Performer</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {analyticsData.fleet.topPerformer}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Daily Rate</span>
                    <span className="font-medium">₹{analyticsData.fleet.averageRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Utilization Rate</span>
                    <span className="font-medium">{analyticsData.fleet.utilization}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Maintenance Cost</span>
                    <span className="font-medium text-red-600">
                      ₹{analyticsData.fleet.maintenanceCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Current Revenue"
              value={`₹${analyticsData.revenue.current.toLocaleString()}`}
              icon={IndianRupee}
              color="text-green-600"
            />
            <StatCard
              title="Previous Period"
              value={`₹${analyticsData.revenue.previous.toLocaleString()}`}
              icon={Calendar}
              color="text-gray-600"
            />
            <StatCard
              title="Growth Rate"
              value={`+${analyticsData.revenue.growth}%`}
              icon={TrendingUp}
              color="text-green-600"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast</CardTitle>
              <CardDescription>AI-powered revenue predictions for next month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ₹{analyticsData.predictions.nextMonthRevenue.toLocaleString()}
                </div>
                <p className="text-gray-600">Predicted revenue for next month</p>
                <Badge className="mt-4 bg-blue-100 text-blue-800">
                  +
                  {(
                    ((analyticsData.predictions.nextMonthRevenue - analyticsData.revenue.current) /
                      analyticsData.revenue.current) *
                    100
                  ).toFixed(1)}
                  % growth expected
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Fleet Utilization"
              value={`${analyticsData.fleet.utilization}%`}
              icon={Car}
              color="text-blue-600"
            />
            <StatCard
              title="Average Rate"
              value={`₹${analyticsData.fleet.averageRate}`}
              icon={IndianRupee}
              color="text-green-600"
            />
            <StatCard
              title="Maintenance Cost"
              value={`₹${analyticsData.fleet.maintenanceCost.toLocaleString()}`}
              icon={Activity}
              color="text-red-600"
            />
            <StatCard
              title="Recommended Fleet Size"
              value={analyticsData.predictions.recommendedFleetSize}
              icon={Target}
              color="text-purple-600"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fleet Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800">High Demand Vehicles</h4>
                  <p className="text-sm text-green-700 mt-1">
                    SUVs (Creta, XUV300) have 95% utilization. Consider adding 2 more SUVs.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800">Underperforming Assets</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Sedan category has 60% utilization. Consider repositioning or pricing adjustment.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800">Maintenance Schedule</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Optimize maintenance timing to avoid peak demand periods (weekends & holidays).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Customers"
              value={analyticsData.customers.total}
              icon={Users}
              color="text-purple-600"
            />
            <StatCard
              title="Returning Customers"
              value={`${analyticsData.customers.returning}%`}
              icon={TrendingUp}
              color="text-green-600"
            />
            <StatCard
              title="Satisfaction Score"
              value={`${analyticsData.customers.satisfaction}/5`}
              icon={Target}
              color="text-blue-600"
            />
            <StatCard
              title="Retention Rate"
              value={`${analyticsData.customers.retention}%`}
              icon={Activity}
              color="text-orange-600"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Customer Segments</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Business Travelers</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Leisure Travelers</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Local Commuters</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Booking Patterns</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Weekend Bookings</span>
                      <span className="text-sm font-medium">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Advance Bookings</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Repeat Customers</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Predictions & Forecasts</span>
              </CardTitle>
              <CardDescription>Machine learning powered business predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-purple-800">Revenue Forecast</h4>
                    <div className="text-2xl font-bold text-purple-600 mt-2">
                      ₹{analyticsData.predictions.nextMonthRevenue.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Expected next month revenue</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-blue-800">Peak Season</h4>
                    <div className="text-xl font-bold text-blue-600 mt-2">{analyticsData.predictions.peakSeason}</div>
                    <p className="text-sm text-gray-600 mt-1">Highest demand period</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-green-800">Optimal Fleet Size</h4>
                    <div className="text-2xl font-bold text-green-600 mt-2">
                      {analyticsData.predictions.recommendedFleetSize} vehicles
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Recommended for maximum ROI</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-orange-800">Profit Margin</h4>
                    <div className="text-2xl font-bold text-orange-600 mt-2">
                      {analyticsData.predictions.profitMargin}%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Projected profit margin</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Fleet Expansion</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Add 2 SUVs and 1 luxury sedan to capture ₹45,000 additional monthly revenue.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Dynamic Pricing</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Implement surge pricing during peak hours to increase revenue by 15-20%.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Customer Loyalty</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Launch loyalty program to increase retention from 73% to 85%.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
