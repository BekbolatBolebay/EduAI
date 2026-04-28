"use client"

import { useState, useEffect } from "react"
import { EduAILogo } from "@/components/edu-ai-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bell, Users, FileText, BarChart3, Plus, Search, ChevronRight, BookOpen, Clock, CheckCircle, Eye, LogOut, Sparkles } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

export default function TeacherPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "tests" | "results">("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [tests, setTests] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // AI Generation State
  const [subject, setSubject] = useState("Математика")
  const [grade, setGrade] = useState("10-сынып")
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch students from profiles
      const { data: stData } = await supabase.from("profiles").select("*")
      if (stData) setStudents(stData)

      // Fetch community quizzes
      const { data: qData } = await supabase.from("community_quizzes").select("*").order("created_at", { ascending: false })
      if (qData) setTests(qData)

      // Fetch results
      const { data: rData } = await supabase.from("test_results").select("*").order("created_at", { ascending: false })
      if (rData) setResults(rData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAI = async () => {
    if (!topic) return
    setIsGenerating(true)
    try {
      const res = await fetch("/api/teacher/generate", {
        method: "POST",
        body: JSON.stringify({ subject, grade, topic })
      })
      const data = await res.json()
      setGeneratedQuiz(data)
    } catch (e) {
      alert("Генерация кезінде қате кетті")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveQuiz = async () => {
    if (!generatedQuiz) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return alert("Жүйеге кіріңіз")

      await supabase.from("community_quizzes").insert({
        user_id: user.id,
        title: topic,
        subject,
        grade,
        questions: generatedQuiz.questions
      })
      alert("Тест сақталды!")
      setGeneratedQuiz(null)
      setTopic("")
      fetchData()
    } catch (e) {
      alert("Сақтау мүмкін болмады")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <EduAILogo size="sm" />
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium text-primary">Мұғалім панелі</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">3</span>
            </Button>
            <Link href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border px-4 py-2">
        <div className="flex gap-1 overflow-x-auto max-w-7xl mx-auto">
          {[
            { id: "overview", label: "Жалпы", icon: BarChart3 },
            { id: "students", label: "Оқушылар", icon: Users },
            { id: "tests", label: "Тесттер", icon: FileText },
            { id: "results", label: "Нәтижелер", icon: CheckCircle },
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

      <main className="p-4 pb-8 space-y-4 max-w-7xl mx-auto">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-primary">{students.length}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Оқушылар</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-foreground">{tests.length}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Тесттер</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-foreground">{results.length}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Тапсырылды</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-foreground">82%</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Орташа балл</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-black">Соңғы нәтижелер</CardTitle>
                  <Button variant="ghost" size="sm" className="font-bold text-primary" onClick={() => setActiveTab("results")}>
                    Барлығы <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.slice(0, 5).map((result, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold">
                          {result.user_id.slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-sm">{result.test_title}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{new Date(result.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black ${result.score / result.total_questions >= 0.8 ? "text-emerald-500" : "text-amber-500"}`}>
                          {result.score}/{result.total_questions}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-primary text-primary-foreground overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                  <CardHeader>
                    <CardTitle className="text-lg font-black flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI Тест Генераторы
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm font-medium text-white/80 leading-relaxed">
                      Кез келген тақырып бойынша интерактивті тесттерді жасанды интеллект көмегімен дайындаңыз.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-white text-primary hover:bg-white/90 font-black rounded-xl">
                          Генерациялау
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] rounded-[32px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black">AI Тест Генерациялау</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Пән</label>
                              <select 
                                value={subject} 
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-muted/50 rounded-xl p-3 text-sm font-bold border-none outline-none"
                              >
                                <option>Математика</option>
                                <option>Физика</option>
                                <option>Информатика</option>
                                <option>Биология</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Сынып</label>
                              <select 
                                value={grade} 
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full bg-muted/50 rounded-xl p-3 text-sm font-bold border-none outline-none"
                              >
                                {["9-сынып", "10-сынып", "11-сынып"].map(g => <option key={g}>{g}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Тақырып</label>
                            <Input 
                              placeholder="Мс: Жарықтың сыну заңдары" 
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              className="rounded-xl font-bold"
                            />
                          </div>

                          {generatedQuiz && generatedQuiz.questions && (
                            <div className="max-h-[300px] overflow-y-auto p-4 bg-primary/5 rounded-2xl space-y-4 border border-primary/10">
                              <p className="text-xs font-black text-primary uppercase">Дайын тест:</p>
                              {generatedQuiz.questions.map((q: any, i: number) => (
                                <div key={i} className="text-sm font-bold">
                                  {i+1}. {q.question}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <DialogFooter className="gap-2">
                          {!generatedQuiz ? (
                            <Button 
                              onClick={handleGenerateAI} 
                              disabled={isGenerating}
                              className="w-full font-black rounded-xl"
                            >
                              {isGenerating ? "Генерациялануда..." : "AI Генерациялау"}
                            </Button>
                          ) : (
                            <Button 
                              onClick={handleSaveQuiz} 
                              className="w-full bg-emerald-500 hover:bg-emerald-600 font-black rounded-xl"
                            >
                              Жариялау
                            </Button>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs can be implemented similarly with Supabase data */}
        {activeTab !== "overview" && (
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 bg-muted/10 rounded-[32px] border-2 border-dashed border-border/50">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <span className="material-symbols-outlined text-3xl">construction</span>
            </div>
            <div>
              <h3 className="font-black text-foreground">Бұл бөлім әзірленуде</h3>
              <p className="text-xs text-muted-foreground font-medium">Мәліметтерді Supabase арқылы қосу үстіндеміз</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
