"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, Copy } from "lucide-react"
import { ocrService, type AadharData, type DLData, type OCRResult } from "@/services/ocr-service"

interface DocumentScannerProps {
  onDataExtracted: (data: AadharData | DLData, type: "aadhar" | "dl") => void
  documentType: "aadhar" | "dl"
}

export default function DocumentScanner({ onDataExtracted, documentType }: DocumentScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setResult(null)
    }
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const processDocument = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      let ocrResult: OCRResult

      if (documentType === "aadhar") {
        ocrResult = await ocrService.extractAadharData(selectedFile)
      } else {
        ocrResult = await ocrService.extractDLData(selectedFile)
      }

      setProgress(100)
      setResult(ocrResult)

      if (ocrResult.success && ocrResult.data) {
        onDataExtracted(ocrResult.data, documentType)
      }
    } catch (error) {
      setResult({
        success: false,
        data: null,
        confidence: 0,
        error: "Processing failed",
      })
    } finally {
      clearInterval(progressInterval)
      setIsProcessing(false)
    }
  }

  const resetScanner = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const documentTitle = documentType === "aadhar" ? "Aadhar Card" : "Driving License"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Scan className="h-4 w-4 mr-2" />
          Scan {documentTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>OCR Document Scanner</DialogTitle>
          <DialogDescription>Automatically extract data from {documentTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedFile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleCameraCapture} className="h-24 flex-col">
                  <Camera className="h-8 w-8 mb-2" />
                  Take Photo
                </Button>
                <Button variant="outline" onClick={handleUploadClick} className="h-24 flex-col">
                  <Upload className="h-8 w-8 mb-2" />
                  Upload Image
                </Button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  For best results, ensure the document is well-lit, flat, and all text is clearly visible.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {selectedFile && previewUrl && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Document Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Document preview"
                      className="w-full max-h-64 object-contain rounded-lg border"
                    />
                    <Badge className="absolute top-2 right-2 bg-blue-600">{documentTitle}</Badge>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" onClick={resetScanner}>
                      Choose Different Image
                    </Button>
                    <Button onClick={processDocument} disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Extract Data"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {isProcessing && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing document...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      Extraction Results
                    </CardTitle>
                    {result.success && (
                      <CardDescription>Confidence: {Math.round(result.confidence * 100)}%</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {result.success && result.data ? (
                      <div className="space-y-4">
                        {documentType === "aadhar" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Name</Label>
                              <div className="flex items-center gap-2">
                                <Input value={(result.data as AadharData).name} readOnly className="text-sm" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard((result.data as AadharData).name)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Aadhar Number</Label>
                              <div className="flex items-center gap-2">
                                <Input value={(result.data as AadharData).aadharNumber} readOnly className="text-sm" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard((result.data as AadharData).aadharNumber)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Date of Birth</Label>
                              <Input value={(result.data as AadharData).dateOfBirth} readOnly className="text-sm" />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Gender</Label>
                              <Input value={(result.data as AadharData).gender} readOnly className="text-sm" />
                            </div>
                            <div className="col-span-2">
                              <Label className="text-sm font-medium">Address</Label>
                              <Input value={(result.data as AadharData).address} readOnly className="text-sm" />
                            </div>
                          </div>
                        )}

                        {documentType === "dl" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Name</Label>
                              <div className="flex items-center gap-2">
                                <Input value={(result.data as DLData).name} readOnly className="text-sm" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard((result.data as DLData).name)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">License Number</Label>
                              <div className="flex items-center gap-2">
                                <Input value={(result.data as DLData).licenseNumber} readOnly className="text-sm" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard((result.data as DLData).licenseNumber)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Date of Birth</Label>
                              <Input value={(result.data as DLData).dateOfBirth} readOnly className="text-sm" />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Valid Upto</Label>
                              <Input value={(result.data as DLData).validUpto} readOnly className="text-sm" />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Vehicle Class</Label>
                              <Input value={(result.data as DLData).vehicleClass} readOnly className="text-sm" />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Address</Label>
                              <Input value={(result.data as DLData).address} readOnly className="text-sm" />
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={resetScanner}>
                            Scan Another
                          </Button>
                          <Button onClick={() => setIsOpen(false)}>Use This Data</Button>
                        </div>
                      </div>
                    ) : (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {result.error || "Failed to extract data from the document"}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
