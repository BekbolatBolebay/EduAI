"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Trophy, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Question {
  id: string | number
  question: string
  options: string[]
  correct: number
}

interface TestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject?: string
  grade?: string
}

export function TestModal({ open, onOpenChange, subject = "Жалпы білім", grade = "10-сынып" }: TestModalProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchQuestions()
    } else {
      // Reset state when closed
      setCurrentQuestion(0)
      setSelectedAnswer(null)
      setAnswers([])
      setShowResult(false)
      setQuestions([])
    }
  }, [open, subject, grade])

  async function fetchQuestions() {
    setLoading(true)
    try {
      // Fetch from community_quizzes
      const { data } = await supabase
        .from("community_quizzes")
        .select("*")
        .eq("grade", grade)
        .ilike("subject", `%${subject}%`)
        .order("created_at", { ascending: false })
        .limit(1)

      if (data && data.length > 0) {
        setQuestions(data[0].questions)
      } else {
        // Fallback or show error
        setQuestions([
          { id: 1, question: "Сұрақтар табылмады. AI арқылы жасауды өтініңіз.", options: ["Түсінікті"], correct: 0 }
        ])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && !showResult && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [open, showResult, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && !showResult) {
      handleFinish()
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleNext = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1] ?? null)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = selectedAnswer
      setAnswers(newAnswers)
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1] ?? null)
    }
  }

  const handleFinish = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)
    setShowResult(true)
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (index < questions.length && answer === questions[index].correct) {
        correct++
      }
    })
    return correct
  }

  const resetTest = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setShowResult(false)
    setTimeLeft(300)
    onOpenChange(false)
  }

  const score = calculateScore()
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  const question = questions[currentQuestion]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {!showResult ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg">
                  Сұрақ {currentQuestion + 1} / {questions.length}
                </DialogTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(timeLeft)}
                </Badge>
              </div>
              <Progress 
                value={(currentQuestion + 1) / (questions.length || 1) * 100} 
                className="h-2 mt-2" 
              />
            </DialogHeader>

            <div className="py-4">
              {questions.length > 0 && <h2 className="text-xl font-bold mb-6">{question.question}</h2>}
              
              <div className="space-y-3">
                {questions.length > 0 && question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedAnswer === index
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                Алдыңғы
              </Button>
              {currentQuestion < questions.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="flex-1"
                >
                  Келесі
                </Button>
              ) : (
                <Button 
                  onClick={handleFinish}
                  disabled={selectedAnswer === null}
                  className="flex-1"
                >
                  Аяқтау
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="py-4 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
              percentage >= 80 ? "bg-green-100" : percentage >= 60 ? "bg-amber-100" : "bg-red-100"
            }`}>
              {percentage >= 80 ? (
                <Trophy className="h-10 w-10 text-green-600" />
              ) : percentage >= 60 ? (
                <CheckCircle className="h-10 w-10 text-amber-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold mt-4">Сіздің нәтижеңіз</h2>
            <p className="text-5xl font-bold mt-2">
              <span className={percentage >= 80 ? "text-green-600" : percentage >= 60 ? "text-amber-600" : "text-red-600"}>
                {score}
              </span>
              <span className="text-muted-foreground">/{questions.length}</span>
            </p>
            <p className="text-muted-foreground mt-1">
              Деңгейіңіз: <span className="font-semibold">
                {percentage >= 80 ? "Жоғары" : percentage >= 60 ? "Орташа" : "Төмен"}
              </span>
            </p>

            <div className="w-full bg-muted rounded-full h-4 mt-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  percentage >= 80 ? "bg-green-500" : percentage >= 60 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{percentage}%</p>

            <Card className="mt-6 text-left">
              <CardContent className="p-4 space-y-2">
                {questions.map((q, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {answers[index] === q.correct ? (
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    )}
                    <span className="text-sm truncate">{q.question}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={resetTest} className="flex-1">
                Жабу
              </Button>
              <Button onClick={() => {
                setShowResult(false)
                setCurrentQuestion(0)
                setSelectedAnswer(null)
                setAnswers([])
                setTimeLeft(300)
              }} className="flex-1">
                Қайта бастау
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
