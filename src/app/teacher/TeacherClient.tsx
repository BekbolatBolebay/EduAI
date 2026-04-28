"use client";

import { useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import { createClient } from "@/utils/supabase/client";

export default function TeacherClient({ profile }: { profile: any }) {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
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
        body: JSON.stringify({ subject, grade, topic }),
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
    }
  };

  return (
    <div className="bg-background min-h-screen pb-40">
      <TopAppBar />

      <main className="max-w-[1280px] mx-auto px-6 py-10 animate-in fade-in duration-700">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">Мұғалім панелі</h1>
          <p className="text-on-surface-variant font-medium text-lg">AI көмегімен жаңа тесттер жасаңыз</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-8 rounded-[40px] border border-blue-50 shadow-xl space-y-6">
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
      </main>

      <BottomNavBar />
    </div>
  );
}
