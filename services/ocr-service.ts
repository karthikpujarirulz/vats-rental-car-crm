// OCR Service for document scanning and data extraction
export interface AadharData {
  name: string
  aadharNumber: string
  dateOfBirth: string
  address: string
  gender: string
}

export interface DLData {
  name: string
  licenseNumber: string
  dateOfBirth: string
  address: string
  validUpto: string
  vehicleClass: string
}

export interface OCRResult {
  success: boolean
  data: AadharData | DLData | null
  confidence: number
  error?: string
}

class OCRService {
  // Mock OCR implementation - in production, this would integrate with services like:
  // - Google Cloud Vision API
  // - AWS Textract
  // - Azure Computer Vision
  // - Tesseract.js for client-side OCR

  async extractAadharData(imageFile: File): Promise<OCRResult> {
    // Simulate processing time
    await this.simulateProcessing()

    try {
      // Mock extraction based on common Aadhar patterns
      const mockAadharData: AadharData = {
        name: "RAJESH KUMAR SHARMA",
        aadharNumber: "1234 5678 9012",
        dateOfBirth: "15/08/1985",
        address: "123 Main Street, Thane West, Maharashtra - 400601",
        gender: "MALE",
      }

      return {
        success: true,
        data: mockAadharData,
        confidence: 0.95,
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        error: "Failed to extract Aadhar data",
      }
    }
  }

  async extractDLData(imageFile: File): Promise<OCRResult> {
    await this.simulateProcessing()

    try {
      const mockDLData: DLData = {
        name: "RAJESH KUMAR SHARMA",
        licenseNumber: "MH0420220012345",
        dateOfBirth: "15/08/1985",
        address: "123 Main Street, Thane West, Maharashtra - 400601",
        validUpto: "14/08/2045",
        vehicleClass: "LMV",
      }

      return {
        success: true,
        data: mockDLData,
        confidence: 0.92,
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        error: "Failed to extract DL data",
      }
    }
  }

  async extractTextFromImage(imageFile: File): Promise<string[]> {
    await this.simulateProcessing()

    // Mock text extraction
    return [
      "Government of India",
      "Unique Identification Authority of India",
      "RAJESH KUMAR SHARMA",
      "1234 5678 9012",
      "DOB: 15/08/1985",
      "Male",
    ]
  }

  private async simulateProcessing(duration = 2000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, duration))
  }

  // Validate extracted data
  validateAadharNumber(aadharNumber: string): boolean {
    const cleanNumber = aadharNumber.replace(/\s/g, "")
    return /^\d{12}$/.test(cleanNumber)
  }

  validateDLNumber(dlNumber: string): boolean {
    // Basic DL number validation for Indian format
    return /^[A-Z]{2}\d{2}\d{4}\d{7}$/.test(dlNumber.replace(/\s/g, ""))
  }

  formatAadharNumber(aadharNumber: string): string {
    const clean = aadharNumber.replace(/\s/g, "")
    return clean.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3")
  }
}

export const ocrService = new OCRService()
