"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Car, Users, Calendar, FileText, BarChart3, Menu, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import NotificationPanel from "../notifications/notification-panel"

interface MobileNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()

  const navItems = [
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "cars", label: "Cars", icon: Car },
    { id: "customers", label: "Customers", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "history", label: "History", icon: FileText },
  ]

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Car className="h-6 w-6 text-blue-600" />
                    <span>Vats Rental CRM</span>
                  </SheetTitle>
                  <SheetDescription>
                    <Badge variant="secondary">Thane, Maharashtra</Badge>
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleTabSelect(item.id)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    )
                  })}
                  <div className="border-t pt-4 mt-4">
                    <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Vats CRM</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <NotificationPanel />
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                className="flex-col h-12 text-xs"
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4 mb-1" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </div>
    </>
  )
}
