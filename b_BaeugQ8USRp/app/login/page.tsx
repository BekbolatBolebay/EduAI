"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Lock, MessageCircle, GraduationCap, BookOpen, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { EduAILogo } from "@/components/edu-ai-logo"
import { supabase } from "@/lib/supabase"

type UserRole = "student" | "teacher" | "admin"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      switch (selectedRole) {
        case "teacher":
          router.push("/teacher")
          break
        case "admin":
          router.push("/admin")
          break
        default:
          router.push("/home")
      }
    } catch (error: any) {
      alert(error.message || "Қате кетті")
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { id: "student" as UserRole, label: "Оқушы", icon: GraduationCap, color: "blue" },
    { id: "teacher" as UserRole, label: "Мұғалім", icon: BookOpen, color: "green" },
    { id: "admin" as UserRole, label: "Админ", icon: Shield, color: "purple" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <EduAILogo size="lg" />
          <p className="mt-2 text-muted-foreground text-sm">
            Болашақ білім берудің жасанды интеллектісі
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Қош келдіңіз!</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Жүйеге кіру үшін деректеріңізді енгізіңіз
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Кіру түрі
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                      selectedRole === role.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <role.icon className={`h-5 w-5 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs font-medium ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`}>
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Электрондық пошта немесе пайдаланушы аты
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="mysaly@edu.kz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-muted/50 border-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Құпия сөз
                  </label>
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Құпия сөзді ұмыттыңыз ба?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-muted/50 border-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold">
                {loading ? "Кіру..." : "Кіру"}
                <span className="ml-2">→</span>
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">немесе арқылы кіру</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-12">
                <span className="mr-2 text-lg font-bold">iOS</span>
                Apple
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Тіркелген жоқсыз ба?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Жаңа аккаунт ашу
          </Link>
        </p>

        <div className="flex justify-center">
          <Button variant="outline" className="rounded-full px-6 gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="text-xs text-primary">КӨМЕК КЕРЕК ПЕ?</p>
              <p className="text-xs text-muted-foreground">Мен сізге көмектесе аламын</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
