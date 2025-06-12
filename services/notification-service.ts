import { mockDataService } from "@/lib/mock-data"

export interface NotificationData {
  type: "return_reminder" | "document_expiry" | "maintenance_due"
  title: string
  message: string
  bookingId?: string
  customerId?: string
  priority: "low" | "medium" | "high"
  createdAt: Date
}

export const notificationService = {
  async getDailyReminders(): Promise<NotificationData[]> {
    const notifications: NotificationData[] = []
    const today = new Date().toISOString().split("T")[0]

    try {
      // Get active bookings
      const activeBookings = await mockDataService.getActiveBookings()

      // Check for returns due today
      const returnsToday = activeBookings.filter((booking) => booking.endDate === today)

      returnsToday.forEach((booking) => {
        notifications.push({
          type: "return_reminder",
          title: "Return Due Today",
          message: `${booking.customerName} should return ${booking.carDetails} today`,
          bookingId: booking.id,
          customerId: booking.customerId,
          priority: "high",
          createdAt: new Date(),
        })
      })

      // Check for overdue returns
      const overdueBookings = activeBookings.filter((booking) => booking.endDate < today)

      overdueBookings.forEach((booking) => {
        const daysOverdue = Math.floor(
          (new Date().getTime() - new Date(booking.endDate).getTime()) / (1000 * 60 * 60 * 24),
        )
        notifications.push({
          type: "return_reminder",
          title: "Overdue Return",
          message: `${booking.customerName} is ${daysOverdue} days overdue for ${booking.carDetails}`,
          bookingId: booking.id,
          customerId: booking.customerId,
          priority: "high",
          createdAt: new Date(),
        })
      })

      // Check for returns due tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split("T")[0]

      const returnsTomorrow = activeBookings.filter((booking) => booking.endDate === tomorrowStr)

      returnsTomorrow.forEach((booking) => {
        notifications.push({
          type: "return_reminder",
          title: "Return Due Tomorrow",
          message: `${booking.customerName} should return ${booking.carDetails} tomorrow`,
          bookingId: booking.id,
          customerId: booking.customerId,
          priority: "medium",
          createdAt: new Date(),
        })
      })
    } catch (error) {
      console.error("Error fetching daily reminders:", error)
    }

    return notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  },

  async sendSMSNotification(phone: string, message: string) {
    // Mock SMS service
    console.log(`SMS to ${phone}: ${message}`)
    return Promise.resolve()
  },

  async sendWhatsAppNotification(phone: string, message: string) {
    // Mock WhatsApp service
    console.log(`WhatsApp to ${phone}: ${message}`)
    return Promise.resolve()
  },
}
