"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { CourseModal } from "@/components/course-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search,
  Clock,
  Signal,
  Bot,
  Star
} from "lucide-react"

const categories = ["Барлығы", "Робототехника", "Бағдарламалау", "Өнер", "Ғылым", "Математика"]

interface Course {
  id: number
  title: string
  description: string
  category: string
  level: string
  duration: string
  isNew?: boolean
  color: string
  lessons: number
  rating: number
  students: number
}

const courses: Course[] = [
  {
    id: 1,
    title: "Болашақ инженерлері: Робототехника негіздері",
    description: "Arduino платформасында алғашқы роботыңызды құрастыруды үйреніңіз.",
    category: "РОБОТОТЕХНИКА",
    level: "Орташа",
    duration: "12 апта",
    isNew: true,
    color: "from-red-500 to-red-700",
    lessons: 24,
    rating: 4.8,
    students: 156
  },
  {
    id: 2,
    title: "Цифрлық иллюстрация",
    description: "Procreate және Photoshop негіздері арқылы креативті әлемге саяхат.",
    category: "ӨНЕР",
    level: "Бастауыш",
    duration: "8 апта",
    color: "from-purple-500 to-purple-700",
    lessons: 16,
    rating: 4.6,
    students: 89
  },
  {
    id: 3,
    title: "Python: Ойын жасау",
    description: "Pygame кітапханасы арқылы алғашқы 2D ойыныңызды жасаңыз.",
    category: "БАҒДАРЛАМАЛАУ",
    level: "Жоғары",
    duration: "16 апта",
    color: "from-green-500 to-green-700",
    lessons: 32,
    rating: 4.9,
    students: 234
  },
  {
    id: 4,
    title: "Алгебра және анализ бастамалары",
    description: "Жоғары математика негіздері: функциялар, туындылар, интегралдар.",
    category: "МАТЕМАТИКА",
    level: "Жоғары",
    duration: "14 апта",
    color: "from-indigo-500 to-indigo-700",
    lessons: 28,
    rating: 4.7,
    students: 312
  }
]

const featuredCourse: Course = {
  id: 5,
  title: "Жас биолог: Генетика құпиялары",
  description: "ДНҚ мен гендердің қалай жұмыс істейтінін қызықты тәжірибелер арқылы біліңіз.",
  category: "ҒЫЛЫМ",
  level: "Орташа",
  duration: "10 апта",
  color: "from-blue-500 to-blue-700",
  lessons: 20,
  rating: 4.7,
  students: 178
}

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState("Барлығы")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courseModalOpen, setCourseModalOpen] = useState(false)

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course)
    setCourseModalOpen(true)
  }

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === "Барлығы" || 
      course.category.toLowerCase().includes(activeCategory.toLowerCase())
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <AppShell showAvatar={false}>
      <div className="px-4 lg:px-6 space-y-5 max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl lg:text-3xl font-bold">Сабақтар каталогы</h1>

        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Қандай курс іздеп жүрсіз?"
            className="pl-10 h-12 bg-muted/50 border-0"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="rounded-full whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Курс табылмады</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setActiveCategory("Барлығы")
                  setSearchQuery("")
                }}
              >
                Барлық курстарды көрсету
              </Button>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className="border shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all active:scale-[0.99] group"
                onClick={() => handleCourseClick(course)}
              >
                <div className={`h-36 lg:h-40 bg-gradient-to-br ${course.color} relative flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  {course.isNew && (
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white border-0">
                      ЖАҢА
                    </Badge>
                  )}
                  <div className="text-6xl text-white/30 font-bold">
                    {course.category === "РОБОТОТЕХНИКА" && "🤖"}
                    {course.category === "ӨНЕР" && "🎨"}
                    {course.category === "БАҒДАРЛАМАЛАУ" && "💻"}
                    {course.category === "МАТЕМАТИКА" && "📐"}
                    {course.category === "ҒЫЛЫМ" && "🔬"}
                  </div>
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="text-xs mb-2">
                    {course.category}
                  </Badge>
                  <h3 className="font-bold line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Signal className="h-4 w-4" />
                        <span>{course.level}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium text-foreground">{course.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 rounded-full">
                    Курсқа жазылу
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Featured Course */}
        <Card 
          className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
          onClick={() => handleCourseClick(featuredCourse)}
        >
          <CardContent className="p-5 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <Badge className="bg-primary/20 text-primary border-0 mb-3">
                  {featuredCourse.category}
                </Badge>
                <h3 className="text-xl lg:text-2xl font-bold">{featuredCourse.title}</h3>
                <p className="text-sm lg:text-base text-muted-foreground mt-2">
                  {featuredCourse.description}
                </p>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">СЫНЫПТАР</p>
                    <p className="font-semibold">8-11 сынып</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">ҰЗАҚТЫҒЫ</p>
                    <p className="font-semibold">{featuredCourse.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">РЕЙТИНГ</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      {featuredCourse.rating}
                    </p>
                  </div>
                </div>
                <Button className="mt-5 rounded-full">
                  Толығырақ →
                </Button>
              </div>
              <div className={`w-full lg:w-48 h-32 lg:h-48 bg-gradient-to-br ${featuredCourse.color} rounded-xl flex items-center justify-center`}>
                <span className="text-6xl">🔬</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAB - Chat with AI */}
      <Button 
        size="icon" 
        className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 h-14 w-14 rounded-full shadow-lg z-40"
        title="AI көмекші"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* Course Modal */}
      <CourseModal 
        open={courseModalOpen}
        onOpenChange={setCourseModalOpen}
        course={selectedCourse}
      />
    </AppShell>
  )
}
