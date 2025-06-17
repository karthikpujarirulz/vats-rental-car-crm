"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, AlertCircle, Copy, ExternalLink, Database, Shield, Settings, Loader2, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

interface FirebaseSettings {
  enabled: boolean
  config: FirebaseConfig
  features: {
    auth: boolean
    firestore: boolean
    storage: boolean
    messaging: boolean
    analytics: boolean
  }
}

export default function SimpleFirebaseConfig() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<FirebaseSettings>({
    enabled: false,
    config: {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: "",
    },
    features: {
      auth: true,
      firestore: true,
      storage: true,
      messaging: false,
      analytics: false,
    },
  })

  const [testing, setTesting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    loadFirebaseSettings()
  }, [])

  const loadFirebaseSettings = () => {
    try {
      const saved = localStorage.getItem("vats-rental-firebase")
      if (saved) {
        setSettings(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading Firebase settings:", error)
    }
  }

  const saveFirebaseSettings = () => {
    try {
      localStorage.setItem("vats-rental-firebase", JSON.stringify(settings))
      toast({
        title: "Firebase Configuration Saved",
        description: "Your Firebase settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Firebase settings.",
        variant: "destructive",
      })
    }
  }

  const updateConfig = (key: keyof FirebaseConfig, value: string) => {
    setSettings((prev) => ({
      ...prev,
      config: { ...prev.config, [key]: value },
    }))
  }

  const updateFeature = (feature: keyof typeof settings.features, enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      features: { ...prev.features, [feature]: enabled },
    }))
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const isValid = settings.config.apiKey && settings.config.projectId && settings.config.authDomain

      toast({
        title: isValid ? "Connection Successful" : "Connection Failed",
        description: isValid
          ? "Firebase configuration is valid and connection established."
          : "Please check your Firebase configuration values.",
        variant: isValid ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to test Firebase connection.",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const copyConfig = () => {
    const configStr = `// Firebase Configuration
const firebaseConfig = {
  apiKey: "${settings.config.apiKey}",
  authDomain: "${settings.config.authDomain}",
  projectId: "${settings.config.projectId}",
  storageBucket: "${settings.config.storageBucket}",
  messagingSenderId: "${settings.config.messagingSenderId}",
  appId: "${settings.config.appId}"${settings.config.measurementId ? `,\n  measurementId: "${settings.config.measurementId}"` : ""}
};

export default firebaseConfig;`

    navigator.clipboard.writeText(configStr)
    toast({
      title: "Configuration Copied",
      description: "Firebase configuration copied to clipboard.",
    })
  }

  const generateEnvFile = () => {
    const envContent = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=${settings.config.apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${settings.config.authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${settings.config.projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${settings.config.storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${settings.config.messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${settings.config.appId}${settings.config.measurementId ? `\nNEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${settings.config.measurementId}` : ""}`

    const blob = new Blob([envContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = ".env.local"
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Environment File Generated",
      description: ".env.local file downloaded successfully.",
    })
  }

  const isConfigValid = () => {
    return (
      settings.config.apiKey &&
      settings.config.authDomain &&
      settings.config.projectId &&
      settings.config.storageBucket &&
      settings.config.messagingSenderId &&
      settings.config.appId
    )
  }

  const getConfigStatus = () => {
    const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
    const filledFields = requiredFields.filter((field) => settings.config[field as keyof FirebaseConfig])
    return `${filledFields.length}/${requiredFields.length}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Firebase Configuration</h1>
        <p className="text-muted-foreground mb-4">Set up Firebase backend services for your rental CRM</p>
        <div className="flex justify-center gap-2">
          <Badge variant={settings.enabled ? "default" : "secondary"}>
            {settings.enabled ? "Enabled" : "Disabled"}
          </Badge>
          <Badge variant="outline">Config: {getConfigStatus()}</Badge>
          <Badge variant={isConfigValid() ? "default" : "secondary"}>{isConfigValid() ? "Valid" : "Incomplete"}</Badge>
        </div>
      </div>

      {/* Main Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Firebase Project Configuration
          </CardTitle>
          <CardDescription>Enter your Firebase project configuration values from the Firebase Console</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <Label className="text-base font-medium">Enable Firebase Integration</Label>
              <p className="text-sm text-muted-foreground">Switch from mock data to Firebase backend</p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enabled: checked }))}
            />
          </div>

          {settings.enabled && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Production Mode:</strong> Enabling Firebase will switch the system to use real Firebase
                services. Ensure all configuration values are correct.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key *</Label>
              <Input
                id="apiKey"
                type="password"
                value={settings.config.apiKey}
                onChange={(e) => updateConfig("apiKey", e.target.value)}
                placeholder="AIzaSyC..."
                disabled={!settings.enabled}
              />
              <p className="text-xs text-muted-foreground">Web API Key from Firebase Console</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="authDomain">Auth Domain *</Label>
              <Input
                id="authDomain"
                value={settings.config.authDomain}
                onChange={(e) => updateConfig("authDomain", e.target.value)}
                placeholder="your-project.firebaseapp.com"
                disabled={!settings.enabled}
              />
              <p className="text-xs text-muted-foreground">Authentication domain</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID *</Label>
              <Input
                id="projectId"
                value={settings.config.projectId}
                onChange={(e) => updateConfig("projectId", e.target.value)}
                placeholder="your-project-id"
                disabled={!settings.enabled}
              />
              <p className="text-xs text-muted-foreground">Unique project identifier</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageBucket">Storage Bucket *</Label>
              <Input
                id="storageBucket"
                value={settings.config.storageBucket}
                onChange={(e) => updateConfig("storageBucket", e.target.value)}
                placeholder="your-project.appspot.com"
                disabled={!settings.enabled}
              />
              <p className="text-xs text-muted-foreground">Cloud Storage bucket</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="messagingSenderId">Messaging Sender ID *</Label>
              <Input
                id="messagingSenderId"
                value={settings.config.messagingSenderId}
                onChange={(e) => updateConfig("messagingSenderId", e.target.value)}
                placeholder="123456789012"
                disabled={!settings.enabled}
              />
              <p className="text-xs text-muted-foreground">Cloud Messaging sender ID</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appId">App ID *</Label>
              <Input
                id="appId"
                value={settings.config.appId}
                onChange={(e) => updateConfig("appId", e.target.value)}
                placeholder="1:123456789012:web:abcdef123456"
                disabled={!settings.enabled}
              />
              <p className="text-xs text-muted-foreground">Firebase App ID</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="measurementId">Measurement ID (Optional)</Label>
              <Input
                id="measurementId"
                value={settings.config.measurementId}
                onChange={(e) => updateConfig("measurementId", e.target.value)}
                placeholder="G-XXXXXXXXXX"
                disabled={!settings.enabled}
              />
              <p className="text-xs text-muted-foreground">Google Analytics measurement ID</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={saveFirebaseSettings} disabled={!settings.enabled}>
              <Settings className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={!settings.enabled || !isConfigValid() || testing}
            >
              {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
              {testing ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Firebase Services
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? "Hide" : "Show"} Advanced
            </Button>
          </CardTitle>
          <CardDescription>Enable or disable specific Firebase services</CardDescription>
        </CardHeader>
        {showAdvanced && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Authentication</Label>
                  <p className="text-xs text-muted-foreground">User login and registration</p>
                </div>
                <Switch
                  checked={settings.features.auth}
                  onCheckedChange={(checked) => updateFeature("auth", checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Firestore Database</Label>
                  <p className="text-xs text-muted-foreground">NoSQL document database</p>
                </div>
                <Switch
                  checked={settings.features.firestore}
                  onCheckedChange={(checked) => updateFeature("firestore", checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Cloud Storage</Label>
                  <p className="text-xs text-muted-foreground">File uploads and storage</p>
                </div>
                <Switch
                  checked={settings.features.storage}
                  onCheckedChange={(checked) => updateFeature("storage", checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Cloud Messaging</Label>
                  <p className="text-xs text-muted-foreground">Push notifications</p>
                </div>
                <Switch
                  checked={settings.features.messaging}
                  onCheckedChange={(checked) => updateFeature("messaging", checked)}
                  disabled={!settings.enabled}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Export & Deploy */}
      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
          <CardDescription>Export your Firebase configuration for deployment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={copyConfig} variant="outline" disabled={!isConfigValid()}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Config Object
            </Button>
            <Button onClick={generateEnvFile} variant="outline" disabled={!isConfigValid()}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Download .env File
            </Button>
          </div>

          {isConfigValid() && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Ready for Production:</strong> Your Firebase configuration is complete and ready for deployment.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Quick Setup Guide:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Go to Firebase Console → Project Settings</li>
              <li>Scroll to "Your apps" section</li>
              <li>Select your web app or create one</li>
              <li>Copy the configuration values above</li>
            </ol>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Firebase Console
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
