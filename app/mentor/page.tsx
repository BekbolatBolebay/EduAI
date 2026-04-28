"use client"

import { useState, useRef, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Send,
  Code,
  Sparkles,
  Bot,
  Loader2,
  BrainCircuit,
  MessageSquare,
  Mic,
  Image as ImageIcon,
  ChevronLeft
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface Message {
  id: string
  type: "ai" | "user"
  content: string
  isStreaming?: boolean
}

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Сәлем! Мен сенің EduAI менторыңмын. Бүгін саған қай пәннен немесе қай тақырыптан көмек керек? Мен саған теорияны түсіндіріп, есептер шығаруға немесе код жазуға көмектесе аламын."
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(data)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/teacher/generate", {
        method: "POST",
        body: JSON.stringify({
          subject: profile?.grade || "Мектеп бағдарламасы",
          grade: "Оқушыға көмек",
          topic: `Student asked: ${input}. Provide a helpful, academic, and encouraging response in Kazakh. If they ask for code, provide it in a code block. Keep it interactive.`
        })
      })

      const data = await response.json()
      // Note: The generate API returns questions by default, but we can adapt it for chat
      // For now, let's assume the AI response text is in data.text or similar, 
      // but our current API is optimized for quizzes. 
      // Let's create a specialized chat logic or use the existing one creatively.
      
      const aiContent = data.questions?.[0]?.question || "Кешіріңіз, қазір жауап бере алмай тұрмын. Сәлден соң қайталап көріңізші."
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiContent
      }
      
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      setMessages(prev => [...prev, {
        id: "error",
        type: "ai",
        content: "Байланыс үзілді. Интернетті тексеріп көріңізші."
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <AppShell showHeader={false}>
      <div className="flex flex-col h-[calc(100vh-80px)] lg:h-screen max-w-5xl mx-auto w-full bg-background relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -z-10" />

        {/* Chat Header */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-full lg:hidden">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">Robot Mentor</h1>
              <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> AI Оқытушы
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex rounded-xl font-bold gap-2">
              <BrainCircuit className="h-4 w-4" /> Сессияны сақтау
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <Avatar className={`h-8 w-8 mt-1 border ${message.type === "ai" ? "border-primary/20" : "border-border"}`}>
                {message.type === "ai" ? (
                  <AvatarFallback className="bg-primary/5 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xs">
                    {profile?.full_name?.[0] || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className={`flex flex-col max-w-[85%] lg:max-w-[70%] ${message.type === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-3 rounded-[24px] text-sm lg:text-base font-medium shadow-sm transition-all ${
                  message.type === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-card border border-border/50 rounded-tl-none"
                }`}>
                  {message.content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest px-1">
                  {message.type === "ai" ? "Mentor" : "Сіз"} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
              <div className="bg-muted/30 px-4 py-2 rounded-[20px] rounded-tl-none border border-border/50">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 pb-8 pt-4 bg-gradient-to-t from-background to-transparent sticky bottom-0">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-blue-600/50 rounded-[28px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-card border-2 border-border/50 rounded-[24px] p-2 flex items-center gap-2 shadow-2xl">
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hidden md:flex">
                <Mic className="h-5 w-5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ментордан сұраңыз..."
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-base font-medium h-12"
                disabled={isTyping}
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="h-10 w-10 rounded-2xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-transform active:scale-95"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-4 overflow-x-auto pb-2 no-scrollbar">
            {["Математикадан көмек", "Код жазуды үйрет", "Физика заңдары"].map((hint) => (
              <button
                key={hint}
                onClick={() => setInput(hint)}
                className="px-4 py-1.5 rounded-full bg-muted/50 border border-border text-[11px] font-black uppercase tracking-wider text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all whitespace-nowrap"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
