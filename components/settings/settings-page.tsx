"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building,
  Bell,
  Shield,
  Palette,
  Database,
  Upload,
  Download,
  Save,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import SimpleFirebaseConfig from "@/components/firebase/simple-firebase-config"

interface BusinessSettings {
  companyName: string
  address: string
  phone: string
  email: string
  website: string
  gstNumber: string
  panNumber: string
  logo: string
  currency: string
  timezone: string
  dateFormat: string
  language: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  bookingReminders: boolean
  paymentReminders: boolean
  maintenanceAlerts: boolean
  lowFuelAlerts: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordExpiry: number
  loginAttempts: number
  dataBackup: boolean
  auditLogs: boolean
}

interface AppearanceSettings {
  theme: "light" | "dark" | "system"
  primaryColor: string
  fontSize: "small" | "medium" | "large"
  compactMode: boolean
  showWelcomeMessage: boolean
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("business")
  const [loading, setLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    companyName: "Vats Rental Services",
    address: "123 Main Street, Thane, Maharashtra 400601",
    phone: "+91 9876543210",
    email: "info@vatsrental.com",
    website: "www.vatsrental.com",
    gstNumber: "27ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    logo: "",
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    language: "English",
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    bookingReminders: true,
    paymentReminders: true,
    maintenanceAlerts: true,
    lowFuelAlerts: false,
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    dataBackup: true,
    auditLogs: true,
  })

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: "light",
    primaryColor: "#3b82f6",
    fontSize: "medium",
    compactMode: false,
    showWelcomeMessage: true,
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const savedBusiness = localStorage.getItem("vats-rental-business")
      const savedNotifications = localStorage.getItem("vats-rental-notifications")
      const savedSecurity = localStorage.getItem("vats-rental-security")
      const savedAppearance = localStorage.getItem("vats-rental-appearance")

      if (savedBusiness) setBusinessSettings(JSON.parse(savedBusiness))
      if (savedNotifications) setNotificationSettings(JSON.parse(savedNotifications))
      if (savedSecurity) setSecuritySettings(JSON.parse(savedSecurity))
      if (savedAppearance) setAppearanceSettings(JSON.parse(savedAppearance))

      // Load logo preview if exists
      const savedLogo = localStorage.getItem("vats-rental-logo")
      if (savedLogo) {
        setLogoPreview(savedLogo)
        setBusinessSettings((prev) => ({ ...prev, logo: savedLogo }))
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      localStorage.setItem("vats-rental-business", JSON.stringify(businessSettings))
      localStorage.setItem("vats-rental-notifications", JSON.stringify(notificationSettings))
      localStorage.setItem("vats-rental-security", JSON.stringify(securitySettings))
      localStorage.setItem("vats-rental-appearance", JSON.stringify(appearanceSettings))

      // Save logo if uploaded
      if (logoFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const logoData = e.target?.result as string
          localStorage.setItem("vats-rental-logo", logoData)
          setBusinessSettings((prev) => ({ ...prev, logo: logoData }))
          setLogoPreview(logoData)
        }
        reader.readAsDataURL(logoFile)
      }

      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
          variant: "destructive",
        })
        return
      }

      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const exportSettings = () => {
    const allSettings = {
      business: businessSettings,
      notifications: notificationSettings,
      security: securitySettings,
      appearance: appearanceSettings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(allSettings, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `vats-rental-settings-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Settings Exported",
      description: "Settings have been exported successfully.",
    })
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string)
          if (settings.business) setBusinessSettings(settings.business)
          if (settings.notifications) setNotificationSettings(settings.notifications)
          if (settings.security) setSecuritySettings(settings.security)
          if (settings.appearance) setAppearanceSettings(settings.appearance)

          toast({
            title: "Settings Imported",
            description: "Settings have been imported successfully.",
          })
        } catch (error) {
          toast({
            title: "Import Error",
            description: "Invalid settings file. Please check the file format.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      localStorage.removeItem("vats-rental-business")
      localStorage.removeItem("vats-rental-notifications")
      localStorage.removeItem("vats-rental-security")
      localStorage.removeItem("vats-rental-appearance")
      localStorage.removeItem("vats-rental-logo")
      loadSettings()
      setLogoPreview("")
      setLogoFile(null)

      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values.",
      })
    }
  }

  const tabs = [
    { id: "business", label: "Business", icon: Building },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "firebase", label: "Firebase", icon: Database },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences and configuration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => document.getElementById("import-settings")?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <input id="import-settings" type="file" accept=".json" onChange={importSettings} className="hidden" />
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save All
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Business Settings */}
          {activeTab === "business" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Basic information about your rental business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={businessSettings.companyName}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, companyName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={businessSettings.phone}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessSettings.email}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={businessSettings.website}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, website: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea
                      id="address"
                      value={businessSettings.address}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        value={businessSettings.gstNumber}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, gstNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input
                        id="panNumber"
                        value={businessSettings.panNumber}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, panNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Company Logo</CardTitle>
                  <CardDescription>Upload your company logo for documents and branding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Label htmlFor="logo">Upload Logo</Label>
                      <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Recommended: PNG or JPG, max 2MB, square format
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Settings</CardTitle>
                  <CardDescription>Configure regional preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={businessSettings.currency}
                        onValueChange={(value) => setBusinessSettings({ ...businessSettings, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="GBP">British Pound (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={businessSettings.timezone}
                        onValueChange={(value) => setBusinessSettings({ ...businessSettings, timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                          <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={businessSettings.dateFormat}
                        onValueChange={(value) => setBusinessSettings({ ...businessSettings, dateFormat: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={businessSettings.language}
                        onValueChange={(value) => setBusinessSettings({ ...businessSettings, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Marathi">Marathi</SelectItem>
                          <SelectItem value="Gujarati">Gujarati</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Preferences</CardTitle>
                  <CardDescription>Configure how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alert Types</CardTitle>
                  <CardDescription>Choose which types of alerts you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Booking Reminders</Label>
                      <p className="text-sm text-muted-foreground">Reminders for upcoming bookings</p>
                    </div>
                    <Switch
                      checked={notificationSettings.bookingReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, bookingReminders: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Payment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Reminders for pending payments</p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, paymentReminders: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Maintenance Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alerts for vehicle maintenance</p>
                    </div>
                    <Switch
                      checked={notificationSettings.maintenanceAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, maintenanceAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Low Fuel Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alerts when vehicles have low fuel</p>
                    </div>
                    <Switch
                      checked={notificationSettings.lowFuelAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, lowFuelAlerts: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>Configure authentication and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Select
                        value={securitySettings.sessionTimeout.toString()}
                        onValueChange={(value) =>
                          setSecuritySettings({ ...securitySettings, sessionTimeout: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Select
                        value={securitySettings.passwordExpiry.toString()}
                        onValueChange={(value) =>
                          setSecuritySettings({ ...securitySettings, passwordExpiry: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select expiry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="loginAttempts">Maximum Login Attempts</Label>
                    <Select
                      value={securitySettings.loginAttempts.toString()}
                      onValueChange={(value) =>
                        setSecuritySettings({ ...securitySettings, loginAttempts: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attempts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Protection</CardTitle>
                  <CardDescription>Configure data backup and audit settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Automatic Data Backup</Label>
                      <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
                    </div>
                    <Switch
                      checked={securitySettings.dataBackup}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, dataBackup: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Audit Logs</Label>
                      <p className="text-sm text-muted-foreground">Keep detailed logs of all system activities</p>
                    </div>
                    <Switch
                      checked={securitySettings.auditLogs}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogs: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme & Display</CardTitle>
                  <CardDescription>Customize the look and feel of your application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={appearanceSettings.theme}
                      onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, theme: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select
                      value={appearanceSettings.fontSize}
                      onValueChange={(value) =>
                        setAppearanceSettings({ ...appearanceSettings, fontSize: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact layout to fit more content</p>
                    </div>
                    <Switch
                      checked={appearanceSettings.compactMode}
                      onCheckedChange={(checked) =>
                        setAppearanceSettings({ ...appearanceSettings, compactMode: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Show Welcome Message</Label>
                      <p className="text-sm text-muted-foreground">Display welcome message on dashboard</p>
                    </div>
                    <Switch
                      checked={appearanceSettings.showWelcomeMessage}
                      onCheckedChange={(checked) =>
                        setAppearanceSettings({ ...appearanceSettings, showWelcomeMessage: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Firebase Settings */}
          {activeTab === "firebase" && (
            <div className="space-y-6">
              <SimpleFirebaseConfig />
            </div>
          )}
        </div>
      </div>

      {/* Reset Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions that affect your entire application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-medium text-red-800">Reset All Settings</h4>
              <p className="text-sm text-red-600">This will reset all settings to their default values</p>
            </div>
            <Button variant="destructive" onClick={resetSettings}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Reset Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
