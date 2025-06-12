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
import { Plus, Edit, Trash2, Upload, Car, Loader2 } from "lucide-react"
import { mockDataService, type Car as CarData } from "@/lib/mock-data"

export default function CarInventory() {
  const [cars, setCars] = useState<CarData[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCar, setNewCar] = useState<Partial<CarData>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    fuelType: "",
    transmission: "",
    plateNumber: "",
    status: "Available",
  })

  const carMakes = ["Maruti", "Hyundai", "Tata", "Mahindra", "Honda", "Toyota", "Kia", "MG", "Renault", "Nissan"]
  const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"]
  const transmissionTypes = ["Manual", "Automatic", "CVT"]

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
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
        const car = await mockDataService.addCar({
          make: newCar.make,
          model: newCar.model,
          year: newCar.year || new Date().getFullYear(),
          fuelType: newCar.fuelType || "Petrol",
          transmission: newCar.transmission || "Manual",
          plateNumber: newCar.plateNumber,
          status: (newCar.status as CarData["status"]) || "Available",
        })

        setCars((prev) => [car, ...prev])
        setNewCar({
          make: "",
          model: "",
          year: new Date().getFullYear(),
          fuelType: "",
          transmission: "",
          plateNumber: "",
          status: "Available",
        })
        setIsAddDialogOpen(false)
      } catch (error) {
        console.error("Error adding car:", error)
      }
    }
  }

  const handleDeleteCar = async (id: string) => {
    if (confirm("Are you sure you want to delete this car?")) {
      try {
        await mockDataService.deleteCar(id)
        setCars((prev) => prev.filter((car) => car.id !== id))
      } catch (error) {
        console.error("Error deleting car:", error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Rented":
        return "bg-blue-100 text-blue-800"
      case "Under Maintenance":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Car Inventory</h2>
          <p className="text-gray-600">Manage your fleet of rental cars</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Car
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Car</DialogTitle>
              <DialogDescription>Add a new car to your rental inventory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Car Make</Label>
                  <Select value={newCar.make} onValueChange={(value) => setNewCar({ ...newCar, make: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      {carMakes.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    placeholder="e.g., Swift"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="2005"
                    max="2025"
                    value={newCar.year}
                    onChange={(e) => setNewCar({ ...newCar, year: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="fuel">Fuel Type</Label>
                  <Select value={newCar.fuelType} onValueChange={(value) => setNewCar({ ...newCar, fuelType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {fuel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  value={newCar.transmission}
                  onValueChange={(value) => setNewCar({ ...newCar, transmission: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissionTypes.map((trans) => (
                      <SelectItem key={trans} value={trans}>
                        {trans}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="plate">Plate Number</Label>
                <Input
                  id="plate"
                  value={newCar.plateNumber}
                  onChange={(e) => setNewCar({ ...newCar, plateNumber: e.target.value.toUpperCase() })}
                  placeholder="MH-04-AB-1234"
                />
              </div>

              <div>
                <Label htmlFor="photo">Car Photo</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <span className="text-sm text-gray-500">Coming soon</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCar}>Add Car</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Card key={car.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {car.make} {car.model}
                  </CardTitle>
                  <CardDescription>
                    {car.year} • {car.plateNumber}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(car.status)}>{car.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fuel:</span>
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transmission:</span>
                  <span>{car.transmission}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex items-center text-gray-400">
                  <Car className="h-4 w-4 mr-1" />
                  <span className="text-xs">No photo</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteCar(car.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
