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
import { Plus, TrendingUp, TrendingDown, Car, FileText, IndianRupee, Calendar, Filter } from "lucide-react"
import { mockDataService } from "@/lib/mock-data"

interface CarExpense {
  id: string
  carId: string
  carDetails: string
  type: "repair" | "accident" | "maintenance" | "fuel" | "insurance" | "fine" | "other"
  category: "emergency" | "routine" | "preventive" | "legal"
  description: string
  amount: number
  date: string
  serviceProvider?: string
  billNumber?: string
  warrantyPeriod?: number
  isInsuranceClaim?: boolean
  claimAmount?: number
  photos?: string[]
  status: "pending" | "approved" | "paid" | "claimed"
  createdAt: string
  approvedBy?: string
  notes?: string
}

interface FinancialSummary {
  totalExpenses: number
  totalIncome: number
  netProfit: number
  expensesByType: Record<string, number>
  expensesByCategory: Record<string, number>
  monthlyTrend: Array<{ month: string; expenses: number; income: number; profit: number }>
  carWiseExpenses: Array<{ carId: string; carDetails: string; totalExpenses: number }>
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<CarExpense[]>([])
  const [cars, setCars] = useState<any[]>([])
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [dateRange, setDateRange] = useState("month")
  const [loading, setLoading] = useState(false)

  const [newExpense, setNewExpense] = useState<Partial<CarExpense>>({
    type: "repair",
    category: "routine",
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    status: "pending",
    isInsuranceClaim: false,
  })

