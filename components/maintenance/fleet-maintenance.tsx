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
import { Wrench, Plus, Calendar, CheckCircle, Clock } from "lucide-react"
import { mockDataService, type Car as CarType } from "@/lib/mock-data"

interface MaintenanceRecord {
  id: string
  carId: string
  carDetails: string
  type: "Routine" | "Repair" | "Emergency" | "Inspection"
  description: string
  cost: number
  serviceProvider: string
  scheduledDate: string
  completedDate?: string
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
  nextServiceDue?: string
  notes?: string
  createdAt: string
}

export default function FleetMaintenance() {
  const [cars, setCars] = useState<CarType[]>([])
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [isAddingRecord, setIsAddingRecord] = useState(false)
  const [selectedCar, setSelectedCar] = useState("")
  const [loading, setLoading] = useState(false)

  const [newRecord, setNewRecord] = useState({
    carId: "",
    type: "Routine" as const,
    description: "",
    cost: 0,
    serviceProvider: "",
    scheduledDate: "",
    notes: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const carsData = await mockDataService.getCars()
      setCars(carsData)

      // Mock maintenance records
      const mockRecords: MaintenanceRecord[] = [
        {
          id: "1",
          carId: "1",
          carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
          type: "Routine",
          description: "Regular service - Oil change, filter replacement",
          cost: 3500,
          serviceProvider: "Maruti Service Center",
          scheduledDate: "2024-12-15",
          completedDate: "2024-12-15",
          status: "Completed",
          nextServiceDue: "2025-03-15",
          notes: "All systems checked, good condition",
          createdAt: "2024-12-10",
        },
        {
          id: "2",
          carId: "2",
          carDetails: "Hyundai Creta 2023 (MH-04-CD-5678)",
          type: "Repair",
          description: "AC compressor replacement",
          cost: 12000,
          serviceProvider: "Hyundai Authorized Service",
          scheduledDate: "2024-12-20",
          status: "Scheduled",
          notes: "Customer complaint about AC not cooling",
          createdAt: "2024-12-12",
        },
        {
          id: "3",
          carId: "3",
          carDetails: "Tata Nexon 2021 (MH-04-EF-9012)",
          type: "Inspection",
          description: "Annual fitness certificate renewal",
          cost: 1500,
          serviceProvider: "RTO Authorized Center",
          scheduledDate: "2024-12-25",
          status: "Scheduled",
          createdAt: "2024-12-11",
        },
        {
          id: "4",
          carId: "4",
          carDetails: "Mahindra XUV300 2022 (MH-04-GH-3456)",
          type: "Emergency",
          description: "Brake pad replacement - urgent",
          cost: 4500,
          serviceProvider: "Mahindra Service Center",
          scheduledDate: "2024-12-18",
          status: "In Progress",
          notes: "Safety issue reported by driver",
          createdAt: "2024-12-17",
        },
      ]
      setMaintenanceRecords(mockRecords)
    } catch (error) {
      console.error("Error loading maintenance data:", error)
    }
  }

  const handleAddRecord = async () => {
    if (!newRecord.carId || !newRecord.description || !newRecord.scheduledDate) return

    setLoading(true)
    try {
      const car = cars.find((c) => c.id === newRecord.carId)
      const record: MaintenanceRecord = {
        id: Date.now().toString(),
        carId: newRecord.carId,
        carDetails: car ? `${car.make} ${car.model} ${car.year} (${car.plateNumber})` : "",
        type: newRecord.type,
        description: newRecord.description,
        cost: newRecord.cost,
        serviceProvider: newRecord.serviceProvider,
        scheduledDate: newRecord.scheduledDate,
        status: "Scheduled",
        notes: newRecord.notes,
        createdAt: new Date().toISOString().split("T")[0],
      }

      setMaintenanceRecords((prev) => [record, ...prev])
      setNewRecord({
        carId: "",
        type: "Routine",
        description: "",
        cost: 0,
        serviceProvider: "",
        scheduledDate: "",
        notes: "",
      })
      setIsAddingRecord(false)
    } catch (error) {
      console.error("Error adding maintenance record:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateRecordStatus = (recordId: string, status: MaintenanceRecord["status"]) => {
    setMaintenanceRecords((prev) =>
      prev.map((record) =>
        record.id === recordId
          ? {
              ...record,
              status,
              completedDate: status === "Completed" ? new Date().toISOString().split("T")[0] : undefined,
            }
          : record,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Routine":
        return "bg-blue-100 text-blue-800"
      case "Repair":
        return "bg-orange-100 text-orange-800"
      case "Emergency":
        return "bg-red-100 text-red-800"
      case "Inspection":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRecords = selectedCar
    ? maintenanceRecords.filter((record) => record.carId === selectedCar)
    : maintenanceRecords

  const stats = {
    total: maintenanceRecords.length,
    scheduled: maintenanceRecords.filter((r) => r.status === "Scheduled").length,
    inProgress: maintenanceRecords.filter((r) => r.status === "In Progress").length,
    completed: maintenanceRecords.filter((r) => r.status === "Completed").length,
    totalCost: maintenanceRecords.reduce((sum, r) => sum + r.cost, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fleet Maintenance</h2>
          <p className="text-gray-600">Track vehicle maintenance and service records</p>
        </div>
        <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Maintenance Record</DialogTitle>
              <DialogDescription>Schedule or record vehicle maintenance</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vehicle</Label>
                  <Select
                    value={newRecord.carId}
                    onValueChange={(value) => setNewRecord((prev) => ({ ...prev, carId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {cars.map((car) => (
                        <SelectItem key={car.id} value={car.id}>
                          {car.make} {car.model} ({car.plateNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={newRecord.type}
                    onValueChange={(value: any) => setNewRecord((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={newRecord.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Routine">Routine Service</SelectItem>
                      <SelectItem value="Repair">Repair</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the maintenance work"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cost (₹)</Label>
                  <Input
                    type="number"
                    value={newRecord.cost}
                    onChange={(e) => setNewRecord((prev) => ({ ...prev, cost: Number.parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Scheduled Date</Label>
                  <Input
                    type="date"
                    value={newRecord.scheduledDate}
                    onChange={(e) => setNewRecord((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Service Provider</Label>
                <Input
                  value={newRecord.serviceProvider}
                  onChange={(e) => setNewRecord((prev) => ({ ...prev, serviceProvider: e.target.value }))}
                  placeholder="Service center name"
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingRecord(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRecord} disabled={loading}>
                  {loading ? "Adding..." : "Add Record"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <span className="text-sm">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select value={selectedCar} onValueChange={setSelectedCar}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by vehicle (All vehicles)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Vehicles</SelectItem>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.make} {car.model} ({car.plateNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCar && (
              <Button variant="outline" onClick={() => setSelectedCar("")}>
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Records */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRecords.map((record) => (
          <Card key={record.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{record.carDetails}</CardTitle>
                  <CardDescription>{record.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getTypeColor(record.type)}>{record.type}</Badge>
                  <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Service Provider</span>
                  <p className="font-medium">{record.serviceProvider}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Scheduled Date</span>
                  <p className="font-medium">{new Date(record.scheduledDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Cost</span>
                  <p className="font-medium">₹{record.cost.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status</span>
                  <p className="font-medium">{record.status}</p>
                </div>
              </div>

              {record.completedDate && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Completed Date: </span>
                  <span className="font-medium">{new Date(record.completedDate).toLocaleDateString()}</span>
                </div>
              )}

              {record.nextServiceDue && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Next Service Due: </span>
                  <span className="font-medium">{new Date(record.nextServiceDue).toLocaleDateString()}</span>
                </div>
              )}

              {record.notes && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Notes:</span>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">{record.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-xs text-gray-500">
                  Created: {new Date(record.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  {record.status === "Scheduled" && (
                    <Button size="sm" onClick={() => updateRecordStatus(record.id, "In Progress")}>
                      Start Work
                    </Button>
                  )}
                  {record.status === "In Progress" && (
                    <Button size="sm" onClick={() => updateRecordStatus(record.id, "Completed")}>
                      Mark Complete
                    </Button>
                  )}
                  {record.status !== "Cancelled" && record.status !== "Completed" && (
                    <Button variant="outline" size="sm" onClick={() => updateRecordStatus(record.id, "Cancelled")}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance records found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCar ? "No records for the selected vehicle" : "Start by adding your first maintenance record"}
            </p>
            <Button onClick={() => setIsAddingRecord(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance Record
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
