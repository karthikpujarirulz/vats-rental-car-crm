"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Shield, AlertTriangle, CheckCircle, Clock, FileText, IndianRupee } from "lucide-react"

interface InsurancePolicy {
  id: string
  carId: string
  carDetails: string
  policyNumber: string
  provider: string
  type: "comprehensive" | "third-party" | "zero-dep"
  premium: number
  coverage: number
  startDate: string
  endDate: string
  status: "active" | "expired" | "cancelled"
  documents: string[]
  createdAt: string
}

interface InsuranceClaim {
  id: string
  policyId: string
  carId: string
  carDetails: string
  claimNumber: string
  incidentDate: string
  incidentType: "accident" | "theft" | "natural-disaster" | "vandalism" | "fire"
  description: string
  estimatedAmount: number
  claimedAmount: number
  approvedAmount?: number
  status: "filed" | "under-review" | "approved" | "rejected" | "settled"
  documents: string[]
  photos: string[]
  policeReport?: string
  surveyorReport?: string
  createdAt: string
  settledAt?: string
}

// Mock data service (replace with your actual data fetching logic)
const mockDataService = {
  getCars: async () => {
    // Simulate fetching car data from an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "1", make: "Maruti", model: "Swift", year: 2022, plateNumber: "MH-04-AB-1234" },
          { id: "2", make: "Hyundai", model: "Creta", year: 2023, plateNumber: "MH-04-CD-5678" },
          { id: "3", make: "Tata", model: "Nexon", year: 2024, plateNumber: "MH-04-EF-9012" },
        ])
      }, 500) // Simulate a 500ms delay
    })
  },
}

