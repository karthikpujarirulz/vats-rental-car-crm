"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Info, CheckCircle, AlertCircle, Settings } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function FirebaseSetupGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const router = useRouter()

  const goToFirebaseSettings = () => {
    router.push("/?tab=firebase")
  }

  const envVars = [
    {
      key: "NEXT_PUBLIC_FIREBASE_API_KEY",
      value: "your_api_key_here",
      description: "Firebase Web API Key from Project Settings",
    },
    {
      key: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      value: "your-project-id.firebaseapp.com",
      description: "Authentication domain for your Firebase project",
    },
    {
      key: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      value: "your-project-id",
      description: "Unique identifier for your Firebase project",
    },
    {
      key: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      value: "your-project-id.appspot.com",
      description: "Cloud Storage bucket for file uploads",
    },
    {
      key: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      value: "your_sender_id",
      description: "Cloud Messaging sender ID for notifications",
    },
    {
      key: "NEXT_PUBLIC_FIREBASE_APP_ID",
      value: "your_app_id",
      description: "Firebase App ID from project configuration",
    },
  ]

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Firebase Setup Guide</h1>
        <p className="text-lg text-gray-600 mb-4">Complete Firebase configuration for Vats Rental CRM</p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="text-sm">
            🚀 Production Ready
          </Badge>
          <Badge variant="outline" className="text-sm">
            📱 PWA Enabled
          </Badge>
          <Badge variant="outline" className="text-sm">
            🔐 Secure Authentication
          </Badge>
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Current Status:</strong> Running with mock data for demonstration. Follow these steps to connect to
          Firebase for production deployment with real-time data synchronization.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Quick Configuration</h4>
          <Button onClick={goToFirebaseSettings} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Open Firebase Settings
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Use the Firebase settings tab to configure your project with a user-friendly interface.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Step 1: Create Firebase Project */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                1
              </span>
              Create Firebase Project
            </CardTitle>
            <CardDescription>Set up your Firebase project in the console</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button variant="default" size="lg" className="w-full" asChild>
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-5 w-5 mr-2" />
                Open Firebase Console
              </a>
            </Button>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Project Creation Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Click <strong>"Create a project"</strong>
                </li>
                <li>
                  Enter project name: <code className="bg-white px-2 py-1 rounded">vats-rental-crm</code>
                </li>
                <li>Choose to enable/disable Google Analytics (recommended: Enable)</li>
                <li>Select your Google Analytics account or create new</li>
                <li>
                  Click <strong>"Create project"</strong> and wait for setup completion
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Configure Authentication */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                2
              </span>
              Configure Authentication
            </CardTitle>
            <CardDescription>Set up user authentication and admin access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Authentication Setup:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  In Firebase Console, navigate to <strong>"Authentication"</strong>
                </li>
                <li>
                  Click <strong>"Get started"</strong>
                </li>
                <li>
                  Go to <strong>"Sign-in method"</strong> tab
                </li>
                <li>
                  Enable <strong>"Email/Password"</strong> provider
                </li>
                <li>
                  Optionally enable <strong>"Google"</strong> sign-in for easier access
                </li>
              </ol>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Admin User Setup:</strong> After enabling authentication, create your first admin user in the
                "Users" tab with email: <code>admin@vatsrental.com</code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 3: Setup Firestore Database */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                3
              </span>
              Setup Firestore Database
            </CardTitle>
            <CardDescription>Configure NoSQL database for real-time data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Database Configuration:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Go to <strong>"Firestore Database"</strong>
                </li>
                <li>
                  Click <strong>"Create database"</strong>
                </li>
                <li>
                  Choose <strong>"Start in test mode"</strong> (for development)
                </li>
                <li>Select your preferred location (choose closest to your users)</li>
                <li>
                  Click <strong>"Done"</strong>
                </li>
              </ol>
            </div>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Security Rules:</strong> Remember to update Firestore security rules for production. Test mode
                allows all reads/writes for 30 days.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 4: Setup Storage */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                4
              </span>
              Setup Cloud Storage
            </CardTitle>
            <CardDescription>Configure file storage for documents and images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Storage Setup:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Navigate to <strong>"Storage"</strong>
                </li>
                <li>
                  Click <strong>"Get started"</strong>
                </li>
                <li>Accept the default security rules for now</li>
                <li>Choose your storage location (same as Firestore recommended)</li>
                <li>
                  Click <strong>"Done"</strong>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">Storage Usage:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Customer document uploads (Aadhar, License)</li>
                <li>• Vehicle photos and damage reports</li>
                <li>• Company logo and branding assets</li>
                <li>• PDF agreements and invoices</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 5: Get Configuration */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                5
              </span>
              Get Firebase Configuration
            </CardTitle>
            <CardDescription>Extract configuration keys for your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Configuration Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Go to <strong>Project Settings</strong> (gear icon)
                </li>
                <li>
                  Scroll down to <strong>"Your apps"</strong> section
                </li>
                <li>
                  Click <strong>"Add app"</strong> and select <strong>Web (</strong>
                </li>
                <li>
                  Register app with nickname: <code className="bg-white px-2 py-1 rounded">Vats Rental CRM</code>
                </li>
                <li>Copy the configuration object that appears</li>
                <li>Skip Firebase Hosting setup for now</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Step 6: Environment Variables */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                6
              </span>
              Configure Environment Variables
            </CardTitle>
            <CardDescription>Add Firebase configuration to your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-indigo-200 bg-indigo-50">
              <Info className="h-4 w-4 text-indigo-600" />
              <AlertDescription className="text-indigo-800">
                Replace the placeholder values with your actual Firebase configuration values from Step 5.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {envVars.map((envVar, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono font-semibold text-gray-800">{envVar.key}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`${envVar.key}=${envVar.value}`, index)}
                      className="h-8"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{envVar.description}</p>
                  <code className="text-xs bg-white p-2 rounded border block">
                    {envVar.key}={envVar.value}
                  </code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 7: Initialize Database */}
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                7
              </span>
              Initialize Database
            </CardTitle>
            <CardDescription>Populate your database with sample data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Database Initialization:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>After setting up environment variables</li>
                <li>Run the database initialization script</li>
                <li>This will create sample cars, customers, and bookings</li>
                <li>Verify data appears in Firebase Console</li>
              </ol>
            </div>

            <Alert className="border-teal-200 bg-teal-50">
              <CheckCircle className="h-4 w-4 text-teal-600" />
              <AlertDescription className="text-teal-800">
                <strong>Sample Data Includes:</strong> 10 vehicles, 15 customers, 20 bookings, and complete business
                settings for immediate testing.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 8: Go Live */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                8
              </span>
              Switch to Production
            </CardTitle>
            <CardDescription>Activate Firebase integration and go live</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Production Activation:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Update import statements to use Firebase services</li>
                <li>
                  Replace <code>mockDataService</code> with Firebase services
                </li>
                <li>Update authentication context to use Firebase Auth</li>
                <li>Test all functionality with real data</li>
                <li>Deploy to production environment</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Production Features:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Real-time data synchronization</li>
                  <li>• Secure user authentication</li>
                  <li>• Cloud file storage</li>
                  <li>• Automatic backups</li>
                  <li>• Scalable infrastructure</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🚀 Ready to Use:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Multi-user access</li>
                  <li>• Mobile responsive design</li>
                  <li>• PWA installation</li>
                  <li>• Offline capabilities</li>
                  <li>• Professional reporting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert className="border-2 border-emerald-200 bg-emerald-50">
        <CheckCircle className="h-5 w-5 text-emerald-600" />
        <AlertDescription className="text-emerald-800">
          <strong>Demo Mode Active:</strong> The system currently works with mock data. You can test all features
          including login (admin@vatsrental.com / admin123), complete car and customer management, booking creation, and
          advanced analytics.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <Button size="lg" asChild>
          <a href="https://firebase.google.com/docs/web/setup" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-5 w-5 mr-2" />
            Firebase Documentation
          </a>
        </Button>
      </div>
    </div>
  )
}
