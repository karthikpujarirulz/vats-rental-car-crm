"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Users,
  Calendar,
  BarChart3,
  Settings,
  FileText,
  Camera,
  MessageSquare,
  Bell,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react"
import RentalBookings from "./components/rental-bookings"
import CustomerDatabase from "./components/customer-database"
import CarInventory from "./components/car-inventory"
import BookingHistory from "./components/booking-history"
import AnalyticsDashboard from "@/components/analytics/analytics-dashboard"
import BookingCalendar from "@/components/calendar/booking-calendar"
import DocumentScanner from "@/components/ocr/document-scanner"
import CommunicationCenter from "@/components/communication/communication-center"
import NotificationPanel from "@/components/notifications/notification-panel"
import AdvancedReports from "@/components/reports/advanced-reports"
import VehicleReturnChecklist from "@/components/vehicle/vehicle-return-checklist"
import ExpenseTracker from "@/components/financial/expense-tracker"
import InsuranceManager from "@/components/insurance/insurance-manager"
import FleetMaintenance from "@/components/maintenance/fleet-maintenance"
import AdvancedAnalytics from "@/components/analytics/advanced-analytics"
import SettingsPage from "@/components/settings/settings-page"
import FirebaseSetupGuide from "@/components/setup/firebase-setup-guide"

type ActiveView =
  | "dashboard"
  | "bookings"
  | "customers"
  | "inventory"
  | "history"
  | "analytics"
  | "calendar"
  | "ocr"
  | "communication"
  | "notifications"
  | "reports"
  | "return"
  | "expenses"
  | "insurance"
  | "maintenance"
  | "advanced-analytics"
  | "settings"
  | "firebase-setup"

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")

  const stats = [
    {
      title: "Total Bookings",
      value: "156",
      change: "+12%",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Active Rentals",
      value: "23",
      change: "+5%",
      icon: Car,
      color: "text-green-600",
    },
    {
      title: "Total Customers",
      value: "89",
      change: "+8%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: "₹2,45,000",
      change: "+15%",
      icon: DollarSign,
      color: "text-orange-600",
    },
  ]

  const quickActions = [
    { label: "New Booking", icon: Calendar, action: () => setActiveView("bookings") },
    { label: "Add Customer", icon: Users, action: () => setActiveView("customers") },
    { label: "Add Vehicle", icon: Car, action: () => setActiveView("inventory") },
    { label: "Scan Document", icon: Camera, action: () => setActiveView("ocr") },
  ]

  const recentActivities = [
    { type: "booking", message: "New booking from Rahul Sharma", time: "2 minutes ago", icon: Calendar },
    { type: "return", message: "Vehicle MH-12-AB-1234 returned", time: "15 minutes ago", icon: Car },
    { type: "payment", message: "Payment received ₹15,000", time: "1 hour ago", icon: DollarSign },
    { type: "maintenance", message: "Service due for MH-12-CD-5678", time: "2 hours ago", icon: AlertTriangle },
  ]

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "customers", label: "Customers", icon: Users },
    { id: "inventory", label: "Inventory", icon: Car },
    { id: "history", label: "History", icon: Clock },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "ocr", label: "OCR Scanner", icon: Camera },
    { id: "communication", label: "Communication", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "return", label: "Vehicle Return", icon: Car },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "insurance", label: "Insurance", icon: AlertTriangle },
    { id: "maintenance", label: "Maintenance", icon: Settings },
    { id: "advanced-analytics", label: "AI Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "firebase-setup", label: "Firebase Setup", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeView) {
      case "bookings":
        return <RentalBookings />
      case "customers":
        return <CustomerDatabase />
      case "inventory":
        return <CarInventory />
      case "history":
        return <BookingHistory />
      case "analytics":
        return <AnalyticsDashboard />
      case "calendar":
        return <BookingCalendar />
      case "ocr":
        return <DocumentScanner />
      case "communication":
        return <CommunicationCenter />
      case "notifications":
        return <NotificationPanel />
      case "reports":
        return <AdvancedReports />
      case "return":
        return <VehicleReturnChecklist />
      case "expenses":
        return <ExpenseTracker />
      case "insurance":
        return <InsuranceManager />
      case "maintenance":
        return <FleetMaintenance />
      case "advanced-analytics":
        return <AdvancedAnalytics />
      case "settings":
        return <SettingsPage />
      case "firebase-setup":
        return <FirebaseSetupGuide />
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-green-600">{stat.change} from last month</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used actions for faster workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button key={index} variant="outline" className="h-20 flex flex-col gap-2" onClick={action.action}>
                      <action.icon className="h-6 w-6" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates and activities in your rental business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                      <activity.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Vats Rental CRM</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setActiveView("notifications")}>
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveView("settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView(item.id as ActiveView)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}