export default function InsuranceManager() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([])
  const [claims, setClaims] = useState<InsuranceClaim[]>([])
  const [cars, setCars] = useState<any[]>([])
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false)
  const [isAddClaimOpen, setIsAddClaimOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("policies")

  const [newPolicy, setNewPolicy] = useState<Partial<InsurancePolicy>>({
    type: "comprehensive",
    status: "active",
  })

  const [newClaim, setNewClaim] = useState<Partial<InsuranceClaim>>({
    incidentType: "accident",
    status: "filed",
    incidentDate: new Date().toISOString().split("T")[0],
  })

  // Mock data
  const mockPolicies: InsurancePolicy[] = [
    {
      id: "1",
      carId: "1",
      carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
      policyNumber: "HDFC-2024-001234",
      provider: "HDFC ERGO",
      type: "comprehensive",
      premium: 18500,
      coverage: 800000,
      startDate: "2024-01-15",
      endDate: "2025-01-14",
      status: "active",
      documents: ["policy.pdf", "receipt.pdf"],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      carId: "2",
      carDetails: "Hyundai Creta 2023 (MH-04-CD-5678)",
      policyNumber: "ICICI-2024-005678",
      provider: "ICICI Lombard",
      type: "zero-dep",
      premium: 25000,
      coverage: 1200000,
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      status: "active",
      documents: ["policy.pdf"],
      createdAt: "2024-03-01",
    },
  ]

  const mockClaims: InsuranceClaim[] = [
    {
      id: "1",
      policyId: "1",
      carId: "1",
      carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
      claimNumber: "CLM-2024-001",
      incidentDate: "2024-12-10",
      incidentType: "accident",
      description: "Front bumper damage due to collision with another vehicle",
      estimatedAmount: 15000,
      claimedAmount: 15000,
      approvedAmount: 12000,
      status: "approved",
      documents: ["claim-form.pdf", "estimate.pdf"],
      photos: ["damage1.jpg", "damage2.jpg"],
      policeReport: "FIR-2024-12345",
      surveyorReport: "SURV-2024-001",
      createdAt: "2024-12-10",
    },
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // In real app, load from API
    setPolicies(mockPolicies)
    setClaims(mockClaims)

    // Load cars from mock service
    try {
      const carsData = await mockDataService.getCars()
      setCars(carsData)
    } catch (error) {
      console.error("Error loading cars:", error)
    }
  }

  const handleAddPolicy = () => {
    if (newPolicy.carId && newPolicy.policyNumber && newPolicy.provider) {
      const car = cars.find((c) => c.id === newPolicy.carId)
      const policy: InsurancePolicy = {
        id: Date.now().toString(),
        carId: newPolicy.carId,
        carDetails: car ? `${car.make} ${car.model} ${car.year} (${car.plateNumber})` : "",
        policyNumber: newPolicy.policyNumber,
        provider: newPolicy.provider,
        type: newPolicy.type || "comprehensive",
        premium: newPolicy.premium || 0,
        coverage: newPolicy.coverage || 0,
        startDate: newPolicy.startDate || new Date().toISOString().split("T")[0],
        endDate: newPolicy.endDate || new Date().toISOString().split("T")[0],
        status: newPolicy.status || "active",
        documents: [],
        createdAt: new Date().toISOString(),
      }

      setPolicies((prev) => [policy, ...prev])
      setNewPolicy({ type: "comprehensive", status: "active" })
      setIsAddPolicyOpen(false)
    }
  }

  const handleAddClaim = () => {
    if (newClaim.policyId && newClaim.description && newClaim.estimatedAmount) {
      const policy = policies.find((p) => p.id === newClaim.policyId)
      const claim: InsuranceClaim = {
        id: Date.now().toString(),
        policyId: newClaim.policyId,
        carId: policy?.carId || "",
        carDetails: policy?.carDetails || "",
        claimNumber: `CLM-${Date.now()}`,
        incidentDate: newClaim.incidentDate || new Date().toISOString().split("T")[0],
        incidentType: newClaim.incidentType || "accident",
        description: newClaim.description,
        estimatedAmount: newClaim.estimatedAmount,
        claimedAmount: newClaim.claimedAmount || newClaim.estimatedAmount,
        status: newClaim.status || "filed",
        documents: [],
        photos: [],
        createdAt: new Date().toISOString(),
      }

      setClaims((prev) => [claim, ...prev])
      setNewClaim({
        incidentType: "accident",
        status: "filed",
        incidentDate: new Date().toISOString().split("T")[0],
      })
      setIsAddClaimOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
      case "settled":
        return "bg-green-100 text-green-800"
      case "under-review":
      case "filed":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "comprehensive":
        return "bg-blue-100 text-blue-800"
      case "zero-dep":
        return "bg-purple-100 text-purple-800"
      case "third-party":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const expiringPolicies = policies.filter((policy) => {
    const expiryDate = new Date(policy.endDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiryDate <= thirtyDaysFromNow && policy.status === "active"
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Insurance & Claims Management</h2>
          <p className="text-gray-600">Manage vehicle insurance policies and claims</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddPolicyOpen} onOpenChange={setIsAddPolicyOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Add Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Insurance Policy</DialogTitle>
                <DialogDescription>Register a new insurance policy for a vehicle</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Vehicle</Label>
                    <Select
                      value={newPolicy.carId || "none"}
                      onValueChange={(value) => value !== "none" && setNewPolicy({ ...newPolicy, carId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled>
                          Select vehicle
                        </SelectItem>
                        {cars.map((car) => (
                          <SelectItem key={car.id} value={car.id}>
                            {car.make} {car.model} ({car.plateNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Policy Type</Label>
                    <Select
                      value={newPolicy.type}
                      onValueChange={(value: any) => setNewPolicy({ ...newPolicy, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                        <SelectItem value="third-party">Third Party</SelectItem>
                        <SelectItem value="zero-dep">Zero Depreciation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Policy Number</Label>
                    <Input
                      value={newPolicy.policyNumber}
                      onChange={(e) => setNewPolicy({ ...newPolicy, policyNumber: e.target.value })}
                      placeholder="Policy number"
                    />
                  </div>
                  <div>
                    <Label>Insurance Provider</Label>
                    <Input
                      value={newPolicy.provider}
                      onChange={(e) => setNewPolicy({ ...newPolicy, provider: e.target.value })}
                      placeholder="Insurance company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Premium Amount (₹)</Label>
                    <Input
                      type="number"
                      value={newPolicy.premium}
                      onChange={(e) => setNewPolicy({ ...newPolicy, premium: Number.parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Coverage Amount (₹)</Label>
                    <Input
                      type="number"
                      value={newPolicy.coverage}
                      onChange={(e) => setNewPolicy({ ...newPolicy, coverage: Number.parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={newPolicy.startDate}
                      onChange={(e) => setNewPolicy({ ...newPolicy, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={newPolicy.endDate}
                      onChange={(e) => setNewPolicy({ ...newPolicy, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddPolicyOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPolicy}>Add Policy</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddClaimOpen} onOpenChange={setIsAddClaimOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                File Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>File Insurance Claim</DialogTitle>
                <DialogDescription>Submit a new insurance claim</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Insurance Policy</Label>
                    <Select
                      value={newClaim.policyId || "none"}
                      onValueChange={(value) => value !== "none" && setNewClaim({ ...newClaim, policyId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled>
                          Select policy
                        </SelectItem>
                        {policies
                          .filter((p) => p.status === "active")
                          .map((policy) => (
                            <SelectItem key={policy.id} value={policy.id}>
                              {policy.carDetails} - {policy.policyNumber}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Incident Type</Label>
                    <Select
                      value={newClaim.incidentType}
                      onValueChange={(value: any) => setNewClaim({ ...newClaim, incidentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accident">Accident</SelectItem>
                        <SelectItem value="theft">Theft</SelectItem>
                        <SelectItem value="natural-disaster">Natural Disaster</SelectItem>
                        <SelectItem value="vandalism">Vandalism</SelectItem>
                        <SelectItem value="fire">Fire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Incident Date</Label>
                  <Input
                    type="date"
                    value={newClaim.incidentDate}
                    onChange={(e) => setNewClaim({ ...newClaim, incidentDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newClaim.description}
                    onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
                    placeholder="Describe the incident in detail"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Estimated Amount (₹)</Label>
                    <Input
                      type="number"
                      value={newClaim.estimatedAmount}
                      onChange={(e) =>
                        setNewClaim({ ...newClaim, estimatedAmount: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Claimed Amount (₹)</Label>
                    <Input
                      type="number"
                      value={newClaim.claimedAmount}
                      onChange={(e) =>
                        setNewClaim({ ...newClaim, claimedAmount: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddClaimOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddClaim}>File Claim</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alerts */}
      {expiringPolicies.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Policy Expiry Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringPolicies.map((policy) => (
                <div key={policy.id} className="flex justify-between items-center">
                  <span className="text-sm">
                    {policy.carDetails} - {policy.policyNumber}
                  </span>
                  <Badge variant="outline" className="text-orange-600">
                    Expires {new Date(policy.endDate).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {policies.filter((p) => p.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <IndianRupee className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{policies.reduce((sum, p) => sum + p.coverage, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total insured value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {claims.filter((c) => ["filed", "under-review"].includes(c.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Settled</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {claims.filter((c) => c.status === "settled").length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={selectedTab === "policies" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("policies")}
        >
          Policies
        </Button>
        <Button
          variant={selectedTab === "claims" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("claims")}
        >
          Claims
        </Button>
      </div>

      {/* Policies Table */}
      {selectedTab === "policies" && (
        <Card>
          <CardHeader>
            <CardTitle>Insurance Policies</CardTitle>
            <CardDescription>All vehicle insurance policies</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Policy Number</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.carDetails.split(" (")[0]}</TableCell>
                    <TableCell>{policy.policyNumber}</TableCell>
                    <TableCell>{policy.provider}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(policy.type)}>{policy.type}</Badge>
                    </TableCell>
                    <TableCell>₹{policy.premium.toLocaleString()}</TableCell>
                    <TableCell>₹{policy.coverage.toLocaleString()}</TableCell>
                    <TableCell>{new Date(policy.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(policy.status)}>{policy.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Claims Table */}
      {selectedTab === "claims" && (
        <Card>
          <CardHeader>
            <CardTitle>Insurance Claims</CardTitle>
            <CardDescription>All filed insurance claims</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim Number</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Incident Type</TableHead>
                  <TableHead>Incident Date</TableHead>
                  <TableHead>Claimed Amount</TableHead>
                  <TableHead>Approved Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.claimNumber}</TableCell>
                    <TableCell>{claim.carDetails.split(" (")[0]}</TableCell>
                    <TableCell className="capitalize">{claim.incidentType.replace("-", " ")}</TableCell>
                    <TableCell>{new Date(claim.incidentDate).toLocaleDateString()}</TableCell>
                    <TableCell>₹{claim.claimedAmount.toLocaleString()}</TableCell>
                    <TableCell>{claim.approvedAmount ? `₹${claim.approvedAmount.toLocaleString()}` : "-"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
