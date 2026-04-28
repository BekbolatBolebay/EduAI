"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { TestModal } from "@/components/test-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  CheckCircle, 
  Clock, 
  Sigma,
  Zap,
  BookOpen,
  Languages,
  Plus
} from "lucide-react"
import Link from "next/link"

const subjects = [
  { name: "Математика", tests: 120, icon: Sigma, color: "bg-purple-100 text-purple-600", users: 8 },
  { name: "Физика", tests: 85, icon: Zap, color: "bg-blue-100 text-blue-600", users: 12 },
  { name: "Тарих", tests: 64, icon: BookOpen, color: "bg-green-100 text-green-600", users: 5 },
  { name: "Тілдер", tests: 92, icon: Languages, color: "bg-orange-100 text-orange-600", ai: true },
]

const recentResults = [
  { subject: "Тарих", date: "Кеше, 18:45", score: 19, total: 20, passed: true },
  { subject: "Геометрия", date: "2 күн бұрын", score: 15, total: 20, passed: true },
]

export default function TestsPage() {
  const [testModalOpen, setTestModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>()

  const handleStartTest = (subject?: string) => {
    setSelectedSubject(subject)
    setTestModalOpen(true)
  }

  return (
    <AppShell>
      <div className="px-4 lg:px-6 space-y-5 max-w-5xl mx-auto">
        {/* Level Detection Banner */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-0 overflow-hidden relative">
          <div className="absolute top-4 right-4 opacity-10">
            <Settings className="h-24 w-24 text-primary-foreground" />
          </div>
          <CardContent className="p-5 lg:p-8 text-primary-foreground">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold">Деңгейді анықтау</h1>
                <p className="text-primary-foreground/80 text-sm lg:text-base mt-1 max-w-md">
                  AI арқылы біліміңізді тексеріп, жеке оқу жоспарын алыңыз. Бар болғаны 15 минут.
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="rounded-full bg-white text-primary hover:bg-white/90 w-fit"
                onClick={() => handleStartTest()}
              >
                Тестілеуді бастау
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Progress */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 lg:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Ағымдағы прогресс</h2>
              <span className="text-xl font-bold text-primary">72%</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">ҰБТ Дайындық: Математика</span>
                  <span className="font-medium">45 / 50</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Физика: Механика</span>
                  <span className="font-medium">12 / 20</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 lg:p-5">
            <h2 className="font-semibold text-lg mb-4">Соңғы нәтижелер</h2>
            <div className="space-y-3">
              {recentResults.map((result, index) => (
                <button 
                  key={index} 
                  className="flex items-center gap-3 w-full text-left hover:bg-muted/50 p-3 -mx-1 rounded-lg transition-colors"
                  onClick={() => handleStartTest(result.subject)}
                >
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    result.passed ? "bg-green-100" : "bg-amber-100"
                  }`}>
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{result.subject}</h3>
                    <p className="text-xs text-muted-foreground">{result.date}</p>
                  </div>
                  <span className={`text-xl font-bold ${
                    result.score >= result.total * 0.8 ? "text-green-600" : "text-amber-600"
                  }`}>
                    {result.score}/{result.total}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subjects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Пәндер бойынша тесттер</h2>
            <Link href="#" className="text-sm text-primary font-medium hover:underline">
              Барлығы →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {subjects.map((subject) => {
              const Icon = subject.icon
              return (
                <Card 
                  key={subject.name} 
                  className="border shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                  onClick={() => handleStartTest(subject.name)}
                >
                  <CardContent className="p-4 lg:p-5">
                    <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl ${subject.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-6 w-6 lg:h-7 lg:w-7" />
                    </div>
                    <h3 className="font-semibold">{subject.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {subject.tests} тест жинағы
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {subject.ai ? (
                        <Badge variant="secondary" className="text-xs">
                          AI +20
                        </Badge>
                      ) : (
                        <>
                          <div className="flex -space-x-1">
                            {[...Array(Math.min(3, subject.users))].map((_, i) => (
                              <div 
                                key={i} 
                                className="w-5 h-5 rounded-full bg-primary/20 border-2 border-card"
                              />
                            ))}
                          </div>
                          {subject.users > 3 && (
                            <span className="text-xs text-primary font-medium">
                              +{subject.users - 3}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Scheduled Tests */}
        <div>
          <h2 className="text-lg font-bold mb-4">Жоспарланған тесттер</h2>
          <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3">
            <Card className="border shadow-sm min-w-[240px] lg:min-w-0 flex-shrink-0">
              <CardContent className="p-4 lg:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-destructive/10 text-destructive border-0">
                    МАҢЫЗДЫ
                  </Badge>
                  <span className="text-xs text-muted-foreground">Ертең, 10:00</span>
                </div>
                <h3 className="font-semibold">Қазақ әдебиеті: Емтихан</h3>
                <p className="text-xs text-muted-foreground mt-1">30 сұрақ • 45 минут</p>
                <Button 
                  size="sm" 
                  className="mt-3 w-full rounded-full"
                  onClick={() => handleStartTest("Қазақ әдебиеті")}
                >
                  Дайындалу
                </Button>
              </CardContent>
            </Card>

            <Card className="border shadow-sm min-w-[200px] lg:min-w-0 flex-shrink-0">
              <CardContent className="p-4 lg:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">ОРТАША</Badge>
                </div>
                <h3 className="font-semibold">Химия</h3>
                <p className="text-xs text-muted-foreground mt-1">20 сұрақ</p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="mt-3 w-full rounded-full"
                  onClick={() => handleStartTest("Химия")}
                >
                  Бастау
                </Button>
              </CardContent>
            </Card>

            <Card className="border shadow-sm min-w-[200px] lg:min-w-0 flex-shrink-0">
              <CardContent className="p-4 lg:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">ЖЕҢІЛ</Badge>
                </div>
                <h3 className="font-semibold">Биология</h3>
                <p className="text-xs text-muted-foreground mt-1">15 сұрақ</p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="mt-3 w-full rounded-full"
                  onClick={() => handleStartTest("Биология")}
                >
                  Бастау
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAB */}
      <Button 
        size="icon" 
        className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 h-14 w-14 rounded-full shadow-lg z-40"
        onClick={() => handleStartTest()}
      >
        <Plus className="h-6 w-6" />
      </Button>
      
      {/* Test Modal */}
      <TestModal 
        open={testModalOpen} 
        onOpenChange={setTestModalOpen}
        subject={selectedSubject}
        grade="10-сынып" // This should ideally come from user profile
      />
    </AppShell>
  )
}
