import Image from "next/image";
import Link from "next/link";
import { login } from "./auth/actions";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const error = (await searchParams).error;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[80px] animate-pulse"></div>

      <main className="w-full max-w-[480px] z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Brand Identity */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-container text-on-primary-container rounded-3xl mb-6 shadow-xl shadow-primary/20 transition-transform hover:scale-110 duration-500">
            <span className="material-symbols-outlined text-[40px]">school</span>
          </div>
          <h1 className="text-5xl font-extrabold text-primary tracking-tighter mb-2">
            EduAI
          </h1>
          <p className="text-on-surface-variant font-medium">
            Болашақ білім берудің жасанды интеллектісі
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,69,141,0.12)]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-2">
              Қош келдіңіз!
            </h2>
            <p className="text-on-surface-variant">
              Жүйеге кіру үшін деректеріңізді енгізіңіз
            </p>
          </div>

          <LoginForm error={error} />
        </div>

        {/* Footer Links */}
        <div className="text-center pt-4">
          <p className="text-on-surface-variant font-medium">
            Тіркелген жоқсыз ба?{" "}
            <Link
              className="text-primary font-extrabold hover:underline ml-1 decoration-2"
              href="/register"
            >
              Жаңа аккаунт ашу
            </Link>
          </p>
        </div>
      </main>

      {/* Bottom accent line */}
      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary-container"></div>
    </div>
  );
}
