"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  Signal, 
  Users, 
  Star, 
  CheckCircle, 
  Play,
  BookOpen,
  Trophy
} from "lucide-react"

interface Course {
  id: number
  title: string
  description: string
  category: string
  level: string
  duration: string
  lessons: number
  rating: number
  students: number
  color: string
}

interface CourseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
}

export function CourseModal({ open, onOpenChange, course }: CourseModalProps) {
  const [enrolled, setEnrolled] = useState(false)
  const [currentLesson, setCurrentLesson] = useState(0)

  if (!course) return null

  const lessons = [
    { title: "Кіріспе: Курс туралы", duration: "5 мин", completed: true },
    { title: "Негізгі түсініктер", duration: "15 мин", completed: true },
    { title: "Практикалық тапсырма 1", duration: "20 мин", completed: false },
    { title: "Теориялық материал", duration: "25 мин", completed: false },
    { title: "Практикалық тапсырма 2", duration: "30 мин", completed: false },
    { title: "Қорытынды тест", duration: "15 мин", completed: false },
  ]

  const completedLessons = lessons.filter(l => l.completed).length
  const progress = Math.round((completedLessons / lessons.length) * 100)

  const handleEnroll = () => {
    setEnrolled(true)
  }

  const handleStartLesson = (index: number) => {
    setCurrentLesson(index)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {/* Header Image */}
        <div className={`h-40 bg-gradient-to-br ${course.color} relative flex items-center justify-center`}>
          <div className="text-8xl text-white/20 font-bold">
            {course.category === "РОБОТОТЕХНИКА" && "🤖"}
            {course.category === "ӨНЕР" && "🎨"}
            {course.category === "БАҒДАРЛАМАЛАУ" && "💻"}
            {course.category === "ҒЫЛЫМ" && "🔬"}
            {course.category === "МАТЕМАТИКА" && "📐"}
          </div>
        </div>

        <div className="p-5 space-y-4">
          <DialogHeader>
            <Badge variant="secondary" className="w-fit mb-2">
              {course.category}
            </Badge>
            <DialogTitle className="text-xl">{course.title}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {course.description}
            </p>
          </DialogHeader>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Signal className="h-4 w-4 text-muted-foreground" />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{course.lessons} сабақ</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{course.students} оқушы</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="font-bold">{course.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({course.students} бағалау)
            </span>
          </div>

          {enrolled ? (
            <>
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Сіздің прогрессіңіз</span>
                  <span className="text-primary font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {completedLessons} / {lessons.length} сабақ аяқталды
                </p>
              </div>

              {/* Lessons List */}
              <div className="space-y-2">
                <h3 className="font-semibold">Сабақтар</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {lessons.map((lesson, index) => (
                    <button
                      key={index}
                      onClick={() => handleStartLesson(index)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        currentLesson === index
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {lesson.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : currentLesson === index ? (
                          <Play className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                        {currentLesson === index && !lesson.completed && (
                          <Badge variant="secondary" className="text-xs">
                            Ағымдағы
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Сабақты жалғастыру
              </Button>
            </>
          ) : (
            <>
              {/* What you'll learn */}
              <div className="space-y-2">
                <h3 className="font-semibold">Не үйренесіз:</h3>
                <ul className="space-y-2">
                  {[
                    "Негізгі теориялық білімдер",
                    "Практикалық дағдылар",
                    "Нақты жобаларды орындау",
                    "Сертификат алу"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certificate */}
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-sm">Сертификат</p>
                  <p className="text-xs text-muted-foreground">
                    Курсты аяқтағаннан кейін сертификат аласыз
                  </p>
                </div>
              </div>

              <Button onClick={handleEnroll} className="w-full" size="lg">
                Курсқа жазылу
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
