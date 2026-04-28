"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { 
  Bell,
  Zap,
  Flame,
  Trophy,
  BookOpen,
  CheckCircle,
  Lock,
  Globe,
  ChevronRight,
  LogOut,
  HelpCircle,
  Pencil,
  Camera
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const achievements = [
  { id: 1, name: "АЛҒАШҚЫ ҚАДАМ", icon: Trophy, color: "bg-amber-100 text-amber-600", unlocked: true },
  { id: 2, name: "КІТАП ҚҰМАР", icon: BookOpen, color: "bg-blue-100 text-blue-600", unlocked: true },
  { id: 3, name: "ТЕСТ ҮЗДІГІ", icon: CheckCircle, color: "bg-green-100 text-green-600", unlocked: true },
  { id: 4, name: "ЗЕРТТЕУШІ", icon: Lock, color: "bg-gray-100 text-gray-400", unlocked: false },
]

const languages = [
  { code: "kk", name: "Қазақша" },
  { code: "ru", name: "Русский" },
  { code: "en", name: "English" },
]

export default function ProfilePage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [languageModalOpen, setLanguageModalOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("kk")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [userName, setUserName] = useState("Алихан Темірлан")

  const handleLogout = () => {
    router.push("/login")
  }

  const handlePasswordChange = () => {
    // Simulate password change
    setPasswordModalOpen(false)
    setCurrentPassword("")
    setNewPassword("")
  }

  return (
    <AppShell showHeader={false}>
      <div className="px-4 lg:px-6 space-y-5 max-w-3xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-0 overflow-hidden">
          <CardContent className="p-5 lg:p-8 flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-24 w-24 lg:h-32 lg:w-32 border-4 border-white/20">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-2xl lg:text-3xl font-bold">
                  АТ
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                className="absolute bottom-0 right-0 h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => setEditProfileOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-primary-foreground mt-3">
              {userName}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
              <Badge className="bg-white/20 text-primary-foreground border-0">
                11-сынып
              </Badge>
              <Badge className="bg-white/20 text-primary-foreground border-0">
                8-деңгей (Pro)
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          {/* Total Points */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Жалпы ұпай</p>
                  <p className="text-2xl lg:text-3xl font-bold">12,450</p>
                </div>
              </div>
              <Progress value={82} className="h-2 mt-3" />
              <p className="text-xs text-muted-foreground mt-1">
                Келесі деңгейге 2,550 ұпай қалды
              </p>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Flame className="h-5 w-5 lg:h-6 lg:w-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Күндік серия</p>
                  <p className="text-2xl lg:text-3xl font-bold">15 күн</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {"Сіз үздік 5% оқушының қатарындасыз!"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Жетістіктер</h2>
            <Link href="#" className="text-sm text-primary font-medium hover:underline">
              Барлығын көру
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div 
                  key={achievement.id}
                  className={`flex flex-col items-center gap-2 min-w-[80px] lg:min-w-0 cursor-pointer hover:scale-105 transition-transform ${
                    !achievement.unlocked && "opacity-50"
                  }`}
                >
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full ${achievement.color} flex items-center justify-center`}>
                    <Icon className="h-7 w-7 lg:h-8 lg:w-8" />
                  </div>
                  <span className="text-xs text-center font-medium leading-tight">
                    {achievement.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Settings */}
        <Card className="border shadow-sm">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Баптаулар
              </h2>
            </div>

            {/* Notifications */}
            <div className="p-4 flex items-center justify-between border-b border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Хабарландырулар</p>
                  <p className="text-xs text-muted-foreground">Жаңалықтар мен ескертулер</p>
                </div>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
              />
            </div>

            {/* Language */}
            <button 
              className="w-full p-4 flex items-center justify-between border-b border-border hover:bg-muted/30 transition-colors"
              onClick={() => setLanguageModalOpen(true)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Тіл</p>
                  <p className="text-xs text-muted-foreground">
                    {languages.find(l => l.code === selectedLanguage)?.name}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Password */}
            <button 
              className="w-full p-4 flex items-center justify-between border-b border-border hover:bg-muted/30 transition-colors"
              onClick={() => setPasswordModalOpen(true)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Құпия сөз</p>
                  <p className="text-xs text-muted-foreground">Қауіпсіздікті жаңарту</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Logout */}
            <button 
              className="w-full p-4 flex items-center gap-3 hover:bg-destructive/5 transition-colors"
              onClick={() => setLogoutModalOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="h-5 w-5 text-destructive" />
              </div>
              <span className="font-medium text-destructive">Шығу</span>
            </button>
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="bg-muted/50 border hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-primary font-medium">Көмек керек пе?</p>
              <p className="text-xs text-muted-foreground">Қолдау қызметіне жазыңыз</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Modal */}
      <Dialog open={languageModalOpen} onOpenChange={setLanguageModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Тілді таңдаңыз</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLanguage(lang.code)
                  setLanguageModalOpen(false)
                }}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedLanguage === lang.code
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{lang.name}</span>
                  {selectedLanguage === lang.code && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Modal */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Құпия сөзді өзгерту</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ағымдағы құпия сөз</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Жаңа құпия сөз</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordModalOpen(false)}>
              Болдырмау
            </Button>
            <Button onClick={handlePasswordChange}>
              Сақтау
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Modal */}
      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Жүйеден шығу</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Сіз шынымен жүйеден шыққыңыз келе ме?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutModalOpen(false)}>
              Болдырмау
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Шығу
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Профильді өзгерту</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    АТ
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Аты-жөні</label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Аты-жөніңіз"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
              Болдырмау
            </Button>
            <Button onClick={() => setEditProfileOpen(false)}>
              Сақтау
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
