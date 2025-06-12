// Advanced Backup and Data Management Service
export interface BackupData {
  cars: any[]
  customers: any[]
  bookings: any[]
  maintenanceRecords: any[]
  communicationLogs: any[]
  timestamp: string
  version: string
}

export interface BackupMetadata {
  id: string
  filename: string
  size: number
  timestamp: string
  recordCount: {
    cars: number
    customers: number
    bookings: number
    maintenanceRecords: number
    communicationLogs: number
  }
}

class BackupService {
  private readonly BACKUP_VERSION = "1.0.0"

  async createBackup(): Promise<BackupData> {
    try {
      // In a real implementation, this would fetch from your actual data sources
      const [cars, customers, bookings] = await Promise.all([
        this.mockDataService.getCars(),
        this.mockDataService.getCustomers(),
        this.mockDataService.getBookings(),
      ])

      const backupData: BackupData = {
        cars,
        customers,
        bookings,
        maintenanceRecords: [], // Would fetch from maintenance service
        communicationLogs: [], // Would fetch from communication service
        timestamp: new Date().toISOString(),
        version: this.BACKUP_VERSION,
      }

      return backupData
    } catch (error) {
      console.error("Error creating backup:", error)
      throw new Error("Failed to create backup")
    }
  }

  async downloadBackup(): Promise<void> {
    try {
      const backupData = await this.createBackup()
      const jsonString = JSON.stringify(backupData, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `vats-rental-backup-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading backup:", error)
      throw new Error("Failed to download backup")
    }
  }

  async restoreFromBackup(file: File): Promise<{ success: boolean; message: string; data?: BackupData }> {
    try {
      const text = await file.text()
      const backupData: BackupData = JSON.parse(text)

      // Validate backup structure
      if (!this.validateBackupStructure(backupData)) {
        return {
          success: false,
          message: "Invalid backup file structure",
        }
      }

      // In a real implementation, you would restore data to your database
      console.log("Restoring backup data:", backupData)

      return {
        success: true,
        message: `Backup restored successfully. ${backupData.cars.length} cars, ${backupData.customers.length} customers, ${backupData.bookings.length} bookings restored.`,
        data: backupData,
      }
    } catch (error) {
      console.error("Error restoring backup:", error)
      return {
        success: false,
        message: "Failed to restore backup. Please check the file format.",
      }
    }
  }

  private validateBackupStructure(data: any): data is BackupData {
    return (
      data &&
      typeof data === "object" &&
      Array.isArray(data.cars) &&
      Array.isArray(data.customers) &&
      Array.isArray(data.bookings) &&
      typeof data.timestamp === "string" &&
      typeof data.version === "string"
    )
  }

  async exportToCSV(dataType: "cars" | "customers" | "bookings", data: any[]): Promise<void> {
    if (!data.length) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Escape commas and quotes in CSV
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vats-rental-${dataType}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  async importFromCSV(
    file: File,
    dataType: "cars" | "customers" | "bookings",
  ): Promise<{ success: boolean; message: string; data?: any[] }> {
    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length < 2) {
        return {
          success: false,
          message: "CSV file must contain at least a header row and one data row",
        }
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
      const data = lines.slice(1).map((line) => {
        const values = this.parseCSVLine(line)
        const obj: any = {}
        headers.forEach((header, index) => {
          obj[header] = values[index] || ""
        })
        return obj
      })

      return {
        success: true,
        message: `Successfully imported ${data.length} ${dataType} records`,
        data,
      }
    } catch (error) {
      console.error("Error importing CSV:", error)
      return {
        success: false,
        message: "Failed to import CSV file. Please check the file format.",
      }
    }
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  // Mock data service reference (in real implementation, this would be injected)
  private mockDataService = {
    getCars: async () => [],
    getCustomers: async () => [],
    getBookings: async () => [],
  }
}

export const backupService = new BackupService()
