"use client";

import { useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function TeacherDashboardClient({ profile, myQuizzes, totalStudents }: { profile: any, myQuizzes: any[], totalStudents: number }) {
  const [isGeneratingMode, setIsGeneratingMode] = useState(false);
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<any[] | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  
  const supabase = createClient();

  const handleGenerate = async () => {
    if (!subject || !grade || !topic) return alert("Барлық өрістерді толтырыңыз");
    
    setIsGenerating(true);
    setGeneratedQuiz(null);
    
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, grade, topic, count }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setGeneratedQuiz(data);
      setQuizTitle(`${subject} - ${topic} (${grade}-сынып)`);
    } catch (error: any) {
      alert("Қате: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedQuiz || !quizTitle) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Жүйеге кіріңіз");

    const { error } = await supabase.from("community_quizzes").insert({
      user_id: user.id,
      title: quizTitle,
      questions: generatedQuiz,
    });

    if (error) {
      alert("Жариялау кезінде қате кетті: " + error.message);
    } else {
      alert("Тест сәтті жарияланды!");
      setGeneratedQuiz(null);
      setSubject("");
      setGrade("");
      setTopic("");
      setIsGeneratingMode(false);
      window.location.reload(); // Refresh to show new quiz
    }
  };

  return (
    <div className="bg-background min-h-screen pb-40">
      <TopAppBar />

      <main className="max-w-[1280px] mx-auto px-6 py-10 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">Мұғалім панелі</h1>
            <p className="text-on-surface-variant font-medium text-lg">Оқушылардың үлгерімін бақылау және тапсырмалар дайындау</p>
          </div>
          <button 
            onClick={() => setIsGeneratingMode(!isGeneratingMode)}
            className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined">{isGeneratingMode ? "dashboard" : "auto_awesome"}</span>
            {isGeneratingMode ? "Дашбордқа оралу" : "Жаңа тест жасау (AI)"}
          </button>
        </div>

        {!isGeneratingMode ? (
          <div className="space-y-12 animate-in zoom-in-95 duration-500">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined fill-1">groups</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black">{totalStudents}</h3>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Жалпы оқушы</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined fill-1">quiz</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black">{myQuizzes.length}</h3>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Жарияланған тест</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined fill-1">trending_up</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black">84%</h3>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Орташа үлгерім</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined fill-1">schedule</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black">{myQuizzes.reduce((acc, q) => acc + (q.test_results?.[0]?.count || 0), 0)}</h3>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Жалпы тапсыру</p>
                </div>
              </div>
            </div>

            {/* Quizzes Management */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">list_alt</span>
                Менің тапсырмаларым
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myQuizzes.map(quiz => (
                  <div key={quiz.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xl font-bold text-on-surface line-clamp-1">{quiz.title}</h4>
                        <button className="text-slate-300 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      <div className="flex gap-4">
                        <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-black uppercase tracking-widest">
                          {quiz.questions?.length || 0} сұрақ
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-primary rounded-lg text-xs font-black uppercase tracking-widest">
                          {quiz.test_results?.[0]?.count || 0} тапсыру
                        </span>
                      </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <Link 
                        href={`/tests?id=${quiz.id}`}
                        className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-center hover:bg-slate-200 transition-all"
                      >
                        Көру
                      </Link>
                      <button className="flex-1 py-3 bg-blue-50 text-primary rounded-xl font-bold hover:bg-primary hover:text-on-primary transition-all">
                        Статистика
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-8 duration-700">
            {/* Form Side (Same as before but integrated) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel p-8 rounded-[40px] border border-blue-50 shadow-xl space-y-6">
                <h3 className="text-2xl font-black">Тест құрастыру</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase ml-2">Пән</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Мысалы: Физика"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase ml-2">Сынып</label>
                    <select 
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary outline-none font-bold appearance-none"
                    >
                      <option value="">Таңдаңыз</option>
                      {[5,6,7,8,9,10,11].map(g => (
                        <option key={g} value={g}>{g}-сынып</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase ml-2">Тақырып</label>
                    <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Мысалы: Ньютон заңдары"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase ml-2">Сұрақтар саны</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 15, 20].map(n => (
                        <button
                          key={n}
                          onClick={() => setCount(n)}
                          className={`py-3 rounded-xl font-bold text-sm transition-all ${
                            count === n ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`w-full py-5 rounded-2xl font-black text-on-primary shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                    isGenerating ? "bg-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-primary to-primary-container shadow-primary/20 hover:scale-[1.02]"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      Генерациялануда...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined fill-1">auto_awesome</span>
                      AI Генерация
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Result Side */}
            <div className="lg:col-span-2">
              {generatedQuiz ? (
                <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                  <div className="glass-panel p-10 rounded-[48px] border border-emerald-50 shadow-2xl bg-gradient-to-br from-emerald-50/20 to-white">
                    <div className="flex justify-between items-center mb-8">
                      <input 
                        type="text" 
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        className="text-2xl font-black text-on-surface bg-transparent border-b-2 border-emerald-200 focus:border-emerald-500 outline-none flex-1 mr-4"
                      />
                      <div className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-xl font-black text-xs uppercase">
                        AI Generated
                      </div>
                    </div>

                    <div className="space-y-8">
                      {generatedQuiz.map((q, idx) => (
                        <div key={idx} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                          <h4 className="text-lg font-bold text-on-surface flex gap-3">
                            <span className="text-primary">{idx + 1}.</span>
                            {q.question}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((opt: string, oIdx: number) => (
                              <div 
                                key={oIdx} 
                                className={`p-4 rounded-2xl border-2 font-medium ${
                                  q.correct === oIdx ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-50 bg-slate-50 text-slate-500"
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handlePublish}
                      className="w-full mt-10 py-5 bg-emerald-600 text-white rounded-3xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Жариялау
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] glass-panel rounded-[48px] border-dashed border-4 border-slate-100 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl">smart_toy</span>
                  </div>
                  <h3 className="text-2xl font-black text-on-surface mb-2">Генерация күтілуде</h3>
                  <p className="text-on-surface-variant font-medium max-w-sm">
                    Сол жақтағы нысанды толтырып, "AI Генерация" батырмасын басыңыз. Біздің ментор сізге дайын тест дайындап береді.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
}
