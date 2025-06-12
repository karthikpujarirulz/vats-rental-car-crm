"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Eye, User, Phone, MapPin, Camera } from "lucide-react"
import DocumentScanner from "@/components/ocr/document-scanner"
import { mockDataService, type Customer } from "@/lib/mock-data"
import type { AadharData, DLData } from "@/services/ocr-service"

export default function CustomerDatabase() {
  console.log("Customer Database component loaded successfully")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    phone: "",
    address: "",
  })

  const [ocrData, setOcrData] = useState<{ aadhar?: AadharData; dl?: DLData }>({})

  // Load customers on component mount
  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const customersData = await mockDataService.getCustomers()
      setCustomers(customersData)
    } catch (error) {
      console.error("Error loading customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOCRData = (data: AadharData | DLData, type: "aadhar" | "dl") => {
    console.log(`OCR data received for ${type}:`, data)
    setOcrData((prev) => ({ ...prev, [type]: data }))

    // Auto-fill form with OCR data
    try {
      if (type === "aadhar") {
        const aadharData = data as AadharData
        setNewCustomer((prev) => ({
          ...prev,
          name: aadharData.name || prev.name,
          address: aadharData.address || prev.address,
        }))
      } else if (type === "dl") {
        const dlData = data as DLData
        setNewCustomer((prev) => ({
          ...prev,
          name: dlData.name || prev.name,
          address: dlData.address || prev.address,
        }))
      }
    } catch (error) {
      console.error("Error processing OCR data:", error)
    }
  }

  const handleAddCustomer = async () => {
    if (newCustomer.name && newCustomer.phone && newCustomer.address) {
      try {
        const customerId = await mockDataService.generateCustomerId()
        await mockDataService.addCustomer({
          name: newCustomer.name,
          phone: newCustomer.phone,
          address: newCustomer.address,
          customerId,
        })

        // Refresh the customer list
        await loadCustomers()

        // Reset form
        setNewCustomer({
          name: "",
          phone: "",
          address: "",
        })
        setOcrData({})
        setIsAddDialogOpen(false)
      } catch (error) {
        console.error("Error adding customer:", error)
        alert("Error adding customer. Please try again.")
      }
    }
  }

  const getCustomerBookingCount = (customerId: string) => {
    // This would normally come from the booking service
    // For now, return a placeholder count
    return Math.floor(Math.random() * 5)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Database</h2>
          <p className="text-gray-600">Manage customer profiles and documents</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Add a new customer to your database</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Documents (Optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <DocumentScanner documentType="aadhar" onDataExtracted={handleOCRData} />
                  <DocumentScanner documentType="dl" onDataExtracted={handleOCRData} />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Selfie
                </Button>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomer}>Add Customer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600 mb-4">Add your first customer to get started.</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Customer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription>{customer.customerId}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{getCustomerBookingCount(customer.id)} bookings</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">{customer.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Added: {new Date(customer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${customer.aadharUrl ? "bg-green-500" : "bg-gray-300"}`}
                      title="Aadhar Card"
                    ></div>
                    <div
                      className={`w-2 h-2 rounded-full ${customer.dlUrl ? "bg-green-500" : "bg-gray-300"}`}
                      title="Driving License"
                    ></div>
                    <div
                      className={`w-2 h-2 rounded-full ${customer.photoUrl ? "bg-green-500" : "bg-gray-300"}`}
                      title="Photo"
                    ></div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
