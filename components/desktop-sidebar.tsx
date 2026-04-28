"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  FileText, 
  Bot, 
  BookOpen, 
  User,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react"
import { EduAILogo } from "@/components/edu-ai-logo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { href: "/home", label: "Оқу", icon: Home },
  { href: "/tests", label: "Тесттер", icon: FileText },
  { href: "/mentor", label: "Ментор", icon: Bot },
  { href: "/catalog", label: "Каталог", icon: BookOpen },
  { href: "/profile", label: "Профиль", icon: User },
]

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/home">
          <EduAILogo size="md" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 pt-8 border-t border-border">
          <ul className="space-y-1">
            <li>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                <span>Баптаулар</span>
              </Link>
            </li>
            <li>
              <Link
                href="/help"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <HelpCircle className="h-5 w-5" />
                <span>Көмек</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="bg-primary/10 text-primary">АТ</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Алихан Темірлан</p>
            <p className="text-xs text-muted-foreground">11-сынып</p>
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
