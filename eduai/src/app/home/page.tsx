import { createClient } from "@/utils/supabase/server";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  // Fetch profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch courses (limit to 2 for dashboard)
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .limit(2);

  return (
    <div className="bg-background min-h-screen pb-32">
      <TopAppBar />

      <main className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8 animate-in fade-in duration-700">
        {/* Welcome Hero Section */}
        <section className="mb-10 relative overflow-hidden rounded-[40px] p-10 bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary shadow-2xl shadow-primary/30 group">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Қайырлы күн, {profile?.full_name || "Оқушы"}! 👋
              </h1>
              <p className="text-lg md:text-xl opacity-90 font-medium leading-relaxed">
                Бүгін жаңа білім алуға тамаша күн. Оқу жоспарыңды жалғастыруға дайынсың ба?
              </p>
            </div>
            <Link 
              href="/catalog"
              className="inline-flex bg-white text-primary px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-50 transition-all active:scale-95 items-center gap-3 group/btn"
            >
              <span className="material-symbols-outlined text-[28px] group-hover/btn:rotate-12 transition-transform">
                play_circle
              </span>
              Сабақты бастау
            </Link>
          </div>
          <div className="absolute right-[-40px] bottom-[-40px] opacity-10 md:opacity-100 md:right-10 md:bottom-[-20px] w-80 h-80 transition-transform duration-700 group-hover:scale-110">
            <Image
              className="w-full h-full object-contain"
              width={320}
              height={320}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8ocwz0lHoMbAb1GQDfpvojkM4k8l9jjQxbN2LPSIDuwNVRCqMxfOz54wqTDSjjBY4P3ziwnuuDPAWmY6rMPUqyFbrNkmf9vxLUbCGLYg_Gy0yp1camwruagN55rzZ3WxzQRo8FqHZNRF8d2dpMxgAVeCliVkWcUpEGefv4_tHMh5IaBG7v0tjNHffKGiLPaq7zhm8WOZJVM05xIXg-YIcjmoYk64NF4lBwKIbZzu1OcDuJu_QaFmpR72oiMKyPawdZ8FyOWNBmh_4"
              alt="Mascot"
            />
          </div>
        </section>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="glass-panel p-8 rounded-[32px] shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl shadow-inner">
                <span className="material-symbols-outlined text-3xl fill-1">
                  local_fire_department
                </span>
              </div>
              <span className="text-xs font-black text-outline uppercase tracking-widest">
                Streak
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-on-surface mb-1">{profile?.streak || 0} Күн</h3>
              <p className="text-on-surface-variant font-medium">
                Тамаша нәтиже! Тоқтатпаңыз.
              </p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[32px] shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl shadow-inner">
                <span className="material-symbols-outlined text-3xl fill-1">
                  stars
                </span>
              </div>
              <span className="text-xs font-black text-outline uppercase tracking-widest">
                XP Points
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-on-surface mb-1">
                {profile?.xp || 0} XP
              </h3>
              <p className="text-on-surface-variant font-medium">
                Апталық рейтингте жақсы орын
              </p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[32px] shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl shadow-inner">
                <span className="material-symbols-outlined text-3xl fill-1">
                  check_circle
                </span>
              </div>
              <span className="text-xs font-black text-outline uppercase tracking-widest">
                Progress
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="text-3xl font-black text-on-surface">0%</h3>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  +0% бүгін
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                <div className="bg-emerald-500 h-full w-[0%] rounded-full transition-all duration-1000"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-on-surface tracking-tight">
                Ағымдағы курстар
              </h2>
              <Link
                href="/catalog"
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Барлығын көру
              </Link>
            </div>

            <div className="space-y-6">
              {courses?.map((course) => (
                <div key={course.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex gap-6 group hover:shadow-xl hover:border-primary/20 transition-all duration-500">
                  <div className="w-28 h-28 rounded-[24px] overflow-hidden flex-shrink-0 bg-blue-50 relative">
                    <Image
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      width={112}
                      height={112}
                      src={course.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                      alt={course.title}
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-center gap-3">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                      {course.subject} • {course.grade} СЫНЫП
                    </span>
                    <h4 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-grow bg-slate-100 h-2 rounded-full shadow-inner">
                        <div className="bg-primary h-full w-[0%] rounded-full transition-all duration-500"></div>
                      </div>
                      <span className="text-sm font-black text-slate-500">
                        0%
                      </span>
                    </div>
                  </div>
                  <Link 
                    href={`/lessons/${course.id}`}
                    className="self-center w-14 h-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary group-hover:rotate-12 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-3xl">
                      play_arrow
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-tertiary/10 text-tertiary rounded-xl">
                <span className="material-symbols-outlined fill-1">
                  auto_awesome
                </span>
              </div>
              <h2 className="text-xl font-black text-on-surface tracking-tight">
                AI Ұсыныстар
              </h2>
            </div>

            <div className="bg-gradient-to-br from-tertiary-container/10 to-white p-8 rounded-[32px] border border-tertiary/10 shadow-lg shadow-tertiary/5 group/ai">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-tertiary group-hover/ai:rotate-12 transition-transform">
                  <span className="material-symbols-outlined fill-1">
                    lightbulb
                  </span>
                </div>
                <p className="text-lg font-bold text-on-tertiary-container leading-tight">
                  Python-нан жаңа сабақ шықты!
                </p>
              </div>
              <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
                Бүгін "Айнымалылар мен деректер типтері" тақырыбын бастауды ұсынамын.
              </p>
              <Link href="/chat" className="block w-full bg-tertiary text-on-tertiary py-4 rounded-2xl font-black text-center hover:bg-tertiary-container transition-all active:scale-95 shadow-lg shadow-tertiary/20">
                Ментормен сөйлесу
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
