// Advanced Communication Service for SMS, WhatsApp, and Email
export interface MessageTemplate {
  id: string
  name: string
  type: "sms" | "whatsapp" | "email"
  template: string
  variables: string[]
}

export interface CommunicationLog {
  id: string
  customerId: string
  customerName: string
  type: "sms" | "whatsapp" | "email"
  message: string
  status: "sent" | "delivered" | "failed" | "pending"
  timestamp: Date
  cost?: number
}

class CommunicationService {
  private templates: MessageTemplate[] = [
    {
      id: "booking_confirmation",
      name: "Booking Confirmation",
      type: "sms",
      template:
        "Hi {customerName}, your booking {bookingId} for {carDetails} from {startDate} to {endDate} is confirmed. Advance: ₹{advance}. Contact: {phone}",
      variables: ["customerName", "bookingId", "carDetails", "startDate", "endDate", "advance", "phone"],
    },
    {
      id: "return_reminder",
      name: "Return Reminder",
      type: "whatsapp",
      template:
        "🚗 *Return Reminder* 🚗\n\nHi {customerName},\n\nYour rental {carDetails} is due for return tomorrow ({returnDate}).\n\nReturn Location: Vats Rental, Thane\nTime: Before 6 PM\n\nFor any queries: {phone}",
      variables: ["customerName", "carDetails", "returnDate", "phone"],
    },
    {
      id: "overdue_notice",
      name: "Overdue Notice",
      type: "sms",
      template:
        "URGENT: {customerName}, your rental {carDetails} is {daysOverdue} days overdue. Please return immediately or contact {phone}. Late charges apply.",
      variables: ["customerName", "carDetails", "daysOverdue", "phone"],
    },
    {
      id: "payment_reminder",
      name: "Payment Reminder",
      type: "whatsapp",
      template:
        "💰 *Payment Reminder* 💰\n\nHi {customerName},\n\nPending payment for booking {bookingId}:\nAmount: ₹{amount}\nDue Date: {dueDate}\n\nPay now to avoid late charges.\n\nUPI: vatsrental@paytm\nContact: {phone}",
      variables: ["customerName", "bookingId", "amount", "dueDate", "phone"],
    },
  ]

  private logs: CommunicationLog[] = []

  // SMS Service Integration (Mock - integrate with services like Twilio, MSG91, etc.)
  async sendSMS(phone: string, message: string, customerId?: string, customerName?: string): Promise<boolean> {
    try {
      // Mock SMS API call
      console.log(`SMS to ${phone}: ${message}`)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Log the communication
      this.logs.push({
        id: Date.now().toString(),
        customerId: customerId || "unknown",
        customerName: customerName || "Unknown",
        type: "sms",
        message,
        status: "sent",
        timestamp: new Date(),
        cost: 0.5, // ₹0.50 per SMS
      })

      return true
    } catch (error) {
      console.error("SMS sending failed:", error)
      return false
    }
  }

  // WhatsApp Business API Integration (Mock)
  async sendWhatsApp(phone: string, message: string, customerId?: string, customerName?: string): Promise<boolean> {
    try {
      // Mock WhatsApp API call
      console.log(`WhatsApp to ${phone}: ${message}`)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      this.logs.push({
        id: Date.now().toString(),
        customerId: customerId || "unknown",
        customerName: customerName || "Unknown",
        type: "whatsapp",
        message,
        status: "sent",
        timestamp: new Date(),
        cost: 0.25, // ₹0.25 per WhatsApp message
      })

      return true
    } catch (error) {
      console.error("WhatsApp sending failed:", error)
      return false
    }
  }

  // Email Service Integration (Mock)
  async sendEmail(
    email: string,
    subject: string,
    message: string,
    customerId?: string,
    customerName?: string,
  ): Promise<boolean> {
    try {
      console.log(`Email to ${email}: ${subject} - ${message}`)

      await new Promise((resolve) => setTimeout(resolve, 800))

      this.logs.push({
        id: Date.now().toString(),
        customerId: customerId || "unknown",
        customerName: customerName || "Unknown",
        type: "email",
        message: `${subject}: ${message}`,
        status: "sent",
        timestamp: new Date(),
        cost: 0.1, // ₹0.10 per email
      })

      return true
    } catch (error) {
      console.error("Email sending failed:", error)
      return false
    }
  }

  // Template-based messaging
  async sendTemplateMessage(
    templateId: string,
    phone: string,
    variables: Record<string, string>,
    customerId?: string,
    customerName?: string,
  ): Promise<boolean> {
    const template = this.templates.find((t) => t.id === templateId)
    if (!template) {
      throw new Error("Template not found")
    }

    let message = template.template
    template.variables.forEach((variable) => {
      const value = variables[variable] || `{${variable}}`
      message = message.replace(new RegExp(`{${variable}}`, "g"), value)
    })

    if (template.type === "sms") {
      return this.sendSMS(phone, message, customerId, customerName)
    } else if (template.type === "whatsapp") {
      return this.sendWhatsApp(phone, message, customerId, customerName)
    }

    return false
  }

  // Bulk messaging
  async sendBulkMessage(
    recipients: Array<{ phone: string; customerId?: string; customerName?: string }>,
    message: string,
    type: "sms" | "whatsapp" = "sms",
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0
    let failed = 0

    for (const recipient of recipients) {
      try {
        let success = false
        if (type === "sms") {
          success = await this.sendSMS(recipient.phone, message, recipient.customerId, recipient.customerName)
        } else {
          success = await this.sendWhatsApp(recipient.phone, message, recipient.customerId, recipient.customerName)
        }

        if (success) sent++
        else failed++

        // Add delay between messages to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200))
      } catch (error) {
        failed++
      }
    }

    return { sent, failed }
  }

  // Get communication logs
  getCommunicationLogs(customerId?: string): CommunicationLog[] {
    if (customerId) {
      return this.logs.filter((log) => log.customerId === customerId)
    }
    return this.logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Get templates
  getTemplates(): MessageTemplate[] {
    return this.templates
  }

  // Add custom template
  addTemplate(template: Omit<MessageTemplate, "id">): MessageTemplate {
    const newTemplate: MessageTemplate = {
      ...template,
      id: Date.now().toString(),
    }
    this.templates.push(newTemplate)
    return newTemplate
  }

  // Get communication statistics
  getCommunicationStats(): {
    totalSent: number
    totalCost: number
    byType: Record<string, { count: number; cost: number }>
    recentActivity: CommunicationLog[]
  } {
    const totalSent = this.logs.length
    const totalCost = this.logs.reduce((sum, log) => sum + (log.cost || 0), 0)

    const byType = this.logs.reduce(
      (acc, log) => {
        if (!acc[log.type]) {
          acc[log.type] = { count: 0, cost: 0 }
        }
        acc[log.type].count++
        acc[log.type].cost += log.cost || 0
        return acc
      },
      {} as Record<string, { count: number; cost: number }>,
    )

    const recentActivity = this.logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)

    return {
      totalSent,
      totalCost,
      byType,
      recentActivity,
    }
  }
}

export const communicationService = new CommunicationService()
