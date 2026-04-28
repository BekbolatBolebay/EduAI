"use client"

import { ReactNode, useState } from "react"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { NotificationPanel } from "@/components/notification-panel"
import { AppHeader } from "@/components/app-header"

interface AppShellProps {
  children: ReactNode
  showHeader?: boolean
  showAvatar?: boolean
}

export function AppShell({ children, showHeader = true, showAvatar = true }: AppShellProps) {
  const [notificationOpen, setNotificationOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <DesktopSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:max-w-[calc(100%-16rem)]">
        {/* Mobile Header - hidden on desktop */}
        {showHeader && (
          <div className="lg:hidden">
            <AppHeader 
              showAvatar={showAvatar}
              onNotificationClick={() => setNotificationOpen(true)}
            />
          </div>
        )}

        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between w-full px-6 py-4">
            <div />
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setNotificationOpen(true)}
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation - hidden on desktop */}
        <div className="lg:hidden">
          <BottomNavigation />
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
      />
    </div>
  )
}
