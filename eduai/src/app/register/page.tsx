import Image from "next/image";
import Link from "next/link";
import { signup } from "../auth/actions";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const error = (await searchParams).error;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Visual Branding */}
        <div className="hidden md:flex flex-col space-y-10 pr-10 animate-in slide-in-from-left-8 duration-1000">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-on-primary shadow-xl shadow-primary/20">
              <span className="material-symbols-outlined text-4xl fill-1">
                school
              </span>
            </div>
            <span className="text-4xl font-black text-primary tracking-tighter">
              EduAI
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl font-black text-on-surface leading-[1.1] tracking-tight">
              Білім алудың жаңа деңгейіне қадам бас
            </h1>
            <p className="text-xl text-on-surface-variant font-medium max-w-md leading-relaxed">
              Жасанды интеллект көмегімен жеке оқу жоспарын жасап, біліміңді
              бізбен бірге шыңда.
            </p>
          </div>

          {/* Bento-style feature highlights */}
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-[32px] border border-white/50 shadow-sm flex flex-col space-y-4 hover:shadow-xl transition-all duration-500">
              <div className="p-3 bg-secondary/10 text-secondary rounded-2xl w-fit">
                <span className="material-symbols-outlined text-3xl">
                  smart_toy
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-secondary">ЖИ-Ментор</h3>
                <p className="text-sm text-on-surface-variant font-medium">
                  24/7 қолдау көрсететін ақылды көмекші
                </p>
              </div>
            </div>
            <div className="glass-panel p-8 rounded-[32px] border border-white/50 shadow-sm flex flex-col space-y-4 hover:shadow-xl transition-all duration-500">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit">
                <span className="material-symbols-outlined text-3xl">
                  trending_up
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-primary">Прогресс</h3>
                <p className="text-sm text-on-surface-variant font-medium">
                  Оқу нәтижелерін нақты уақытта бақылау
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="flex justify-center md:justify-start animate-in slide-in-from-right-8 duration-1000">
          <section className="glass-panel w-full max-w-md p-10 rounded-[40px] border border-white/60 shadow-2xl shadow-primary/10">
            <div className="mb-10">
              <div className="md:hidden flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined fill-1">school</span>
                </div>
                <span className="text-2xl font-black text-primary tracking-tighter">
                  EduAI
                </span>
              </div>
              <h2 className="text-3xl font-black text-on-surface mb-2">
                Тіркелу
              </h2>
              <p className="text-on-surface-variant font-medium">
                Оқуды бастау үшін деректеріңізді енгізіңіз
              </p>
            </div>

            <RegisterForm error={error} />

            <div className="mt-10 text-center">
              <p className="text-on-surface-variant font-medium">
                Тіркелгіңіз бар ма?{" "}
                <Link
                  className="text-primary font-black hover:underline ml-1"
                  href="/"
                >
                  Кіру
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
