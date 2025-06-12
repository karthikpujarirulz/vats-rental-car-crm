"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Info } from "lucide-react"

export default function FirebaseSetupGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Firebase Setup Guide</h1>
        <p className="text-gray-600">Configure Firebase for production deployment</p>
        <Badge variant="secondary" className="mt-2">
          Currently using Mock Data
        </Badge>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The system is currently running with mock data for demonstration. Follow these steps to connect to Firebase
          for production use.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                1
              </span>
              Create Firebase Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Go to the Firebase Console and create a new project:</p>
            <Button variant="outline" className="w-full" asChild>
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Firebase Console
              </a>
            </Button>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "Create a project"</li>
              <li>Enter project name: "vats-rental-crm"</li>
              <li>Enable Google Analytics (optional)</li>
              <li>Click "Create project"</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                2
              </span>
              Configure Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>In Firebase Console, go to "Authentication"</li>
              <li>Click "Get started"</li>
              <li>Go to "Sign-in method" tab</li>
              <li>Enable "Email/Password" provider</li>
              <li>Go to "Users" tab and add admin user:</li>
            </ol>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium">Admin Credentials:</p>
              <p className="text-sm">Email: admin@vatsrental.com</p>
              <p className="text-sm">Password: admin123</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                3
              </span>
              Setup Firestore Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to "Firestore Database"</li>
              <li>Click "Create database"</li>
              <li>Choose "Start in test mode" (for development)</li>
              <li>Select your preferred location</li>
              <li>Click "Done"</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                4
              </span>
              Setup Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to "Storage"</li>
              <li>Click "Get started"</li>
              <li>Accept the default security rules</li>
              <li>Choose your storage location</li>
              <li>Click "Done"</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                5
              </span>
              Get Configuration Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to Project Settings (gear icon)</li>
              <li>Scroll down to "Your apps"</li>
              <li>Click "Add app" and select Web (</li>
              <li>Register your app with name "Vats Rental CRM"</li>
              <li>Copy the configuration object</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                6
              </span>
              Environment Variables
            </CardTitle>
            <CardDescription>Add these environment variables to your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                "NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here",
                "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com",
                "NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id",
                "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com",
                "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id",
                "NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id",
              ].map((envVar, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <code className="text-sm">{envVar}</code>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(envVar)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                7
              </span>
              Switch to Firebase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">After setting up Firebase:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Update the import statements in components to use Firebase services instead of mock services</li>
              <li>
                Replace <code>mockDataService</code> with <code>carService</code>, <code>customerService</code>,{" "}
                <code>bookingService</code>
              </li>
              <li>
                Replace <code>mockAuth</code> with Firebase Auth in the auth context
              </li>
              <li>Run the database initialization script to populate sample data</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> The current system works fully with mock data. You can test all features including
          login (admin@vatsrental.com / admin123), car management, customer management, and booking creation.
        </AlertDescription>
      </Alert>
    </div>
  )
}
