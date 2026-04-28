"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Mail, Lock, Star, GraduationCap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EduAILogo } from "@/components/edu-ai-logo"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

type UserRole = "student" | "teacher"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [grade, setGrade] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("student")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      alert("Пайдалану шарттарымен келісуіңіз керек")
      return
    }
    setLoading(true)

    try {
      console.log("Starting registration for:", email)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            grade: role === "student" ? grade : null,
          }
        }
      })

      if (authError) {
        console.error("Auth Error:", authError)
        throw authError
      }

      if (authData.user) {
        console.log("User created:", authData.user.id)
        
        // The trigger 'handle_new_user' might already have created the profile,
        // but it doesn't handle 'role' and 'grade' currently in the SQL.
        // So we update it manually just in case or to add missing fields.
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          full_name: fullName,
          role: role, // Note: Ensure 'role' column exists in your profiles table!
          grade: role === "student" ? grade : null,
        })

        if (profileError) {
          console.warn("Profile Update Warning:", profileError)
          // Don't throw here, maybe the user was still created
        }
        
        toast.success("Тіркелу сәтті аяқталды!")
        
        // Automatic login redirect
        setTimeout(() => {
          if (role === "teacher") {
            router.push("/teacher")
          } else {
            router.push("/home")
          }
        }, 1000)
      }
    } catch (error: any) {
      console.error("Registration failed:", error)
      alert(error.message || "Тіркелу кезінде қате кетті. Консольді тексеріңіз.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-8 items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <EduAILogo size="sm" showText={true} className="flex-row gap-2" />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-black text-foreground">Тіркелу</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Платформаға қосылу үшін рөліңізді таңдаңыз
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setRole("student")}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
              role === "student" ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <GraduationCap className={role === "student" ? "text-primary" : "text-muted-foreground"} />
            <span className={`text-xs font-black ${role === "student" ? "text-primary" : "text-muted-foreground"}`}>ОҚУШЫ</span>
          </button>
          <button
            onClick={() => setRole("teacher")}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
              role === "teacher" ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <BookOpen className={role === "teacher" ? "text-primary" : "text-muted-foreground"} />
            <span className={`text-xs font-black ${role === "teacher" ? "text-primary" : "text-muted-foreground"}`}>МҰҒАЛІМ</span>
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Аты-жөніңіз</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Азамат Бақытұлы"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10 h-12 bg-muted/50 border-0 rounded-xl font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="example@edu.kz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-muted/50 border-0 rounded-xl font-bold"
                required
              />
            </div>
          </div>

          {role === "student" && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Сынып</label>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="pl-10 h-12 bg-muted/50 border-0 rounded-xl font-bold text-left">
                    <SelectValue placeholder="Таңдаңыз" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                      <SelectItem key={g} value={`${g}-сынып`}>{g}-сынып</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Құпия сөз</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-muted/50 border-0 rounded-xl font-bold"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-[11px] text-muted-foreground font-medium leading-tight">
              Мен пайдалану шарттарымен және құпиялылық саясатымен келісемін
            </label>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 text-base font-black rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
          >
            {loading ? "Тіркелу..." : "Тіркелу"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-medium">
          Аккаунтыңыз бар ма?{" "}
          <Link href="/login" className="text-primary font-black hover:underline">
            Кіру
          </Link>
        </p>
      </div>
    </div>
  )
}
