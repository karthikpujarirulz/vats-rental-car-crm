"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, AlertTriangle, Clock, CheckCircle, X } from "lucide-react"
import { notificationService, type NotificationData } from "@/services/notification-service"

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const dailyReminders = await notificationService.getDailyReminders()
      setNotifications(dailyReminders)
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const dismissNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index))
  }

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="relative">
        <Bell className="h-4 w-4 mr-2" />
        Alerts
        {notifications.length > 0 && <Badge className="ml-2 bg-red-500 text-white">{notifications.length}</Badge>}
      </Button>
    )
  }

  return (
    <Card className="w-96 absolute right-0 top-12 z-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Daily Alerts</CardTitle>
          <CardDescription>{notifications.length} notifications</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            No alerts for today!
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <Alert key={index} className={getPriorityColor(notification.priority)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    {getPriorityIcon(notification.priority)}
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <AlertDescription className="mt-1">{notification.message}</AlertDescription>
                      <div className="text-xs mt-2 opacity-75">{notification.createdAt.toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => dismissNotification(index)} className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Alert>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full" onClick={loadNotifications}>
            Refresh Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
