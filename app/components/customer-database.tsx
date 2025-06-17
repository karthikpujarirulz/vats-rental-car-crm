"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, User, Edit, Trash2, Phone, MapPin, Search } from "lucide-react"
import { mockDataService, type Customer } from "@/lib/mock-data"
import CustomerDetails from "@/components/customer/customer-details"
import SelfieCapture from "@/components/camera/selfie-capture"

export default function CustomerDatabase() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dateOfBirth: "",
    licenseNumber: "",
    licenseExpiry: "",
    aadharNumber: "",
    emergencyContact: "",
    emergencyPhone: "",
    customerType: "Individual",
    notes: "",
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchTerm])

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

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers)
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm) ||
          customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCustomers(filtered)
    }
  }

  const handleAddCustomer = async () => {
    if (newCustomer.name && newCustomer.phone) {
      try {
        const customerId = await mockDataService.generateCustomerId()
        const customerData = {
          ...newCustomer,
          id: `customer_${Date.now()}`,
          customerId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          totalBookings: 0,
          totalSpent: 0,
          lastBookingDate: "",
        } as Customer

        await mockDataService.addCustomer(customerData)
        await loadCustomers()
        setNewCustomer({
          name: "",
          phone: "",
          email: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          dateOfBirth: "",
          licenseNumber: "",
          licenseExpiry: "",
          aadharNumber: "",
          emergencyContact: "",
          emergencyPhone: "",
          customerType: "Individual",
          notes: "",
        })
        setIsAddDialogOpen(false)
      } catch (error) {
        console.error("Error adding customer:", error)
        alert("Error adding customer. Please try again.")
      }
    }
  }

  const handleEditCustomer = async () => {
    if (editingCustomer && editingCustomer.name && editingCustomer.phone) {
      try {
        const updatedCustomer = {
          ...editingCustomer,
          updatedAt: new Date().toISOString(),
        }

        await mockDataService.updateCustomer(editingCustomer.id, updatedCustomer)
        await loadCustomers()
        setEditingCustomer(null)
      } catch (error) {
        console.error("Error updating customer:", error)
        alert("Error updating customer. Please try again.")
      }
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await mockDataService.deleteCustomer(customerId)
        await loadCustomers()
      } catch (error) {
        console.error("Error deleting customer:", error)
        alert("Error deleting customer. Please try again.")
      }
    }
  }

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "Individual":
        return "bg-blue-100 text-blue-800"
      case "Corporate":
        return "bg-purple-100 text-purple-800"
      case "VIP":
        return "bg-gold-100 text-gold-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isFormValid = (customer: Partial<Customer>) => {
    return customer.name && customer.phone
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
          <p className="text-gray-600">Manage your customer information and booking history</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Add a new customer to your database</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newCustomer.dateOfBirth}
                  onChange={(e) => setNewCustomer({ ...newCustomer, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Complete address"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newCustomer.state}
                  onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                  placeholder="Maharashtra"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={newCustomer.pincode}
                  onChange={(e) => setNewCustomer({ ...newCustomer, pincode: e.target.value })}
                  placeholder="400001"
                />
              </div>
              <div>
                <Label htmlFor="customerType">Customer Type</Label>
                <Select
                  value={newCustomer.customerType || "Individual"}
                  onValueChange={(value) => setNewCustomer({ ...newCustomer, customerType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={newCustomer.licenseNumber}
                  onChange={(e) => setNewCustomer({ ...newCustomer, licenseNumber: e.target.value })}
                  placeholder="MH0120110012345"
                />
              </div>
              <div>
                <Label htmlFor="licenseExpiry">License Expiry</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={newCustomer.licenseExpiry}
                  onChange={(e) => setNewCustomer({ ...newCustomer, licenseExpiry: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="aadharNumber">Aadhar Number</Label>
                <Input
                  id="aadharNumber"
                  value={newCustomer.aadharNumber}
                  onChange={(e) => setNewCustomer({ ...newCustomer, aadharNumber: e.target.value })}
                  placeholder="1234 5678 9012"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={newCustomer.emergencyContact}
                  onChange={(e) => setNewCustomer({ ...newCustomer, emergencyContact: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={newCustomer.emergencyPhone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, emergencyPhone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  placeholder="Any additional notes"
                  rows={2}
                />
              </div>
              <div className="col-span-2">
                <Label>Customer Photo (Optional)</Label>
                <SelfieCapture
                  onPhotoCapture={(file) => {
                    console.log("Selfie captured:", file)
                    // Here you can handle the captured selfie file
                    // For example, upload it to storage or add it to the customer data
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer} disabled={!isFormValid(newCustomer)}>
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search customers by name, phone, ID, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No customers found" : "No customers yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Add your first customer to get started."}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Customer
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader onClick={() => setSelectedCustomer(customer)}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <CardDescription>{customer.customerId}</CardDescription>
                  </div>
                  <Badge className={getCustomerTypeColor(customer.customerType)}>{customer.customerType}</Badge>
                </div>
              </CardHeader>
              <CardContent onClick={() => setSelectedCustomer(customer)}>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">{customer.email}</span>
                    </div>
                  )}
                  {customer.city && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{customer.city}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span className="text-gray-600">Total Bookings:</span>
                    <span className="font-medium">{customer.totalBookings}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Spent:</span>
                    <span className="font-medium">₹{customer.totalSpent?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="text-xs text-gray-500">
                    Joined: {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Dialog
                      open={editingCustomer?.id === customer.id}
                      onOpenChange={(open) => !open && setEditingCustomer(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingCustomer(customer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Customer</DialogTitle>
                          <DialogDescription>Update customer information</DialogDescription>
                        </DialogHeader>
                        {editingCustomer && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-name">Full Name *</Label>
                              <Input
                                id="edit-name"
                                value={editingCustomer.name}
                                onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-phone">Phone Number *</Label>
                              <Input
                                id="edit-phone"
                                value={editingCustomer.phone}
                                onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-email">Email</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={editingCustomer.email}
                                onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-customerType">Customer Type</Label>
                              <Select
                                value={editingCustomer.customerType}
                                onValueChange={(value) =>
                                  setEditingCustomer({ ...editingCustomer, customerType: value as any })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Individual">Individual</SelectItem>
                                  <SelectItem value="Corporate">Corporate</SelectItem>
                                  <SelectItem value="VIP">VIP</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="edit-address">Address</Label>
                              <Textarea
                                id="edit-address"
                                value={editingCustomer.address}
                                onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-city">City</Label>
                              <Input
                                id="edit-city"
                                value={editingCustomer.city}
                                onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-state">State</Label>
                              <Input
                                id="edit-state"
                                value={editingCustomer.state}
                                onChange={(e) => setEditingCustomer({ ...editingCustomer, state: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end space-x-2 mt-6">
                          <Button variant="outline" onClick={() => setEditingCustomer(null)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleEditCustomer}
                            disabled={!editingCustomer || !isFormValid(editingCustomer)}
                          >
                            Update Customer
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCustomer(customer.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  )
}
