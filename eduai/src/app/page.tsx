import Image from "next/image";
import Link from "next/link";
import { login } from "./auth/actions";

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

          <form action={login} className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined">error</span>
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1"
                htmlFor="email"
              >
                Электрондық пошта
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-on-surface"
                  id="email"
                  name="email"
                  placeholder="mysaly@edu.kz"
                  type="email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <label
                  className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider"
                  htmlFor="password"
                >
                  Құпия сөз
                </label>
                <Link
                  className="text-primary text-[11px] font-bold hover:underline transition-all"
                  href="#"
                >
                  Құпия сөзді ұмыттыңыз ба?
                </Link>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest rounded-2xl py-4 pl-12 pr-12 outline-none transition-all font-medium text-on-surface"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  required
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              type="submit"
            >
              <span>Кіру</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10 flex items-center">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="px-4 text-outline text-[11px] font-bold uppercase tracking-widest bg-transparent">
              немесе
            </span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3.5 border border-outline-variant rounded-2xl hover:bg-surface-container-low active:scale-95 transition-all group">
              <Image
                alt="Google icon"
                width={20}
                height={20}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnn13-hHrBIF380ssZfs1-6V_LF8FU2CRsQ7jXSxKtLYmfFnIXS_ftaPq3JgAzhlT7tBJWoSm2e0SW8j_YaLk9w7TBGgTGRoxXBjrqZwH_o4buQokg7zqaAqoOkpHNV0yvQu3-6dM1AOuf2DMBpiNyzLCSLMuwq20fghXnBD4vj61B-D9D7AcsV_13E2rQez_NAZjgzNCjmXHgFAQ9Jycmyy1jYHIT5dSCuKcWm7wYlnh-0Wf8S6fBr2T5H7MKBhUDR5tHDpO8uFVC"
              />
              <span className="font-bold text-on-surface">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3.5 border border-outline-variant rounded-2xl hover:bg-surface-container-low active:scale-95 transition-all group">
              <span className="material-symbols-outlined text-on-surface text-[22px]">
                ios
              </span>
              <span className="font-bold text-on-surface">Apple</span>
            </button>
          </div>
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
