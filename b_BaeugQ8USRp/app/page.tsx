import Image from "next/image"
import Link from "next/link"
import { EduAILogo } from "@/components/edu-ai-logo"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, Quiz, SmartToy, Monitoring, Engineering } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      {/* Header / Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EduAILogo size="sm" showText={true} />
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-primary">Басты бет</Link>
            <Link href="/tests" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Тест</Link>
            <Link href="/catalog" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Тапсырмалар</Link>
            <Link href="/mentor" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Mentor</Link>
            <Link href="/teacher" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
              Мұғалімге
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Кіру</Link>
            <Button asChild className="rounded-xl font-bold shadow-lg shadow-primary/20">
              <Link href="/register">Тіркелу</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                Жасанды интеллект негізіндегі <span className="text-primary">оқыту платформасы</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                Тест тапсырып өтіп, деңгейіңізді біліңіз және жасанды интеллект арқылы жеке тапсырмалар алыңыз!
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="px-10 py-7 text-lg rounded-2xl font-black shadow-2xl shadow-primary/20">
                <Link href="/tests">Тест бастау</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-10 py-7 text-lg rounded-2xl font-black border-2">
                <Link href="/register">Тіркелу</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-muted-foreground">
                <span className="text-foreground">1,000+</span> оқушы бізбен бірге оқиды
              </p>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="relative glass-panel rounded-[48px] p-8 bg-card border border-border shadow-2xl overflow-hidden group">
              <Image 
                src="/images/mascot.png" 
                alt="Robot Mascot" 
                width={600} 
                height={600} 
                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -top-6 -left-6 bg-card p-4 rounded-2xl shadow-xl border border-border animate-bounce duration-[3000ms]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined font-black">bolt</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Деңгей</p>
                  <p className="text-sm font-black text-foreground">Жоғары</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-2xl shadow-xl border border-border animate-bounce duration-[4000ms]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined font-black">check_circle</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Прогресс</p>
                  <p className="text-sm font-black text-foreground">85% Орындалды</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight">Қалай жұмыс істейді?</h2>
            <p className="text-muted-foreground font-medium">3 қадамда жаңа деңгейге көтеріліңіз</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Тіркелу", desc: "Платформаға тіркеліп, өз сыныбыңыз бен пәніңізді таңдаңыз.", icon: GraduationCap, color: "blue" },
              { step: "02", title: "Тест тапсыру", desc: "Деңгейіңізді анықтау үшін арнайы дайындалған тесттерден өтіңіз.", icon: ArrowRight, color: "emerald" },
              { step: "03", title: "AI тапсырмалар", desc: "Жасанды интеллект сіздің нәтижеңізге қарай жеке тапсырмалар дайындайды.", icon: SmartToy, color: "amber" }
            ].map((item, idx) => (
              <div key={idx} className="bg-card p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-border group">
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                    <item.icon size={32} />
                  </div>
                  <span className="text-4xl font-black text-muted/30 group-hover:text-muted/50 transition-colors">{item.step}</span>
                </div>
                <h3 className="text-xl font-black mb-4">{item.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <EduAILogo size="sm" showText={true} />
          </div>
          <p className="text-muted-foreground text-sm font-medium">© 2024 Алматы. Барлық құқықтар қорғалған.</p>
        </div>
      </footer>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    </div>
  )
}
