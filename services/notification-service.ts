import { mockDataService } from "@/lib/mock-data"

export interface NotificationData {
  type: "return_reminder" | "document_expiry" | "maintenance_due" | "challan_check" | "fastag_check"
  title: string
  message: string
  bookingId?: string
  customerId?: string
  carId?: string
  priority: "low" | "medium" | "high"
  createdAt: Date
  actionUrl?: string // For direct links to challan/FASTag portals
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

  async createChallanCheckNotification(booking: any, car: any): Promise<NotificationData> {
    return {
      type: "challan_check",
      title: "Check Online Challan",
      message: `Vehicle ${car.plateNumber} returned by ${booking.customerName}. Check for traffic violations during rental period (${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()})`,
      bookingId: booking.id,
      customerId: booking.customerId,
      carId: booking.carId,
      priority: "high",
      createdAt: new Date(),
      actionUrl: `https://parivahan.gov.in/rcdlstatus/?pur_cd=101`, // Sample challan check URL
    }
  },

  async createFastagCheckNotification(booking: any, car: any): Promise<NotificationData> {
    return {
      type: "fastag_check",
      title: "Check FASTag Balance & Transactions",
      message: `Vehicle ${car.plateNumber} returned. Verify FASTag balance and toll transactions for rental period. Customer: ${booking.customerName}`,
      bookingId: booking.id,
      customerId: booking.customerId,
      carId: booking.carId,
      priority: "medium",
      createdAt: new Date(),
      actionUrl: `https://netc-fastag.com/`, // Sample FASTag portal URL
    }
  },

  async getVehicleReturnNotifications(bookingId: string): Promise<NotificationData[]> {
    const notifications: NotificationData[] = []

    try {
      const bookings = await mockDataService.getBookings()
      const cars = await mockDataService.getCars()

      const booking = bookings.find((b) => b.id === bookingId)
      if (!booking) return notifications

      const car = cars.find((c) => c.id === booking.carId)
      if (!car) return notifications

      // Create challan check notification
      const challanNotification = await this.createChallanCheckNotification(booking, car)
      notifications.push(challanNotification)

      // Create FASTag check notification
      const fastagNotification = await this.createFastagCheckNotification(booking, car)
      notifications.push(fastagNotification)
    } catch (error) {
      console.error("Error creating vehicle return notifications:", error)
    }

    return notifications
  },
}
