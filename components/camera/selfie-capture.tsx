"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Camera, X, RotateCcw, CheckCircle, AlertTriangle } from "lucide-react"

interface SelfieCaptureProps {
  onPhotoCapture: (file: File) => void
  triggerButton?: React.ReactNode
}

export default function SelfieCapture({ onPhotoCapture, triggerButton }: SelfieCaptureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const cleanup = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto)
      setCapturedPhoto(null)
    }
    setError(null)
    setIsCapturing(false)
  }, [stream, capturedPhoto])

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Front camera for selfies
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
    } catch (error) {
      console.error("Camera access error:", error)
      setError("Unable to access camera. Please check permissions.")
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) {
      setIsCapturing(false)
      return
    }

    // Set canvas dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Flip the image horizontally for selfie (mirror effect)
    context.scale(-1, 1)
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    context.scale(-1, 1) // Reset scale

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" })
          const url = URL.createObjectURL(blob)
          setCapturedPhoto(url)

          // Stop camera stream
          if (stream) {
            stream.getTracks().forEach((track) => track.stop())
            setStream(null)
          }

          // Call the callback with the file
          onPhotoCapture(file)
        }
        setIsCapturing(false)
      },
      "image/jpeg",
      0.8,
    )
  }

  const retakePhoto = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto)
      setCapturedPhoto(null)
    }
    startCamera()
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      cleanup()
    }
    setIsOpen(open)
  }

  const handleDialogOpen = () => {
    setIsOpen(true)
    // Start camera when dialog opens
    setTimeout(() => {
      startCamera()
    }, 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild onClick={handleDialogOpen}>
        {triggerButton || (
          <Button variant="outline" size="sm" className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Capture Selfie
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Capture Selfie</DialogTitle>
          <DialogDescription>Take a clear photo for your profile</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!capturedPhoto && stream && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Camera View</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => cleanup()}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover rounded-lg border transform scale-x-[-1]"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 border-2 border-dashed border-blue-500 rounded-lg pointer-events-none opacity-50" />
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={capturePhoto}
                    size="lg"
                    disabled={isCapturing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    {isCapturing ? "Capturing..." : "Take Photo"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!stream && !capturedPhoto && !error && (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Starting camera...</p>
              <Button variant="outline" onClick={startCamera}>
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            </div>
          )}

          {capturedPhoto && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Photo Captured
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <img
                    src={capturedPhoto || "/placeholder.svg"}
                    alt="Captured selfie"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={retakePhoto}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake
                    </Button>
                    <Button onClick={() => handleDialogClose(false)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Use Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="text-center py-4">
              <Button variant="outline" onClick={startCamera}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
