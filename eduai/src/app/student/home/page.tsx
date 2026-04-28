import { createClient } from "@/utils/supabase/server";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentHomePage() {
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

  if (profile?.role === "teacher" || profile?.role === "admin") {
    return redirect("/home"); // This will trigger the redirect route
  }

  // Fetch teacher assignments (from community_quizzes for now)
  const { data: teacherQuizzes } = await supabase
    .from("community_quizzes")
    .select("*, profiles!user_id(full_name)")
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch user progress
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id);

  const { data: allCourses } = await supabase
    .from("courses")
    .select("*")
    .limit(3);

  return (
    <div className="bg-background min-h-screen pb-32">
      <TopAppBar />

      <main className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8 animate-in fade-in duration-700">
        {/* Welcome Hero Section */}
        <section className="mb-10 relative overflow-hidden rounded-[40px] p-10 bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary shadow-2xl shadow-primary/30 group">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-2">
                Student Dashboard
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Сәлем, {profile?.full_name?.split(" ")[0] || "Оқушы"}! 👋
              </h1>
              <p className="text-lg md:text-xl opacity-90 font-medium leading-relaxed">
                Бүгін мұғалімдерің жаңа тапсырмалар дайындап қойды. Білім алуды жалғастырамыз ба?
              </p>
            </div>
            <Link 
              href="/catalog"
              className="inline-flex bg-white text-primary px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-50 transition-all active:scale-95 items-center gap-3 group/btn"
            >
              <span className="material-symbols-outlined text-[28px] group-hover/btn:rotate-12 transition-transform">
                explore
              </span>
              Каталогты ашу
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
                <span className="material-symbols-outlined text-3xl fill-1">local_fire_department</span>
              </div>
              <span className="text-[10px] font-black text-outline uppercase tracking-widest">Streak</span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-on-surface mb-1">{profile?.streak || 0} Күн</h3>
              <p className="text-on-surface-variant font-medium">Күнделікті белсенділік</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[32px] shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl shadow-inner">
                <span className="material-symbols-outlined text-3xl fill-1">stars</span>
              </div>
              <span className="text-[10px] font-black text-outline uppercase tracking-widest">XP Level</span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-on-surface mb-1">{profile?.xp || 0} XP</h3>
              <p className="text-on-surface-variant font-medium">Сіздің деңгейіңіз</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[32px] shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl shadow-inner">
                <span className="material-symbols-outlined text-3xl fill-1">verified</span>
              </div>
              <span className="text-[10px] font-black text-outline uppercase tracking-widest">Completed</span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-on-surface mb-1">{userProgress?.filter(p => p.progress_percent === 100).length || 0} Курс</h3>
              <p className="text-on-surface-variant font-medium">Аяқталған сабақтар</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Teacher Assignments Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">assignment</span>
                  Мұғалім тапсырмалары
                </h2>
                <Link href="/tests" className="text-primary font-bold hover:underline">Барлығы</Link>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {teacherQuizzes && teacherQuizzes.length > 0 ? (
                  teacherQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white p-8 rounded-[32px] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-xl transition-all group">
                      <div className="flex items-center gap-6 w-full">
                        <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                          <span className="material-symbols-outlined text-3xl">school</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-on-surface mb-1">{quiz.title}</h4>
                          <p className="text-sm text-on-surface-variant font-medium">
                            Мұғалім: <span className="text-primary font-bold">{quiz.profiles?.full_name || "EduAI Сарапшысы"}</span>
                          </p>
                        </div>
                      </div>
                      <Link 
                        href={`/tests?id=${quiz.id}`}
                        className="w-full md:w-auto px-10 py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all text-center"
                      >
                        Тапсырманы орындау
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center glass-panel rounded-[40px] border-dashed border-2 border-slate-200">
                    <p className="text-on-surface-variant font-medium">Қазірше жаңа тапсырмалар жоқ.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Courses Progress */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">menu_book</span>
                Менің курстарым
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {allCourses?.map(course => {
                  const progress = userProgress?.find(p => p.course_id === course.id)?.progress_percent || 0;
                  return (
                    <div key={course.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex gap-6 hover:shadow-lg transition-all group">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                        <img src={course.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-grow flex flex-col justify-center space-y-3">
                        <h4 className="text-lg font-bold">{course.title}</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                          </div>
                          <span className="text-xs font-black text-slate-500">{progress}%</span>
                        </div>
                      </div>
                      <Link href={`/lessons/${course.id}`} className="self-center w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all">
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-10">
            {/* AI Recommendation Card */}
            <div className="bg-gradient-to-br from-tertiary via-tertiary-container to-white p-8 rounded-[40px] shadow-2xl shadow-tertiary/20 text-on-tertiary-container group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/30 backdrop-blur-md rounded-2xl group-hover:rotate-12 transition-transform">
                  <span className="material-symbols-outlined fill-1">auto_awesome</span>
                </div>
                <h3 className="text-xl font-black">AI Кеңес</h3>
              </div>
              <p className="text-lg font-bold leading-tight mb-4">
                Математикадан "Квадрат теңдеулер" тақырыбын қайталауды ұсынамын!
              </p>
              <p className="text-sm opacity-80 mb-8 font-medium leading-relaxed">
                Соңғы тестіңіздің нәтижесі бойынша осы тақырыпты нығайту сізге жоғары XP береді.
              </p>
              <Link href="/tests" className="block w-full py-4 bg-tertiary text-on-tertiary rounded-2xl font-black text-center shadow-lg hover:brightness-110 transition-all">
                Тапсырмаға өту
              </Link>
            </div>

            {/* Achievement Preview */}
            <div className="glass-panel p-8 rounded-[40px] border border-slate-100 space-y-6">
              <h3 className="text-lg font-black text-on-surface">Соңғы жетістік</h3>
              <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="w-12 h-12 bg-amber-400 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined fill-1">workspace_premium</span>
                </div>
                <div>
                  <p className="font-bold text-amber-900">Жас зерттеуші</p>
                  <p className="text-[10px] font-bold text-amber-700 uppercase">Unlocked</p>
                </div>
              </div>
              <Link href="/profile" className="block text-center text-sm font-bold text-primary hover:underline">Барлық марапаттарды көру</Link>
            </div>
          </aside>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
