"use client"

import { useState } from "react"
import { EduAILogo } from "@/components/edu-ai-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Bell, Users, FileText, BarChart3, Search, ChevronRight, 
  Settings, Shield, Database, Activity, UserPlus, BookOpen,
  Trash2, Edit, Eye, MoreVertical, LogOut, GraduationCap,
  TrendingUp, Clock, CheckCircle, AlertCircle
} from "lucide-react"
import Link from "next/link"

const allUsers = [
  { id: 1, name: "Алихан Темірлан", email: "alikhan@edu.kz", role: "student", grade: "11-сынып", status: "active", lastLogin: "Бүгін" },
  { id: 2, name: "Айгерім Сәрсенова", email: "aigerim@edu.kz", role: "student", grade: "10-сынып", status: "active", lastLogin: "Кеше" },
  { id: 3, name: "Ботагөз Нұрланова", email: "botagoz@edu.kz", role: "teacher", grade: "-", status: "active", lastLogin: "Бүгін" },
  { id: 4, name: "Қанат Әлімов", email: "kanat@edu.kz", role: "teacher", grade: "-", status: "active", lastLogin: "3 күн бұрын" },
  { id: 5, name: "Нұрсұлтан Ержанов", email: "nursultan@edu.kz", role: "student", grade: "11-сынып", status: "inactive", lastLogin: "1 апта бұрын" },
  { id: 6, name: "Администратор", email: "admin@edu.kz", role: "admin", grade: "-", status: "active", lastLogin: "Бүгін" },
]

const systemStats = {
  totalUsers: 1248,
  students: 1180,
  teachers: 65,
  admins: 3,
  totalTests: 156,
  totalAttempts: 15420,
  avgScore: 76,
  activeToday: 342
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "content" | "settings">("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "teacher" | "admin">("all")

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "student":
        return <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Оқушы</span>
      case "teacher":
        return <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Мұғалім</span>
      case "admin":
        return <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">Админ</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EduAILogo size="sm" />
            <div className="h-6 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium">Админ панелі</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center">5</span>
            </Button>
            <Link href="/login">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border px-4 py-2">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { id: "dashboard", label: "Басқару тақтасы", icon: BarChart3 },
            { id: "users", label: "Пайдаланушылар", icon: Users },
            { id: "content", label: "Контент", icon: FileText },
            { id: "settings", label: "Баптаулар", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="p-4 pb-8 space-y-4">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{systemStats.totalUsers.toLocaleString()}</p>
                      <p className="text-xs text-white/80">Барлық пайдаланушылар</p>
                    </div>
                    <Users className="h-10 w-10 text-white/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{systemStats.activeToday}</p>
                      <p className="text-xs text-white/80">Бүгін белсенді</p>
                    </div>
                    <Activity className="h-10 w-10 text-white/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Пайдаланушылар бөлінісі</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-foreground">Оқушылар</span>
                  </div>
                  <span className="font-bold text-foreground">{systemStats.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-foreground">Мұғалімдер</span>
                  </div>
                  <span className="font-bold text-foreground">{systemStats.teachers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-foreground">Администраторлар</span>
                  </div>
                  <span className="font-bold text-foreground">{systemStats.admins}</span>
                </div>
              </CardContent>
            </Card>

            {/* Test Statistics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Тест статистикасы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-xl font-bold text-primary">{systemStats.totalTests}</p>
                    <p className="text-xs text-muted-foreground">Тесттер</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-xl font-bold text-primary">{(systemStats.totalAttempts / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-muted-foreground">Тапсырылды</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-xl font-bold text-primary">{systemStats.avgScore}%</p>
                    <p className="text-xs text-muted-foreground">Орташа балл</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-auto py-4 flex flex-col gap-2" onClick={() => setActiveTab("users")}>
                <UserPlus className="h-5 w-5" />
                <span className="text-xs">Пайдаланушы қосу</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Database className="h-5 w-5" />
                <span className="text-xs">Деректер қоры</span>
              </Button>
            </div>

            {/* System Health */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Жүйе күйі
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">API сервер</span>
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Жұмыс істеуде
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Деректер қоры</span>
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Жұмыс істеуде
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">AI қызметі</span>
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Жұмыс істеуде
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Аты, email бойынша іздеу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "Барлығы" },
                { id: "student", label: "Оқушылар" },
                { id: "teacher", label: "Мұғалімдер" },
                { id: "admin", label: "Админдер" },
              ].map((filter) => (
                <Button
                  key={filter.id}
                  variant={roleFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoleFilter(filter.id as typeof roleFilter)}
                  className="whitespace-nowrap"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Көрсетілген: {filteredUsers.length}</p>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-1" />
                Жаңа пайдаланушы
              </Button>
            </div>

            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          user.role === "admin" ? "bg-purple-100" : 
                          user.role === "teacher" ? "bg-green-100" : "bg-blue-100"
                        }`}>
                          <span className={`text-sm font-bold ${
                            user.role === "admin" ? "text-purple-600" : 
                            user.role === "teacher" ? "text-green-600" : "text-blue-600"
                          }`}>
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        {user.grade !== "-" && (
                          <span className="text-xs text-muted-foreground">{user.grade}</span>
                        )}
                        <span className={`h-2 w-2 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {user.lastLogin}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground">156</p>
                  <p className="text-xs text-muted-foreground">Тесттер</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground">2,340</p>
                  <p className="text-xs text-muted-foreground">Сұрақтар</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Пәндер бойынша</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary text-sm">
                    Барлығы <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { subject: "Математика", tests: 42, questions: 680 },
                  { subject: "Физика", tests: 35, questions: 520 },
                  { subject: "Қазақ тілі", tests: 28, questions: 450 },
                  { subject: "Тарих", tests: 25, questions: 380 },
                  { subject: "Ағылшын тілі", tests: 26, questions: 310 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium text-sm text-foreground">{item.subject}</span>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{item.tests} тест</p>
                      <p className="text-xs text-muted-foreground">{item.questions} сұрақ</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Жүйе баптаулары</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Тіркелуді қосу", description: "Жаңа пайдаланушыларға тіркелуге рұқсат беру", enabled: true },
                  { label: "AI генерациясы", description: "OpenAI API арқылы тест генерациялау", enabled: true },
                  { label: "Техникалық жұмыс режимі", description: "Жүйені техникалық жұмыс режиміне қою", enabled: false },
                ].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${setting.enabled ? "bg-primary" : "bg-muted"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${setting.enabled ? "translate-x-6" : "translate-x-0"}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">API конфигурациясы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground">OpenAI API кілті</label>
                  <Input type="password" value="sk-••••••••••••••••" readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Деректер қоры URL</label>
                  <Input value="postgresql://localhost:5432/eduai" readOnly className="mt-1" />
                </div>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Конфигурацияны өзгерту
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Қауіпті аймақ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10">
                  Кэшті тазалау
                </Button>
                <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10">
                  Деректер қорын қалпына келтіру
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
