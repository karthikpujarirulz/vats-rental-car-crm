"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, CheckCircle, ClipboardCheck } from "lucide-react"
import type { Booking, Car } from "@/lib/mock-data"

interface VehicleReturnChecklistProps {
  booking: Booking
  car?: Car | null
  onComplete: () => void
}

export default function VehicleReturnChecklist({ booking, car, onComplete }: VehicleReturnChecklistProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [checklist, setChecklist] = useState({
    exteriorCondition: false,
    interiorCondition: false,
    fuelLevel: false,
    mileageVerified: false,
    documentsReturned: false,
    personalItemsRemoved: false,
    damageInspection: false,
    cleanlinessCheck: false,
  })
  const [notes, setNotes] = useState("")
  const [fuelLevel, setFuelLevel] = useState("full")

  // Handle case where car data is missing
  if (!car) {
    return (
      <Button variant="outline" size="sm" disabled>
        <AlertTriangle className="h-4 w-4 mr-1" />
        Car Data Missing
      </Button>
    )
  }

  const plateNumber = car.plateNumber || "Unknown"
  const carDetails = `${car.make || "Unknown"} ${car.model || "Unknown"} (${plateNumber})`

  const allChecked = Object.values(checklist).every(Boolean)

  const handleComplete = () => {
    setIsOpen(false)
    onComplete()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <ClipboardCheck className="h-4 w-4 mr-1" />
          Return Checklist
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vehicle Return Checklist</DialogTitle>
          <DialogDescription>
            Complete all checks before processing deposit refund for {booking.bookingId || "Unknown Booking"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
            <p className="font-medium">{carDetails}</p>
            <p>
              {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : "Unknown"} -{" "}
              {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "Unknown"}
            </p>
            <p>Duration: {booking.duration} days</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="exteriorCondition"
                checked={checklist.exteriorCondition}
                onCheckedChange={(checked) => setChecklist({ ...checklist, exteriorCondition: !!checked })}
              />
              <Label htmlFor="exteriorCondition">Exterior condition checked</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="interiorCondition"
                checked={checklist.interiorCondition}
                onCheckedChange={(checked) => setChecklist({ ...checklist, interiorCondition: !!checked })}
              />
              <Label htmlFor="interiorCondition">Interior condition checked</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="fuelLevel"
                checked={checklist.fuelLevel}
                onCheckedChange={(checked) => setChecklist({ ...checklist, fuelLevel: !!checked })}
              />
              <Label htmlFor="fuelLevel">Fuel level verified</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mileageVerified"
                checked={checklist.mileageVerified}
                onCheckedChange={(checked) => setChecklist({ ...checklist, mileageVerified: !!checked })}
              />
              <Label htmlFor="mileageVerified">Mileage verified</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="documentsReturned"
                checked={checklist.documentsReturned}
                onCheckedChange={(checked) => setChecklist({ ...checklist, documentsReturned: !!checked })}
              />
              <Label htmlFor="documentsReturned">All documents returned</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="personalItemsRemoved"
                checked={checklist.personalItemsRemoved}
                onCheckedChange={(checked) => setChecklist({ ...checklist, personalItemsRemoved: !!checked })}
              />
              <Label htmlFor="personalItemsRemoved">Personal items removed</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="damageInspection"
                checked={checklist.damageInspection}
                onCheckedChange={(checked) => setChecklist({ ...checklist, damageInspection: !!checked })}
              />
              <Label htmlFor="damageInspection">Damage inspection completed</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="cleanlinessCheck"
                checked={checklist.cleanlinessCheck}
                onCheckedChange={(checked) => setChecklist({ ...checklist, cleanlinessCheck: !!checked })}
              />
              <Label htmlFor="cleanlinessCheck">Cleanliness verified</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelLevel">Fuel Level at Return</Label>
            <Select value={fuelLevel} onValueChange={setFuelLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Tank</SelectItem>
                <SelectItem value="three-quarters">3/4 Tank</SelectItem>
                <SelectItem value="half">1/2 Tank</SelectItem>
                <SelectItem value="quarter">1/4 Tank</SelectItem>
                <SelectItem value="empty">Nearly Empty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any damages, issues, or comments"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={!allChecked}>
            {allChecked ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete Return
              </>
            ) : (
              "Complete All Checks"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
