"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BottomNavBar from "@/components/BottomNavBar";
import TopAppBar from "@/components/TopAppBar";
import { signOut } from "../auth/actions";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

type Profile = {
  full_name: string;
  grade: string;
  xp: number;
  streak: number;
  avatar_url?: string;
};

export default function ProfileClient({ 
  profile: initialProfile,
  achievements: initialAchievements,
  testResults: initialTestResults
}: { 
  profile: Profile | null,
  achievements: any[],
  testResults: any[]
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [testResults, setTestResults] = useState(initialTestResults);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.full_name || "");
  const [editGrade, setEditGrade] = useState(profile?.grade || "");
  const [myQuizzes, setMyQuizzes] = useState<any[]>([]);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("community_quizzes")
          .select("*")
          .eq("user_id", user.id);
        if (data) setMyQuizzes(data);
      }
    };
    fetchMyQuizzes();
  }, []);

  const handleUpdateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editName,
        grade: editGrade
      })
      .eq("id", user.id);

    if (!error) {
      setProfile({ ...profile!, full_name: editName, grade: editGrade });
      setIsEditing(false);
      alert("Профиль жаңартылды!");
    } else {
      alert("Қате орын алды");
    }
  };

  return (
    <div className="bg-background min-h-screen pb-40">
      <TopAppBar />

      <main className="max-w-[1280px] mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Profile Section */}
        <div className="glass-panel p-10 rounded-[48px] shadow-2xl border border-blue-50 mb-12 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500">
              <Image
                alt="Avatar"
                className="w-full h-full object-cover"
                width={128}
                height={128}
                src={
                  profile?.avatar_url ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuD2YVeCsfjPdfC5NUk2-VcbqkqVfM5RLXZNUawTzaasH_wJk0Eglke_IvX8vrcXCZwcM-Wbn4Md1n0sFSoOkrpfovJNNziPZM_8LSRTYVSn0FmwSC8g8jOV0vcEEQO6PontW608C4NFRYyP5Di8E7ZvJMGS0BJ9AeWZ-FVUPju2qUD0qaE-XqhK5IUP5m0izS_7XMdXJuClhOD4gyN9GuZYhb_-lSC5DmmBz2DDgH8Y7diWIRpt6SQCwdT_4OkDFFHOwQ3foeEGCwVM"
                }
              />
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-white"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
          </div>

          <div className="text-center md:text-left flex-grow space-y-4">
            <div className="space-y-1">
              <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">
                {profile?.grade || "0"}-сынып оқушысы
              </span>
              <h1 className="text-4xl font-black text-on-surface tracking-tight">
                {profile?.full_name || "Қолданушы"}
              </h1>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-4 py-2 bg-blue-50 text-primary rounded-xl font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg fill-1">verified</span>
                Verified Account
              </div>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg fill-1">workspace_premium</span>
                Premium Member
              </div>
            </div>
          </div>

          <button 
            onClick={() => signOut()}
            className="px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">logout</span>
            Шығу
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl fill-1">local_fire_department</span>
            </div>
            <h3 className="text-4xl font-black text-on-surface">{profile?.streak || 0}</h3>
            <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Күндік рекорд</p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl fill-1">stars</span>
            </div>
            <h3 className="text-4xl font-black text-on-surface">{profile?.xp || 0}</h3>
            <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Жалпы XP</p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl fill-1">emoji_events</span>
            </div>
            <h3 className="text-4xl font-black text-on-surface">{achievements.length}</h3>
            <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Жетістіктер</p>
          </div>
        </div>

        {/* Secondary Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Results History */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">history</span>
              Соңғы нәтижелер
            </h2>
            <div className="space-y-4">
              {testResults.length > 0 ? (
                testResults.map((result) => (
                  <div key={result.id} className="glass-panel p-6 rounded-[28px] border border-slate-100 flex justify-between items-center group bg-white shadow-sm">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-on-surface truncate">{result.test_title}</p>
                      <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
                        {new Date(result.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-4 py-2 rounded-xl font-black ${
                        result.score / result.total_questions >= 0.8 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-blue-50 text-primary"
                      }`}>
                        {result.score} / {result.total_questions}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel p-8 rounded-[40px] border border-slate-100 text-center py-10">
                  <p className="text-on-surface-variant font-medium">Тест нәтижелері әзірге жоқ.</p>
                </div>
              )}
            </div>
          </section>

          {/* Unlocked Badges */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">military_tech</span>
              Жетістіктер жинағы
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((item) => (
                <div key={item.achievements.id} className="glass-panel p-6 rounded-[32px] border border-primary/10 bg-gradient-to-br from-primary/5 to-white text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-2xl fill-1">{item.achievements.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">{item.achievements.title}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium line-clamp-1">{item.achievements.description}</p>
                  </div>
                </div>
              ))}
              {achievements.length === 0 && (
                <div className="col-span-2 glass-panel p-8 rounded-[40px] border border-slate-100 text-center py-10">
                  <p className="text-on-surface-variant font-medium">Медальдар әзірге жоқ. Оқуды жалғастырыңыз!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">article</span>
              Менің жариялаған тесттерім
            </h2>
            <div className="space-y-4">
              {myQuizzes.length > 0 ? (
                myQuizzes.map((quiz) => (
                  <div key={quiz.id} className="glass-panel p-6 rounded-[28px] border border-slate-100 flex justify-between items-center group">
                    <div>
                      <p className="font-bold text-on-surface">{quiz.title}</p>
                      <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
                        {quiz.questions?.length || 0} сұрақ
                      </p>
                    </div>
                    <Link 
                      href={`/tests?id=${quiz.id}`}
                      className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all"
                    >
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="glass-panel p-8 rounded-[40px] border border-slate-100 text-center py-20">
                  <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">pending_actions</span>
                  <p className="text-on-surface-variant font-medium">Квиздер әзірге жоқ. AI-мен жасап көріңіз!</p>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">settings</span>
              Баптаулар
            </h2>
            <div className="space-y-4">
              {["Хабарламалар", "Құпиялылық", "Тіл таңдау", "Көмек"].map((item) => (
                <button 
                  key={item}
                  onClick={() => alert(`${item} бөлімі дайындалуда...`)}
                  className="w-full p-6 bg-white border border-slate-100 rounded-[28px] text-left flex justify-between items-center hover:bg-slate-50 transition-all group"
                >
                  <span className="font-bold text-on-surface">{item}</span>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      <BottomNavBar />

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[48px] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-on-surface">Профильді өңдеу</h3>
              <p className="text-on-surface-variant font-medium">Мәліметтерді жаңартыңыз</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-on-surface-variant uppercase ml-2">Толық аты-жөніңіз</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary outline-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-on-surface-variant uppercase ml-2">Сыныбыңыз</label>
                <select 
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary outline-none font-bold appearance-none"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                    <option key={g} value={g}>{g}-сынып</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleUpdateProfile}
                className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                Сақтау
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-4 bg-slate-100 text-on-surface rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                Болдырмау
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
