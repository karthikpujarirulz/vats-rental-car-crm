"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Car, Edit, Trash2, Fuel } from "lucide-react"
import { mockDataService, type Car as CarType } from "@/lib/mock-data"

export default function CarInventory() {
  const [cars, setCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<CarType | null>(null)
  const [newCar, setNewCar] = useState<Partial<CarType>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    plateNumber: "",
    color: "",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 5,
    dailyRate: 0,
    status: "Available",
    mileage: 0,
    lastServiceDate: "",
    nextServiceDate: "",
    insuranceExpiry: "",
    pucExpiry: "",
    registrationExpiry: "",
  })

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
      setLoading(true)
      const carsData = await mockDataService.getCars()
      setCars(carsData)
    } catch (error) {
      console.error("Error loading cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCar = async () => {
    if (newCar.make && newCar.model && newCar.plateNumber) {
      try {
        const carData = {
          ...newCar,
          id: `car_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as CarType

        await mockDataService.addCar(carData)
        await loadCars()
        setNewCar({
          make: "",
          model: "",
          year: new Date().getFullYear(),
          plateNumber: "",
          color: "",
          fuelType: "Petrol",
          transmission: "Manual",
          seatingCapacity: 5,
          dailyRate: 0,
          status: "Available",
          mileage: 0,
          lastServiceDate: "",
          nextServiceDate: "",
          insuranceExpiry: "",
          pucExpiry: "",
          registrationExpiry: "",
        })
        setIsAddDialogOpen(false)
      } catch (error) {
        console.error("Error adding car:", error)
        alert("Error adding car. Please try again.")
      }
    }
  }

  const handleEditCar = async () => {
    if (editingCar && editingCar.make && editingCar.model && editingCar.plateNumber) {
      try {
        const updatedCar = {
          ...editingCar,
          updatedAt: new Date().toISOString(),
        }

        await mockDataService.updateCar(editingCar.id, updatedCar)
        await loadCars()
        setEditingCar(null)
      } catch (error) {
        console.error("Error updating car:", error)
        alert("Error updating car. Please try again.")
      }
    }
  }

  const handleDeleteCar = async (carId: string) => {
    if (confirm("Are you sure you want to delete this car?")) {
      try {
        await mockDataService.deleteCar(carId)
        await loadCars()
      } catch (error) {
        console.error("Error deleting car:", error)
        alert("Error deleting car. Please try again.")
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Rented":
        return "bg-blue-100 text-blue-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "Out of Service":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isFormValid = (car: Partial<CarType>) => {
    return car.make && car.model && car.plateNumber && car.dailyRate && car.dailyRate > 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading cars...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Car Inventory</h2>
          <p className="text-gray-600">Manage your fleet of rental vehicles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Car
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Car</DialogTitle>
              <DialogDescription>Add a new vehicle to your rental fleet</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={newCar.make}
                  onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                  placeholder="Toyota, Honda, etc."
                />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={newCar.model}
                  onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                  placeholder="Camry, Civic, etc."
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={newCar.year}
                  onChange={(e) => setNewCar({ ...newCar, year: Number.parseInt(e.target.value) })}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div>
                <Label htmlFor="plateNumber">Plate Number *</Label>
                <Input
                  id="plateNumber"
                  value={newCar.plateNumber}
                  onChange={(e) => setNewCar({ ...newCar, plateNumber: e.target.value.toUpperCase() })}
                  placeholder="MH01AB1234"
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={newCar.color}
                  onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
                  placeholder="White, Black, etc."
                />
              </div>
              <div>
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={newCar.fuelType || "Petrol"}
                  onValueChange={(value) => setNewCar({ ...newCar, fuelType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="CNG">CNG</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  value={newCar.transmission || "Manual"}
                  onValueChange={(value) => setNewCar({ ...newCar, transmission: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                <Select
                  value={newCar.seatingCapacity?.toString() || "5"}
                  onValueChange={(value) => setNewCar({ ...newCar, seatingCapacity: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Seater</SelectItem>
                    <SelectItem value="4">4 Seater</SelectItem>
                    <SelectItem value="5">5 Seater</SelectItem>
                    <SelectItem value="7">7 Seater</SelectItem>
                    <SelectItem value="8">8 Seater</SelectItem>
                    <SelectItem value="9">9 Seater</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dailyRate">Daily Rate (₹) *</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  value={newCar.dailyRate}
                  onChange={(e) => setNewCar({ ...newCar, dailyRate: Number.parseInt(e.target.value) })}
                  placeholder="2000"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newCar.status || "Available"}
                  onValueChange={(value) => setNewCar({ ...newCar, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Rented">Rented</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Out of Service">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mileage">Current Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={newCar.mileage}
                  onChange={(e) => setNewCar({ ...newCar, mileage: Number.parseInt(e.target.value) })}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="lastServiceDate">Last Service Date</Label>
                <Input
                  id="lastServiceDate"
                  type="date"
                  value={newCar.lastServiceDate}
                  onChange={(e) => setNewCar({ ...newCar, lastServiceDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="nextServiceDate">Next Service Date</Label>
                <Input
                  id="nextServiceDate"
                  type="date"
                  value={newCar.nextServiceDate}
                  onChange={(e) => setNewCar({ ...newCar, nextServiceDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  value={newCar.insuranceExpiry}
                  onChange={(e) => setNewCar({ ...newCar, insuranceExpiry: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pucExpiry">PUC Expiry</Label>
                <Input
                  id="pucExpiry"
                  type="date"
                  value={newCar.pucExpiry}
                  onChange={(e) => setNewCar({ ...newCar, pucExpiry: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="registrationExpiry">Registration Expiry</Label>
                <Input
                  id="registrationExpiry"
                  type="date"
                  value={newCar.registrationExpiry}
                  onChange={(e) => setNewCar({ ...newCar, registrationExpiry: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCar} disabled={!isFormValid(newCar)}>
                Add Car
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-600 mb-4">Add your first vehicle to start managing your fleet.</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Car
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {car.make} {car.model} {car.year}
                    </CardTitle>
                    <CardDescription>{car.plateNumber}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(car.status)}>{car.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Daily Rate:</span>
                    <span className="font-medium">₹{car.dailyRate?.toLocaleString()}/day</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fuel Type:</span>
                    <span className="flex items-center">
                      <Fuel className="h-3 w-3 mr-1" />
                      {car.fuelType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Transmission:</span>
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Seating:</span>
                    <span>{car.seatingCapacity} seats</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Mileage:</span>
                    <span>{car.mileage?.toLocaleString()} km</span>
                  </div>
                  {car.color && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Color:</span>
                      <span>{car.color}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="text-xs text-gray-500">Added: {new Date(car.createdAt).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <Dialog open={editingCar?.id === car.id} onOpenChange={(open) => !open && setEditingCar(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingCar(car)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Car</DialogTitle>
                          <DialogDescription>Update vehicle information</DialogDescription>
                        </DialogHeader>
                        {editingCar && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-make">Make *</Label>
                              <Input
                                id="edit-make"
                                value={editingCar.make}
                                onChange={(e) => setEditingCar({ ...editingCar, make: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-model">Model *</Label>
                              <Input
                                id="edit-model"
                                value={editingCar.model}
                                onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-year">Year</Label>
                              <Input
                                id="edit-year"
                                type="number"
                                value={editingCar.year}
                                onChange={(e) =>
                                  setEditingCar({ ...editingCar, year: Number.parseInt(e.target.value) })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-plateNumber">Plate Number *</Label>
                              <Input
                                id="edit-plateNumber"
                                value={editingCar.plateNumber}
                                onChange={(e) =>
                                  setEditingCar({ ...editingCar, plateNumber: e.target.value.toUpperCase() })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-color">Color</Label>
                              <Input
                                id="edit-color"
                                value={editingCar.color}
                                onChange={(e) => setEditingCar({ ...editingCar, color: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-fuelType">Fuel Type</Label>
                              <Select
                                value={editingCar.fuelType}
                                onValueChange={(value) => setEditingCar({ ...editingCar, fuelType: value as any })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Petrol">Petrol</SelectItem>
                                  <SelectItem value="Diesel">Diesel</SelectItem>
                                  <SelectItem value="CNG">CNG</SelectItem>
                                  <SelectItem value="Electric">Electric</SelectItem>
                                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-transmission">Transmission</Label>
                              <Select
                                value={editingCar.transmission}
                                onValueChange={(value) => setEditingCar({ ...editingCar, transmission: value as any })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Manual">Manual</SelectItem>
                                  <SelectItem value="Automatic">Automatic</SelectItem>
                                  <SelectItem value="CVT">CVT</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-seatingCapacity">Seating Capacity</Label>
                              <Select
                                value={editingCar.seatingCapacity?.toString()}
                                onValueChange={(value) =>
                                  setEditingCar({ ...editingCar, seatingCapacity: Number.parseInt(value) })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2">2 Seater</SelectItem>
                                  <SelectItem value="4">4 Seater</SelectItem>
                                  <SelectItem value="5">5 Seater</SelectItem>
                                  <SelectItem value="7">7 Seater</SelectItem>
                                  <SelectItem value="8">8 Seater</SelectItem>
                                  <SelectItem value="9">9 Seater</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-dailyRate">Daily Rate (₹) *</Label>
                              <Input
                                id="edit-dailyRate"
                                type="number"
                                value={editingCar.dailyRate}
                                onChange={(e) =>
                                  setEditingCar({ ...editingCar, dailyRate: Number.parseInt(e.target.value) })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-status">Status</Label>
                              <Select
                                value={editingCar.status}
                                onValueChange={(value) => setEditingCar({ ...editingCar, status: value as any })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Available">Available</SelectItem>
                                  <SelectItem value="Rented">Rented</SelectItem>
                                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                                  <SelectItem value="Out of Service">Out of Service</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-mileage">Current Mileage (km)</Label>
                              <Input
                                id="edit-mileage"
                                type="number"
                                value={editingCar.mileage}
                                onChange={(e) =>
                                  setEditingCar({ ...editingCar, mileage: Number.parseInt(e.target.value) })
                                }
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end space-x-2 mt-6">
                          <Button variant="outline" onClick={() => setEditingCar(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditCar} disabled={!editingCar || !isFormValid(editingCar)}>
                            Update Car
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCar(car.id)}>
                      <Trash2 className="h-4 w-4" />
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
