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
import { Plus, TrendingUp, TrendingDown, Car, Wrench, Receipt, DollarSign, FileText, Download } from "lucide-react"

interface DailyTransaction {
  id: string
  date: string
  type: "income" | "expense"
  category: "rental" | "repair" | "maintenance" | "fuel" | "insurance" | "other"
  description: string
  amount: number
  bookingId?: string
  carId?: string
  paymentMode: string
  createdAt: string
}

interface DailySummary {
  date: string
  totalIncome: number
  totalExpenses: number
  profit: number
  rentalIncome: number
  repairExpenses: number
  maintenanceExpenses: number
  otherExpenses: number
  transactionCount: number
}

export default function DailySalesTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [transactions, setTransactions] = useState<DailyTransaction[]>([])
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [newTransaction, setNewTransaction] = useState<Partial<DailyTransaction>>({
    type: "expense",
    category: "other",
    description: "",
    amount: 0,
    paymentMode: "Cash",
  })

  // Mock transactions data
  const [allTransactions, setAllTransactions] = useState<DailyTransaction[]>([
    {
      id: "1",
      date: new Date().toISOString().split("T")[0],
      type: "income",
      category: "rental",
      description: "Rental payment - Rajesh Kumar (Swift)",
      amount: 15000,
      bookingId: "VAT-20241212-001",
      carId: "1",
      paymentMode: "Cash",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
      category: "fuel",
      description: "Fuel for Swift (MH-04-AB-1234)",
      amount: 2000,
      carId: "1",
      paymentMode: "Cash",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
      category: "maintenance",
      description: "Oil change - Creta",
      amount: 3500,
      carId: "2",
      paymentMode: "UPI",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      date: new Date().toISOString().split("T")[0],
      type: "income",
      category: "rental",
      description: "Advance payment - Priya Sharma (Creta)",
      amount: 8000,
      bookingId: "VAT-20241210-002",
      carId: "2",
      paymentMode: "UPI",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
      category: "repair",
      description: "Brake pad replacement - Nexon",
      amount: 4500,
      carId: "3",
      paymentMode: "Card",
      createdAt: new Date().toISOString(),
    },
  ])

  useEffect(() => {
    loadDailyData()
  }, [selectedDate])

  const loadDailyData = () => {
    // Filter transactions for selected date
    const dayTransactions = allTransactions.filter((t) => t.date === selectedDate)
    setTransactions(dayTransactions)

    // Calculate daily summary
    const summary = calculateDailySummary(dayTransactions)
    setDailySummary(summary)
  }

  const calculateDailySummary = (dayTransactions: DailyTransaction[]): DailySummary => {
    const income = dayTransactions.filter((t) => t.type === "income")
    const expenses = dayTransactions.filter((t) => t.type === "expense")

    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
    const profit = totalIncome - totalExpenses

    const rentalIncome = income.filter((t) => t.category === "rental").reduce((sum, t) => sum + t.amount, 0)
    const repairExpenses = expenses.filter((t) => t.category === "repair").reduce((sum, t) => sum + t.amount, 0)
    const maintenanceExpenses = expenses
      .filter((t) => t.category === "maintenance")
      .reduce((sum, t) => sum + t.amount, 0)
    const otherExpenses = expenses
      .filter((t) => !["repair", "maintenance"].includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      date: selectedDate,
      totalIncome,
      totalExpenses,
      profit,
      rentalIncome,
      repairExpenses,
      maintenanceExpenses,
      otherExpenses,
      transactionCount: dayTransactions.length,
    }
  }

  const handleAddTransaction = () => {
    if (newTransaction.description && newTransaction.amount && newTransaction.amount > 0) {
      const transaction: DailyTransaction = {
        id: Date.now().toString(),
        date: selectedDate,
        type: newTransaction.type || "expense",
        category: newTransaction.category || "other",
        description: newTransaction.description,
        amount: newTransaction.amount,
        paymentMode: newTransaction.paymentMode || "Cash",
        createdAt: new Date().toISOString(),
      }

      setAllTransactions((prev) => [...prev, transaction])
      setNewTransaction({
        type: "expense",
        category: "other",
        description: "",
        amount: 0,
        paymentMode: "Cash",
      })
      setIsAddTransactionOpen(false)
    }
  }

  const getTransactionIcon = (category: string) => {
    switch (category) {
      case "rental":
        return <Car className="h-4 w-4" />
      case "repair":
        return <Wrench className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      default:
        return <Receipt className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    return type === "income" ? "text-green-600" : "text-red-600"
  }

  const exportDailyReport = () => {
    if (!dailySummary) return

    const reportData = {
      date: selectedDate,
      summary: dailySummary,
      transactions: transactions,
    }

    const csvContent = [
      ["Daily Financial Report - " + selectedDate],
      [""],
      ["Summary"],
      ["Total Income", `₹${dailySummary.totalIncome.toLocaleString()}`],
      ["Total Expenses", `₹${dailySummary.totalExpenses.toLocaleString()}`],
      ["Net Profit", `₹${dailySummary.profit.toLocaleString()}`],
      [""],
      ["Transactions"],
      ["Type", "Category", "Description", "Amount", "Payment Mode"],
      ...transactions.map((t) => [t.type, t.category, t.description, `₹${t.amount.toLocaleString()}`, t.paymentMode]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `daily-report-${selectedDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!dailySummary) {
    return <div className="flex items-center justify-center py-8">Loading financial data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Daily Sales & Financial Tracker</h2>
          <p className="text-gray-600">Track daily income, expenses, and profit</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Button variant="outline" onClick={exportDailyReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>Record a new income or expense transaction</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Transaction Type</Label>
                    <Select
                      value={newTransaction.type || "expense"}
                      onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={newTransaction.type || "expense"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newTransaction.category || "other"}
                      onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={newTransaction.category || "other"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rental">Rental</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="fuel">Fuel</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    placeholder="Enter transaction description"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, amount: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Payment Mode</Label>
                    <Select
                      value={newTransaction.paymentMode || "Cash"}
                      onValueChange={(value) => setNewTransaction({ ...newTransaction, paymentMode: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={newTransaction.paymentMode || "Cash"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddTransactionOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTransaction}>Add Transaction</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{dailySummary.totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Rental: ₹{dailySummary.rentalIncome.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{dailySummary.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Repair: ₹{dailySummary.repairExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className={`h-4 w-4 ${dailySummary.profit >= 0 ? "text-green-600" : "text-red-600"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${dailySummary.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₹{dailySummary.profit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {dailySummary.profit >= 0 ? "Profitable day" : "Loss incurred"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dailySummary.transactionCount}</div>
            <p className="text-xs text-muted-foreground">Total transactions today</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Repair Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{dailySummary.repairExpenses.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Vehicle repair costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ₹{dailySummary.maintenanceExpenses.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Regular maintenance costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Other Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">₹{dailySummary.otherExpenses.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Fuel, insurance, misc.</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Transactions</CardTitle>
          <CardDescription>All transactions for {new Date(selectedDate).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions recorded for this date</p>
              <Button className="mt-4" onClick={() => setIsAddTransactionOpen(true)}>
                Add First Transaction
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(transaction.category)}
                        <Badge
                          variant={transaction.type === "income" ? "default" : "secondary"}
                          className={
                            transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{transaction.category}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.paymentMode}</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleTimeString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