  // Mock expenses data
  const [allExpenses, setAllExpenses] = useState<CarExpense[]>([
    {
      id: "1",
      carId: "1",
      carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
      type: "accident",
      category: "emergency",
      description: "Front bumper damage - customer accident",
      amount: 15000,
      date: "2024-12-10",
      serviceProvider: "Maruti Authorized Service",
      billNumber: "INV-2024-001",
      isInsuranceClaim: true,
      claimAmount: 12000,
      status: "claimed",
      createdAt: "2024-12-10",
      notes: "Insurance claim approved, customer liable for ₹3000",
    },
    {
      id: "2",
      carId: "2",
      carDetails: "Hyundai Creta 2023 (MH-04-CD-5678)",
      type: "repair",
      category: "routine",
      description: "AC compressor replacement",
      amount: 8500,
      date: "2024-12-08",
      serviceProvider: "Hyundai Service Center",
      billNumber: "HSC-2024-045",
      warrantyPeriod: 12,
      status: "paid",
      createdAt: "2024-12-08",
    },
    {
      id: "3",
      carId: "3",
      carDetails: "Tata Nexon 2021 (MH-04-EF-9012)",
      type: "fine",
      category: "legal",
      description: "Traffic challan - overspeeding",
      amount: 2000,
      date: "2024-12-05",
      status: "paid",
      createdAt: "2024-12-05",
      notes: "Customer responsible, amount recovered",
    },
    {
      id: "4",
      carId: "4",
      carDetails: "Mahindra XUV300 2022 (MH-04-GH-3456)",
      type: "maintenance",
      category: "preventive",
      description: "Regular service - 10,000 km",
      amount: 4500,
      date: "2024-12-03",
      serviceProvider: "Mahindra Service",
      warrantyPeriod: 6,
      status: "paid",
      createdAt: "2024-12-03",
    },
    {
      id: "5",
      carId: "1",
      carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
      type: "fuel",
      category: "routine",
      description: "Fuel refill - monthly",
      amount: 3000,
      date: "2024-12-01",
      status: "paid",
      createdAt: "2024-12-01",
    },
  ])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    calculateFinancialSummary()
  }, [allExpenses, dateRange])

  const loadData = async () => {
    try {
      const carsData = await mockDataService.getCars()
      setCars(carsData)
      setExpenses(allExpenses)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const calculateFinancialSummary = () => {
    // Filter expenses based on date range
    let filteredExpenses = [...allExpenses]

    if (dateRange === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      filteredExpenses = filteredExpenses.filter((e) => new Date(e.date) >= monthAgo)
    }

    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

    // Mock income data (would come from bookings)
    const totalIncome = 150000 // This would be calculated from actual bookings
    const netProfit = totalIncome - totalExpenses

    const expensesByType = filteredExpenses.reduce(
      (acc, exp) => {
        acc[exp.type] = (acc[exp.type] || 0) + exp.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const expensesByCategory = filteredExpenses.reduce(
      (acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount
        return acc
      },
      {} as Record<string, number>,
    )

    // Car-wise expenses
    const carWiseExpenses = filteredExpenses.reduce(
      (acc, exp) => {
        const existing = acc.find((item) => item.carId === exp.carId)
        if (existing) {
          existing.totalExpenses += exp.amount
        } else {
          acc.push({
            carId: exp.carId,
            carDetails: exp.carDetails,
            totalExpenses: exp.amount,
          })
        }
        return acc
      },
      [] as Array<{ carId: string; carDetails: string; totalExpenses: number }>,
    )

    // Monthly trend (mock data)
    const monthlyTrend = [
      { month: "Oct", expenses: 25000, income: 120000, profit: 95000 },
      { month: "Nov", expenses: 32000, income: 140000, profit: 108000 },
      { month: "Dec", expenses: totalExpenses, income: totalIncome, profit: netProfit },
    ]

    setFinancialSummary({
      totalExpenses,
      totalIncome,
      netProfit,
      expensesByType,
      expensesByCategory,
      monthlyTrend,
      carWiseExpenses,
    })
  }

  const handleAddExpense = () => {
    if (newExpense.carId && newExpense.description && newExpense.amount && newExpense.amount > 0) {
      const car = cars.find((c) => c.id === newExpense.carId)
      const expense: CarExpense = {
        id: Date.now().toString(),
        carId: newExpense.carId,
        carDetails: car ? `${car.make} ${car.model} ${car.year} (${car.plateNumber})` : "",
        type: newExpense.type || "repair",
        category: newExpense.category || "routine",
        description: newExpense.description,
        amount: newExpense.amount,
        date: newExpense.date || new Date().toISOString().split("T")[0],
        serviceProvider: newExpense.serviceProvider,
        billNumber: newExpense.billNumber,
        warrantyPeriod: newExpense.warrantyPeriod,
        isInsuranceClaim: newExpense.isInsuranceClaim || false,
        claimAmount: newExpense.claimAmount,
        status: newExpense.status || "pending",
        createdAt: new Date().toISOString(),
        notes: newExpense.notes,
      }

      setAllExpenses((prev) => [expense, ...prev])
      setNewExpense({
        type: "repair",
        category: "routine",
        description: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        isInsuranceClaim: false,
      })
      setIsAddExpenseOpen(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "accident":
        return "bg-red-100 text-red-800"
      case "repair":
        return "bg-orange-100 text-orange-800"
      case "maintenance":
        return "bg-blue-100 text-blue-800"
      case "fuel":
        return "bg-green-100 text-green-800"
      case "insurance":
        return "bg-purple-100 text-purple-800"
      case "fine":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "claimed":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredExpenses = allExpenses.filter((expense) => {
    if (selectedCar !== "all" && expense.carId !== selectedCar) return false
    if (selectedType !== "all" && expense.type !== selectedType) return false
    return true
  })

  if (!financialSummary) {
    return <div className="flex items-center justify-center py-8">Loading financial data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Expense Tracker & Financial Management</h2>
          <p className="text-gray-600">Track car expenses, repairs, accidents and manage P&L</p>
        </div>
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Car Expense</DialogTitle>
              <DialogDescription>Record repair, accident, maintenance or other car expenses</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vehicle</Label>
                  <Select
                    value={newExpense.carId || "none"}
                    onValueChange={(value) => value !== "none" && setNewExpense({ ...newExpense, carId: value })}
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
                  <Label>Expense Type</Label>
                  <Select
                    value={newExpense.type}
                    onValueChange={(value: any) => setNewExpense({ ...newExpense, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accident">Accident</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="fuel">Fuel</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="fine">Fine/Challan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(value: any) => setNewExpense({ ...newExpense, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="preventive">Preventive</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="Describe the expense details"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Service Provider</Label>
                  <Input
                    value={newExpense.serviceProvider}
                    onChange={(e) => setNewExpense({ ...newExpense, serviceProvider: e.target.value })}
                    placeholder="Service center/vendor name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bill Number</Label>
                  <Input
                    value={newExpense.billNumber}
                    onChange={(e) => setNewExpense({ ...newExpense, billNumber: e.target.value })}
                    placeholder="Invoice/bill number"
                  />
                </div>
                <div>
                  <Label>Warranty (months)</Label>
                  <Input
                    type="number"
                    value={newExpense.warrantyPeriod}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, warrantyPeriod: Number.parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={newExpense.isInsuranceClaim}
                    onChange={(e) => setNewExpense({ ...newExpense, isInsuranceClaim: e.target.checked })}
                  />
                  <Label htmlFor="insurance">Insurance Claim</Label>
                </div>
                {newExpense.isInsuranceClaim && (
                  <div>
                    <Label>Claim Amount (₹)</Label>
                    <Input
                      type="number"
                      value={newExpense.claimAmount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, claimAmount: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{financialSummary.totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From rentals & services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{financialSummary.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All car expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <IndianRupee className={`h-4 w-4 ${financialSummary.netProfit >= 0 ? "text-green-600" : "text-red-600"}`} />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${financialSummary.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ₹{financialSummary.netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{financialSummary.netProfit >= 0 ? "Profitable" : "Loss"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {((financialSummary.netProfit / financialSummary.totalIncome) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Profit percentage</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(financialSummary.expensesByType).map(([type, amount]) => (
                <div key={type} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(type)}>{type}</Badge>
                  </div>
                  <span className="font-medium">₹{amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Car-wise Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {financialSummary.carWiseExpenses.slice(0, 5).map((car) => (
                <div key={car.carId} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{car.carDetails.split(" (")[0]}</span>
                  </div>
                  <span className="font-medium">₹{car.totalExpenses.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Expenses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Filter by Car</Label>
              <Select value={selectedCar} onValueChange={setSelectedCar}>
                <SelectTrigger>
                  <SelectValue placeholder="All vehicles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.make} {car.model} ({car.plateNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Filter by Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="accident">Accident</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="fuel">Fuel</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="fine">Fine/Challan</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
          <CardDescription>Detailed list of all car expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{expense.carDetails.split(" (")[0]}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(expense.type)}>{expense.type}</Badge>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="font-medium">₹{expense.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
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
    </div>
  )
}
