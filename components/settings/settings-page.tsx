"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  Building2,
  Bell,
  Car,
  MessageSquare,
  Shield,
  FileText,
  Camera,
  BarChart3,
  Wrench,
  Save,
  RefreshCw,
  CheckCircle,
  Smartphone,
  Mail,
  Database,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SettingsData {
  // General Settings
  businessName: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  businessLicense: string
  currency: string
  timezone: string
  language: string

  // Notification Settings
  emailNotifications: boolean
  smsNotifications: boolean
  whatsappNotifications: boolean
  reminderDays: number
  overdueNotifications: boolean

  // Booking Settings
  defaultRentalDuration: number
  minimumAdvancePayment: number
  lateFeePerDay: number
  cancellationPolicy: string
  autoConfirmBookings: boolean
  allowOnlineBookings: boolean

  // Communication Settings
  smsApiKey: string
  smsProvider: string
  whatsappApiKey: string
  emailSmtpHost: string
  emailSmtpPort: string
  emailUsername: string
  emailPassword: string

  // System Settings
  autoBackup: boolean
  backupFrequency: string
  dataRetentionDays: number
  enableAuditLog: boolean
  requireTwoFactor: boolean

  // Feature Toggles
  enableOCR: boolean
  enableAnalytics: boolean
  enableMaintenance: boolean
  enableReports: boolean
  enableCommunication: boolean
  enableCalendar: boolean

  // PDF Settings
  pdfTemplate: string
  includeLogo: boolean
  includeTerms: boolean
  autoGeneratePDF: boolean

  // OCR Settings
  ocrProvider: string
  ocrAccuracy: string
  autoExtractData: boolean

  // Analytics Settings
  trackingEnabled: boolean
  dataCollection: boolean
  reportFrequency: string

  // Maintenance Settings
  maintenanceReminders: boolean
  serviceIntervalKm: number
  insuranceReminders: boolean
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SettingsData>({
    // Default values - ensure no empty strings
    businessName: "Vats Rental",
    businessAddress: "Thane, Maharashtra 400601",
    businessPhone: "+91 9876543210",
    businessEmail: "info@vatsrental.com",
    businessLicense: "MH-RENT-2024-001",
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "en",

    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
    reminderDays: 1,
    overdueNotifications: true,

    defaultRentalDuration: 1,
    minimumAdvancePayment: 30,
    lateFeePerDay: 500,
    cancellationPolicy: "24 hours notice required",
    autoConfirmBookings: false,
    allowOnlineBookings: true,

    smsApiKey: "",
    smsProvider: "twilio",
    whatsappApiKey: "",
    emailSmtpHost: "",
    emailSmtpPort: "587",
    emailUsername: "",
    emailPassword: "",

    autoBackup: true,
    backupFrequency: "daily",
    dataRetentionDays: 365,
    enableAuditLog: true,
    requireTwoFactor: false,

    enableOCR: true,
    enableAnalytics: true,
    enableMaintenance: true,
    enableReports: true,
    enableCommunication: true,
    enableCalendar: true,

    pdfTemplate: "standard",
    includeLogo: true,
    includeTerms: true,
    autoGeneratePDF: true,

    ocrProvider: "tesseract",
    ocrAccuracy: "high",
    autoExtractData: true,

    trackingEnabled: true,
    dataCollection: true,
    reportFrequency: "weekly",

    maintenanceReminders: true,
    serviceIntervalKm: 10000,
    insuranceReminders: true,
  })

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // In a real app, this would load from your backend/database
      const savedSettings = localStorage.getItem("vats-rental-settings")
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) })
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)

      // In a real app, this would save to your backend/database
      localStorage.setItem("vats-rental-settings", JSON.stringify(settings))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings Saved",
        description: "Your settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      localStorage.removeItem("vats-rental-settings")
      window.location.reload()
    }
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "vats-rental-settings.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const updateSetting = (key: keyof SettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure your Vats Rental CRM system settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Communication</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Features</span>
          </TabsTrigger>
          <TabsTrigger value="pdf" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </TabsTrigger>
          <TabsTrigger value="ocr" className="flex items-center gap-1">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">OCR</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-1">
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">Maintenance</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>Configure your business details and basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => updateSetting("businessName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={settings.businessPhone}
                    onChange={(e) => updateSetting("businessPhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => updateSetting("businessEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business License</Label>
                  <Input
                    id="businessLicense"
                    value={settings.businessLicense}
                    onChange={(e) => updateSetting("businessLicense", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={settings.businessAddress}
                  onChange={(e) => updateSetting("businessAddress", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>WhatsApp Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp</p>
                  </div>
                  <Switch
                    checked={settings.whatsappNotifications}
                    onCheckedChange={(checked) => updateSetting("whatsappNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Overdue Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified about overdue returns</p>
                  </div>
                  <Switch
                    checked={settings.overdueNotifications}
                    onCheckedChange={(checked) => updateSetting("overdueNotifications", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="reminderDays">Reminder Days Before Return</Label>
                <Input
                  id="reminderDays"
                  type="number"
                  min="0"
                  max="7"
                  value={settings.reminderDays}
                  onChange={(e) => updateSetting("reminderDays", Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">Send reminders this many days before the return date</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Settings */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Booking Configuration
              </CardTitle>
              <CardDescription>Configure booking policies and default values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultRentalDuration">Default Rental Duration (days)</Label>
                  <Input
                    id="defaultRentalDuration"
                    type="number"
                    min="1"
                    value={settings.defaultRentalDuration}
                    onChange={(e) => updateSetting("defaultRentalDuration", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumAdvancePayment">Minimum Advance Payment (%)</Label>
                  <Input
                    id="minimumAdvancePayment"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.minimumAdvancePayment}
                    onChange={(e) => updateSetting("minimumAdvancePayment", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateFeePerDay">Late Fee Per Day (₹)</Label>
                  <Input
                    id="lateFeePerDay"
                    type="number"
                    min="0"
                    value={settings.lateFeePerDay}
                    onChange={(e) => updateSetting("lateFeePerDay", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                <Textarea
                  id="cancellationPolicy"
                  value={settings.cancellationPolicy}
                  onChange={(e) => updateSetting("cancellationPolicy", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Confirm Bookings</Label>
                    <p className="text-sm text-muted-foreground">Automatically confirm new bookings</p>
                  </div>
                  <Switch
                    checked={settings.autoConfirmBookings}
                    onCheckedChange={(checked) => updateSetting("autoConfirmBookings", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Online Bookings</Label>
                    <p className="text-sm text-muted-foreground">Enable customers to book online</p>
                  </div>
                  <Switch
                    checked={settings.allowOnlineBookings}
                    onCheckedChange={(checked) => updateSetting("allowOnlineBookings", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Settings */}
        <TabsContent value="communication">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  SMS Configuration
                </CardTitle>
                <CardDescription>Configure SMS service provider settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smsProvider">SMS Provider</Label>
                  <Select
                    value={settings.smsProvider || "twilio"}
                    onValueChange={(value) => updateSetting("smsProvider", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select SMS provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="textlocal">TextLocal</SelectItem>
                      <SelectItem value="msg91">MSG91</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsApiKey">SMS API Key</Label>
                  <Input
                    id="smsApiKey"
                    type="password"
                    value={settings.smsApiKey}
                    onChange={(e) => updateSetting("smsApiKey", e.target.value)}
                    placeholder="Enter your SMS API key"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  WhatsApp Configuration
                </CardTitle>
                <CardDescription>Configure WhatsApp Business API settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappApiKey">WhatsApp API Key</Label>
                  <Input
                    id="whatsappApiKey"
                    type="password"
                    value={settings.whatsappApiKey}
                    onChange={(e) => updateSetting("whatsappApiKey", e.target.value)}
                    placeholder="Enter your WhatsApp API key"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
                <CardDescription>Configure SMTP settings for email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailSmtpHost">SMTP Host</Label>
                    <Input
                      id="emailSmtpHost"
                      value={settings.emailSmtpHost}
                      onChange={(e) => updateSetting("emailSmtpHost", e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailSmtpPort">SMTP Port</Label>
                    <Input
                      id="emailSmtpPort"
                      value={settings.emailSmtpPort}
                      onChange={(e) => updateSetting("emailSmtpPort", e.target.value)}
                      placeholder="587"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailUsername">Email Username</Label>
                    <Input
                      id="emailUsername"
                      value={settings.emailUsername}
                      onChange={(e) => updateSetting("emailUsername", e.target.value)}
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailPassword">Email Password</Label>
                    <Input
                      id="emailPassword"
                      type="password"
                      value={settings.emailPassword}
                      onChange={(e) => updateSetting("emailPassword", e.target.value)}
                      placeholder="App password"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Configure backup and data retention settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup your data</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency || "daily"}
                    onValueChange={(value) => updateSetting("backupFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetentionDays">Data Retention (days)</Label>
                  <Input
                    id="dataRetentionDays"
                    type="number"
                    min="30"
                    value={settings.dataRetentionDays}
                    onChange={(e) => updateSetting("dataRetentionDays", Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">How long to keep deleted records</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and audit settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Audit Log</Label>
                    <p className="text-sm text-muted-foreground">Track all user actions</p>
                  </div>
                  <Switch
                    checked={settings.enableAuditLog}
                    onCheckedChange={(checked) => updateSetting("enableAuditLog", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add extra security layer</p>
                  </div>
                  <Switch
                    checked={settings.requireTwoFactor}
                    onCheckedChange={(checked) => updateSetting("requireTwoFactor", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Toggles */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Feature Management
              </CardTitle>
              <CardDescription>Enable or disable specific features in your CRM</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>OCR Document Scanning</Label>
                    <p className="text-sm text-muted-foreground">Extract data from documents</p>
                  </div>
                  <Switch
                    checked={settings.enableOCR}
                    onCheckedChange={(checked) => updateSetting("enableOCR", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics Dashboard</Label>
                    <p className="text-sm text-muted-foreground">Business insights and reports</p>
                  </div>
                  <Switch
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) => updateSetting("enableAnalytics", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fleet Maintenance</Label>
                    <p className="text-sm text-muted-foreground">Track vehicle maintenance</p>
                  </div>
                  <Switch
                    checked={settings.enableMaintenance}
                    onCheckedChange={(checked) => updateSetting("enableMaintenance", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Advanced Reports</Label>
                    <p className="text-sm text-muted-foreground">Generate detailed reports</p>
                  </div>
                  <Switch
                    checked={settings.enableReports}
                    onCheckedChange={(checked) => updateSetting("enableReports", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Communication Center</Label>
                    <p className="text-sm text-muted-foreground">SMS, WhatsApp, Email messaging</p>
                  </div>
                  <Switch
                    checked={settings.enableCommunication}
                    onCheckedChange={(checked) => updateSetting("enableCommunication", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Calendar View</Label>
                    <p className="text-sm text-muted-foreground">Visual booking calendar</p>
                  </div>
                  <Switch
                    checked={settings.enableCalendar}
                    onCheckedChange={(checked) => updateSetting("enableCalendar", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PDF Settings */}
        <TabsContent value="pdf">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PDF Document Settings
              </CardTitle>
              <CardDescription>Configure PDF generation and templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pdfTemplate">PDF Template</Label>
                <Select
                  value={settings.pdfTemplate || "standard"}
                  onValueChange={(value) => updateSetting("pdfTemplate", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select PDF template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Company Logo</Label>
                    <p className="text-sm text-muted-foreground">Add logo to PDF documents</p>
                  </div>
                  <Switch
                    checked={settings.includeLogo}
                    onCheckedChange={(checked) => updateSetting("includeLogo", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Terms & Conditions</Label>
                    <p className="text-sm text-muted-foreground">Add T&C to rental agreements</p>
                  </div>
                  <Switch
                    checked={settings.includeTerms}
                    onCheckedChange={(checked) => updateSetting("includeTerms", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Generate PDF</Label>
                    <p className="text-sm text-muted-foreground">Automatically create PDFs for bookings</p>
                  </div>
                  <Switch
                    checked={settings.autoGeneratePDF}
                    onCheckedChange={(checked) => updateSetting("autoGeneratePDF", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OCR Settings */}
        <TabsContent value="ocr">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                OCR Configuration
              </CardTitle>
              <CardDescription>Configure optical character recognition settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ocrProvider">OCR Provider</Label>
                <Select
                  value={settings.ocrProvider || "tesseract"}
                  onValueChange={(value) => updateSetting("ocrProvider", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select OCR provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tesseract">Tesseract (Free)</SelectItem>
                    <SelectItem value="google">Google Vision API</SelectItem>
                    <SelectItem value="aws">AWS Textract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ocrAccuracy">OCR Accuracy</Label>
                <Select
                  value={settings.ocrAccuracy || "high"}
                  onValueChange={(value) => updateSetting("ocrAccuracy", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select OCR accuracy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">Fast (Lower accuracy)</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="high">High (Slower processing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Extract Data</Label>
                  <p className="text-sm text-muted-foreground">Automatically extract and fill form data</p>
                </div>
                <Switch
                  checked={settings.autoExtractData}
                  onCheckedChange={(checked) => updateSetting("autoExtractData", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Settings */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Configuration
              </CardTitle>
              <CardDescription>Configure analytics and reporting settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track user interactions and usage</p>
                  </div>
                  <Switch
                    checked={settings.trackingEnabled}
                    onCheckedChange={(checked) => updateSetting("trackingEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Collection</Label>
                    <p className="text-sm text-muted-foreground">Collect anonymous usage data</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection}
                    onCheckedChange={(checked) => updateSetting("dataCollection", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportFrequency">Report Frequency</Label>
                <Select
                  value={settings.reportFrequency || "weekly"}
                  onValueChange={(value) => updateSetting("reportFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Configuration
              </CardTitle>
              <CardDescription>Configure fleet maintenance and reminder settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified about upcoming maintenance</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceReminders}
                    onCheckedChange={(checked) => updateSetting("maintenanceReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Insurance Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified about insurance renewals</p>
                  </div>
                  <Switch
                    checked={settings.insuranceReminders}
                    onCheckedChange={(checked) => updateSetting("insuranceReminders", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceIntervalKm">Service Interval (KM)</Label>
                <Input
                  id="serviceIntervalKm"
                  type="number"
                  min="1000"
                  value={settings.serviceIntervalKm}
                  onChange={(e) => updateSetting("serviceIntervalKm", Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">Default service interval in kilometers</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Alert */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Settings are automatically saved to your browser's local storage. In a production environment, these would be
          saved to your database.
        </AlertDescription>
      </Alert>
    </div>
  )
}
