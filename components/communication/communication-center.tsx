"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare, Send, Phone, Mail, Users, Clock, CheckCircle } from "lucide-react"
import { mockDataService, type Customer } from "@/lib/mock-data"

interface Message {
  id: string
  customerId: string
  customerName: string
  type: "SMS" | "WhatsApp" | "Email"
  content: string
  status: "Sent" | "Delivered" | "Read" | "Failed"
  sentAt: string
  cost: number
}

export default function CommunicationCenter() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [messageType, setMessageType] = useState<"SMS" | "WhatsApp" | "Email">("SMS")
  const [messageContent, setMessageContent] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Message templates
  const templates = {
    SMS: [
      "Hi {name}, your booking {bookingId} is confirmed for {date}. Thank you for choosing Vats Rental!",
      "Reminder: Your rental return is due today. Please return the vehicle by 6 PM. - Vats Rental",
      "Hi {name}, your payment of ₹{amount} is overdue. Please clear dues at earliest. - Vats Rental",
      "Thank you {name} for returning the vehicle on time. We hope you had a great experience!",
    ],
    WhatsApp: [
      "🚗 Hi {name}! Your booking is confirmed!\n\n📅 Date: {date}\n🆔 Booking ID: {bookingId}\n\nThank you for choosing Vats Rental! 🙏",
      "⏰ Reminder: Vehicle return due today!\n\nPlease return by 6 PM to avoid late charges.\n\n📞 Call us: +91 9876543210",
      "💰 Payment Reminder\n\nHi {name}, your payment of ₹{amount} is pending.\n\nPlease clear dues to avoid service interruption.",
      "✅ Thank you for the timely return!\n\nWe appreciate your business and hope to serve you again soon! 🚗✨",
    ],
    Email: [
      "Dear {name},\n\nYour booking has been confirmed. Details:\nBooking ID: {bookingId}\nDate: {date}\n\nBest regards,\nVats Rental Team",
      "Dear {name},\n\nThis is a reminder that your rental return is due today. Please return the vehicle by 6 PM.\n\nThank you,\nVats Rental",
      "Dear {name},\n\nYour payment of ₹{amount} is overdue. Please clear the outstanding amount at your earliest convenience.\n\nRegards,\nVats Rental",
      "Dear {name},\n\nThank you for returning the vehicle on time. We appreciate your business and look forward to serving you again.\n\nBest regards,\nVats Rental Team",
    ],
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const customersData = await mockDataService.getCustomers()
      setCustomers(customersData)

      // Load mock messages
      const mockMessages: Message[] = [
        {
          id: "1",
          customerId: "1",
          customerName: "Rajesh Kumar",
          type: "SMS",
          content:
            "Hi Rajesh, your booking VAT-20241212-001 is confirmed for 12/12/2024. Thank you for choosing Vats Rental!",
          status: "Delivered",
          sentAt: "2024-12-12T10:30:00",
          cost: 2.5,
        },
        {
          id: "2",
          customerId: "2",
          customerName: "Priya Sharma",
          type: "WhatsApp",
          content:
            "🚗 Hi Priya! Your booking is confirmed!\n\n📅 Date: 10/12/2024\n🆔 Booking ID: VAT-20241210-002\n\nThank you for choosing Vats Rental! 🙏",
          status: "Read",
          sentAt: "2024-12-10T09:15:00",
          cost: 1.0,
        },
        {
          id: "3",
          customerId: "3",
          customerName: "Amit Patel",
          type: "Email",
          content:
            "Dear Amit,\n\nYour booking has been confirmed. Details:\nBooking ID: VAT-20241205-003\nDate: 05/12/2024\n\nBest regards,\nVats Rental Team",
          status: "Sent",
          sentAt: "2024-12-05T14:20:00",
          cost: 0.5,
        },
      ]
      setMessages(mockMessages)
    } catch (error) {
      console.error("Error loading communication data:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!messageContent.trim() || selectedCustomers.length === 0) return

    setLoading(true)
    try {
      const newMessages: Message[] = selectedCustomers.map((customerId) => {
        const customer = customers.find((c) => c.id === customerId)
        return {
          id: Date.now().toString() + Math.random(),
          customerId,
          customerName: customer?.name || "",
          type: messageType,
          content: messageContent,
          status: "Sent" as const,
          sentAt: new Date().toISOString(),
          cost: messageType === "SMS" ? 2.5 : messageType === "WhatsApp" ? 1.0 : 0.5,
        }
      })

      setMessages((prev) => [...newMessages, ...prev])
      setMessageContent("")
      setSelectedCustomers([])
      setIsComposing(false)

      // Simulate delivery status updates
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            newMessages.some((nm) => nm.id === msg.id) ? { ...msg, status: "Delivered" as const } : msg,
          ),
        )
      }, 2000)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-blue-100 text-blue-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Read":
        return "bg-purple-100 text-purple-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SMS":
        return <Phone className="h-4 w-4" />
      case "WhatsApp":
        return <MessageSquare className="h-4 w-4" />
      case "Email":
        return <Mail className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const totalCost = messages.reduce((sum, msg) => sum + msg.cost, 0)
  const messageStats = {
    total: messages.length,
    sent: messages.filter((m) => m.status === "Sent").length,
    delivered: messages.filter((m) => m.status === "Delivered").length,
    read: messages.filter((m) => m.status === "Read").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Communication Center</h2>
          <p className="text-gray-600">Send SMS, WhatsApp, and Email messages to customers</p>
        </div>
        <Dialog open={isComposing} onOpenChange={setIsComposing}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Compose Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
              <DialogDescription>Send messages to your customers</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Message Type</Label>
                  <Select value={messageType} onValueChange={(value: any) => setMessageType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMS">SMS (₹2.5 each)</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp (₹1.0 each)</SelectItem>
                      <SelectItem value="Email">Email (₹0.5 each)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Recipients</Label>
                  <Select
                    value={selectedCustomers.length > 0 ? "selected" : ""}
                    onValueChange={(value) => {
                      if (value === "all") {
                        setSelectedCustomers(customers.map((c) => c.id))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`${selectedCustomers.length} selected`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers ({customers.length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Select Customers</Label>
                <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                  {customers.map((customer) => (
                    <label key={customer.id} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCustomers((prev) => [...prev, customer.id])
                          } else {
                            setSelectedCustomers((prev) => prev.filter((id) => id !== customer.id))
                          }
                        }}
                      />
                      <span>
                        {customer.name} - {customer.phone}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Message Templates</Label>
                <Select onValueChange={(value) => setMessageContent(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates[messageType].map((template, index) => (
                      <SelectItem key={index} value={template}>
                        Template {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Message Content</Label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {"{name}"}, {"{bookingId}"}, {"{date}"}, {"{amount}"} for dynamic content
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Cost: ₹
                  {(
                    selectedCustomers.length * (messageType === "SMS" ? 2.5 : messageType === "WhatsApp" ? 1.0 : 0.5)
                  ).toFixed(2)}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsComposing(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={loading || !messageContent.trim() || selectedCustomers.length === 0}
                  >
                    {loading ? "Sending..." : `Send to ${selectedCustomers.length} customers`}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messageStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{messageStats.delivered}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{messageStats.read}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <span className="text-sm">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Message History */}
      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>Recent communications with customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(message.type)}
                    <span className="font-medium">{message.customerName}</span>
                    <Badge variant="outline">{message.type}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(message.status)}>{message.status}</Badge>
                    <span className="text-xs text-gray-500">{new Date(message.sentAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{message.content}</div>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Cost: ₹{message.cost}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(message.sentAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
