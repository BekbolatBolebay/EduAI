"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { TestModal } from "@/components/test-modal"
import { CourseModal } from "@/components/course-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Flame, Star, CheckCircle, Lightbulb, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface Course {
  id: number
  title: string
  description: string
  category: string
  level: string
  duration: string
  color: string
  lessons: number
  rating: number
  students: number
  progress: number
}

const currentCourses: Course[] = [
  {
    id: 1,
    title: "Тригонометрия негіздері",
    description: "Тригонометриялық функциялар және олардың қасиеттері",
    category: "МАТЕМАТИКА",
    level: "10 сынып",
    duration: "8 апта",
    color: "from-purple-500 to-purple-700",
    lessons: 16,
    rating: 4.8,
    students: 234,
    progress: 45
  },
  {
    id: 2,
    title: "Сөзжасам және морфология",
    description: "Қазақ тіліндегі сөз жасау тәсілдері",
    category: "ҚАЗАҚ ТІЛІ",
    level: "10 сынып",
    duration: "6 апта",
    color: "from-amber-500 to-amber-700",
    lessons: 12,
    rating: 4.6,
    students: 189,
    progress: 80
  }
]

export default function HomePage() {
  const router = useRouter()
  const [testModalOpen, setTestModalOpen] = useState(false)
  const [courseModalOpen, setCourseModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileData) {
      if (profileData.role === "teacher") {
        router.push("/teacher")
      } else {
        setProfile(profileData)
      }
    }
    setLoading(false)
  }

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course)
    setCourseModalOpen(true)
  }

  if (loading) return null

  return (
    <AppShell>
      <div className="px-4 lg:px-6 space-y-4 lg:space-y-6 max-w-5xl mx-auto">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-0 overflow-hidden relative shadow-2xl shadow-primary/20">
          <CardContent className="p-5 lg:p-8 text-primary-foreground">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-3xl font-black tracking-tight">
                  Қайырлы күн, {profile?.full_name || "Оқушы"}!
                </h1>
                <p className="text-primary-foreground/80 text-sm lg:text-base mt-2 max-w-md font-medium">
                  {profile?.grade || "10-сынып"} оқу жоспары бойынша бүгін жаңа белестерді бағындыруға дайынсың ба?
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="rounded-2xl bg-white text-primary hover:bg-white/90 w-fit h-14 px-8 font-black shadow-xl"
                onClick={() => setTestModalOpen(true)}
              >
                <Play className="h-5 w-5 mr-2 fill-current" />
                Сабақты жалғастыру
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border shadow-sm hover:shadow-xl transition-all rounded-[32px]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Flame className="h-7 w-7 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Белсенділік</p>
                <p className="text-3xl font-black text-foreground">{profile?.streak || 0} Күн</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-xl transition-all rounded-[32px]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Star className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Ұпайлар</p>
                <p className="text-3xl font-black text-foreground">{profile?.xp || 0} XP</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-xl transition-all rounded-[32px]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 shadow-inner">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Прогресс</p>
                  <span className="text-sm font-black text-emerald-600">68%</span>
                </div>
                <Progress value={68} className="h-2 mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendation */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[36px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <Card className="relative bg-card border-border/50 rounded-[32px] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Lightbulb className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-lg">AI-дан жеке ұсыныс</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    Соңғы тест нәтижелеріне қарағанда, сізге <span className="text-foreground font-bold">"{profile?.grade || "10-сынып"}"</span> деңгейіндегі Физикадан "Динамика" бөлімін қайталау пайдалы болады.
                  </p>
                  <Button size="lg" className="rounded-2xl px-8 font-black mt-2">
                    Қайталауды бастау
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-black tracking-tight">Менің курстарым</h2>
            <Link href="/catalog" className="text-sm font-black text-primary hover:underline">Барлығы →</Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {currentCourses.map((course) => (
              <Card 
                key={course.id} 
                className="border-border/50 hover:border-primary/50 transition-all rounded-[28px] overflow-hidden group cursor-pointer"
                onClick={() => handleCourseClick(course)}
              >
                <CardContent className="p-0 flex h-32">
                  <div className={`w-28 bg-gradient-to-br ${course.color} flex items-center justify-center text-white text-4xl font-black group-hover:scale-110 transition-transform`}>
                    {course.category[0]}
                  </div>
                  <div className="p-5 flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest mb-1">{course.category}</Badge>
                      <h3 className="font-bold text-base truncate">{course.title}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={course.progress} className="h-1.5 flex-1" />
                      <span className="text-xs font-black text-muted-foreground">{course.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <TestModal 
        open={testModalOpen}
        onOpenChange={setTestModalOpen}
        grade={profile?.grade || "10-сынып"}
      />
      
      <CourseModal 
        open={courseModalOpen}
        onOpenChange={setCourseModalOpen}
        course={selectedCourse}
      />
    </AppShell>
  )
}
