"use client";

import { useState, useEffect } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { QRCodeSVG } from "qrcode.react";

type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_option: number;
};

type Test = {
  id: string;
  title: string;
  questions: Question[];
  type: "standard" | "community";
};

export default function TestsClient({ 
  standardTests, 
  communityTests,
  topUsers,
  communityQuizzesSource
}: { 
  standardTests: Test[], 
  communityTests: Test[],
  topUsers: any[],
  communityQuizzesSource: any[]
}) {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [joinPin, setJoinPin] = useState("");
  const [sessionParticipants, setSessionParticipants] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editQuestions, setEditQuestions] = useState("");
  const searchParams = useSearchParams();
  const [aiFeedback, setAiFeedback] = useState("");
  const [level, setLevel] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  const handleAnswer = (index: number) => {
    if (!selectedTest || selectedTest.questions.length === 0) return;

    const isCorrect = index === selectedTest.questions[currentQuestionIndex].correct_option;
    const newScore = isCorrect ? score + 1 : score;
    
    if (isCorrect) {
      setScore(newScore);
    }

    // Update session participant score in real-time
    if (activeSession) {
      updateSessionScore(newScore, currentQuestionIndex + 1 === selectedTest.questions.length);
    }

    if (currentQuestionIndex + 1 < selectedTest.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
      // Save to global history
      saveTestResult(selectedTest, newScore);
    }
  };

  const saveTestResult = async (test: Test, finalScore: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const percentage = (finalScore / test.questions.length) * 100;
      let determinedLevel = "Бастапқы";
      if (percentage > 80) determinedLevel = "Жоғары";
      else if (percentage > 40) determinedLevel = "Орташа";
      
      setLevel(determinedLevel);

      await supabase.from("test_results").insert({
        user_id: user.id,
        test_id: test.id,
        test_title: test.title,
        score: finalScore,
        total_questions: test.questions.length
      });

      // Fetch AI Feedback
      fetchAiFeedback(test.title, finalScore, test.questions.length, determinedLevel);

      // Simple achievement check for 100% score
      if (finalScore === test.questions.length) {
        const { data: ach } = await supabase.from("achievements").select("id").eq("requirement_type", "test_score").eq("requirement_value", 100).single();
        if (ach) {
          await supabase.from("user_achievements").upsert({ user_id: user.id, achievement_id: ach.id });
        }
      }
    }
  };

  const fetchAiFeedback = async (title: string, score: number, total: number, level: string) => {
    setAiFeedback("AI пікірі дайындалуда...");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Маған "${title}" тесті бойынша кері байланыс бер. Нәтижем: ${score}/${total}. Деңгейім: ${level}. Қысқаша (2-3 сөйлем) мақтау айтып немесе кеңес бер.`
            }
          ]
        })
      });
      const data = await res.json();
      setAiFeedback(data.choices[0].message.content);
    } catch (e) {
      setAiFeedback("Жақсы нәтиже! Оқуды жалғастырыңыз.");
    }
  };



  const startTest = (test: Test) => {
    setSelectedTest(test);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
  };

  // Deep-linking from QR code (Sessions)
  useEffect(() => {
    const sessionId = searchParams.get("session");
    if (sessionId) {
      joinSessionById(sessionId);
    }
  }, [searchParams]);

  // Real-time subscription for session participants
  useEffect(() => {
    if (!activeSession) return;

    // Initial fetch
    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from("session_participants")
        .select(`
          id, 
          score, 
          is_finished, 
          user_id,
          guest_name,
          profiles!user_id(full_name)
        `)
        .eq("session_id", activeSession.id);
      
      if (error) {
        console.error("Session Fetch Error Detail:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Fallback: try without join
        const { data: simpleData } = await supabase
          .from("session_participants")
          .select("id, score, is_finished, user_id")
          .eq("session_id", activeSession.id);
        if (simpleData) setSessionParticipants(simpleData);
      } else {
        setSessionParticipants(data);
      }
    };
    fetchParticipants();

    // Subscribe to changes
    const channel = supabase
      .channel(`session-${activeSession.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_participants',
          filter: `session_id=eq.${activeSession.id}`,
        },
        () => fetchParticipants()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeSession]);

  const [showGuestNameModal, setShowGuestNameModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);

  const joinSessionById = async (id: string) => {
    const { data: session } = await supabase
      .from("test_sessions")
      .select("*")
      .eq("id", id)
      .single();
    
    if (session) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPendingSessionId(id);
        setShowGuestNameModal(true);
        return;
      }
      
      const test = [...standardTests, ...communityTests].find(t => t.id === session.test_id);
      if (test) {
        startTest(test);
        setActiveSession(session);
        await supabase.from("session_participants").upsert({
          session_id: session.id,
          user_id: user.id
        });
      }
    }
  };

  const handleGuestJoin = async () => {
    if (!guestName || !pendingSessionId) return;

    const { data: session } = await supabase
      .from("test_sessions")
      .select("*")
      .eq("id", pendingSessionId)
      .single();

    if (session) {
      const test = [...standardTests, ...communityTests].find(t => t.id === session.test_id);
      if (test) {
        startTest(test);
        setActiveSession(session);
        await supabase.from("session_participants").insert({
          session_id: session.id,
          guest_name: guestName
        });
        setShowGuestNameModal(false);
      }
    }
  };

  const startSession = async (testId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Жүйеге кіріңіз");

    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const { data, error } = await supabase
      .from("test_sessions")
      .insert({
        test_id: testId,
        created_by: user.id,
        pin: pin
      })
      .select()
      .single();

    if (data) {
      setActiveSession(data);
      setShowSessionModal(true);
    }
  };

  const joinByPin = async () => {
    const { data: session } = await supabase
      .from("test_sessions")
      .select("*")
      .eq("pin", joinPin)
      .eq("status", "active")
      .single();

    if (session) {
      joinSessionById(session.id);
      setJoinPin("");
    } else {
      alert("PIN қате немесе сессия жабылған");
    }
  };

  const deleteQuiz = async (id: string) => {
    if (!confirm("Бұл квизді өшіргіңіз келе ме?")) return;
    const { error } = await supabase.from("community_quizzes").delete().eq("id", id);
    if (!error) {
      window.location.reload();
    } else {
      alert("Өшіру мүмкін болмады");
    }
  };

  const openEditModal = (quiz: any) => {
    const raw = communityQuizzesSource.find(q => q.id === quiz.id);
    if (raw) {
      setEditingQuiz(raw);
      setEditTitle(raw.title);
      setEditQuestions(JSON.stringify(raw.questions, null, 2));
    }
  };

  const saveQuiz = async () => {
    try {
      const parsed = JSON.parse(editQuestions);
      const { error } = await supabase
        .from("community_quizzes")
        .update({
          title: editTitle,
          questions: parsed
        })
        .eq("id", editingQuiz.id);

      if (error) throw error;
      alert("Өзгерістер сәтті сақталды!");
      window.location.reload();
    } catch (e) {
      alert("JSON форматы қате немесе сақтау мүмкін болмады");
    }
  };

  const updateSessionScore = async (finalScore: number, isFinished: boolean = false) => {
    try {
      if (!activeSession) return;
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase.from("session_participants").update({
        score: finalScore,
        is_finished: isFinished
      }).eq("session_id", activeSession.id);

      if (user) {
        query = query.eq("user_id", user.id);
      } else if (guestName) {
        query = query.eq("guest_name", guestName);
      }

      await query;
    } catch (e) {
      console.error(e);
    }
  };

  const allTests = [...standardTests, ...communityTests];

  return (
    <div className={`bg-background min-h-screen ${activeSession ? 'pb-10' : 'pb-32'}`}>
      {!activeSession && <TopAppBar />}

      <main className="max-w-[1280px] mx-auto px-6 py-10 animate-in fade-in duration-700">
        {!selectedTest ? (
          <section className="space-y-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-black text-on-surface tracking-tight">
                  Білімді тексеру
                </h1>
                <p className="text-on-surface-variant font-medium text-lg">
                  Курстар бойынша дайын тесттерді тапсырып, деңгейіңізді анықтаңыз.
                </p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="PIN: 123456"
                  value={joinPin}
                  onChange={(e) => setJoinPin(e.target.value)}
                  className="px-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary outline-none font-bold w-full md:w-[150px]"
                />
                <button 
                  onClick={joinByPin}
                  className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all"
                >
                  Қосылу
                </button>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-500 fill-1">workspace_premium</span>
                Үздік қатысушылар
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                {topUsers.map((user, idx) => (
                  <div 
                    key={idx}
                    className={`flex-shrink-0 w-[240px] p-6 rounded-[32px] border transition-all duration-300 ${
                      idx === 0 
                        ? "bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-xl shadow-primary/20 scale-105 border-transparent" 
                        : "bg-white border-slate-100 shadow-sm hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${
                          idx === 0 ? "bg-white/20" : "bg-primary/10 text-primary"
                        }`}>
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            user.full_name?.[0] || "?"
                          )}
                        </div>
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-md ${
                          idx === 0 ? "bg-amber-400 text-amber-900" : "bg-slate-800 text-white"
                        }`}>
                          #{idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-black truncate ${idx === 0 ? "text-white" : "text-on-surface"}`}>
                          {user.full_name || "Жасырын қолданушы"}
                        </p>
                        <p className={`text-xs font-bold ${idx === 0 ? "text-white/70" : "text-on-surface-variant"}`}>
                          {user.xp || 0} XP жинады
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Tests */}
            <div className="space-y-8">
              <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">school</span>
                Ресми тесттер
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {standardTests.length > 0 ? (
                  standardTests.map((test) => (
                    <div
                      key={test.id}
                      className="glass-panel p-8 rounded-[40px] border border-blue-50 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group"
                    >
                      <div className="space-y-6">
                        <div className="w-16 h-16 bg-primary-container text-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                          <span className="material-symbols-outlined text-3xl fill-1">quiz</span>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-on-surface line-clamp-2">{test.title}</h3>
                          <p className="text-on-surface-variant font-medium">{test.questions.length} сұрақ</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startTest(test)}
                            className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                          >
                            Бастау
                          </button>
                          <button
                            onClick={() => startSession(test.id)}
                            className="w-14 h-14 bg-primary-container text-primary rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                            title="Сессия бастау"
                          >
                            <span className="material-symbols-outlined font-black">groups</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-outline italic">Тесттер әзірге жоқ...</p>
                )}
              </div>
            </div>

            {/* Community/AI Quizzes */}
            <div className="space-y-8">
              <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">smart_toy</span>
                AI-мен жасалған тесттер
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {communityTests.length > 0 ? (
                  communityTests.map((test) => (
                    <div
                      key={test.id}
                      className="glass-panel p-8 rounded-[40px] border border-emerald-50 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 group bg-emerald-50/10"
                    >
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <span className="material-symbols-outlined text-3xl fill-1">bolt</span>
                          </div>
                          {(currentUser?.id === (communityQuizzesSource?.find(q => q.id === test.id)?.user_id)) && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => openEditModal(test)}
                                className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                              >
                                <span className="material-symbols-outlined text-xl">edit</span>
                              </button>
                              <button 
                                onClick={() => deleteQuiz(test.id)}
                                className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                              >
                                <span className="material-symbols-outlined text-xl">delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-on-surface line-clamp-2">{test.title}</h3>
                          <p className="text-emerald-600/70 font-bold text-xs uppercase tracking-widest">
                            {currentUser?.id === (communityQuizzesSource?.find(q => q.id === test.id)?.user_id) ? 'Сіздің квизіңіз' : 'Community Quiz'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startTest(test)}
                            className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all"
                          >
                            Бастау
                          </button>
                          <button
                            onClick={() => startSession(test.id)}
                            className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                            title="Сессия бастау"
                          >
                            <span className="material-symbols-outlined font-black">groups</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-outline italic">Жарияланған тесттер жоқ...</p>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="max-w-2xl mx-auto space-y-10">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedTest(null)}
                className="flex items-center gap-2 text-primary font-black hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Артқа қайту
              </button>
              <span className="text-sm font-black text-outline uppercase tracking-widest">
                Сұрақ {currentQuestionIndex + 1} / {selectedTest.questions.length}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 w-full space-y-6">
                {!isFinished ? (
                  <div className="glass-panel p-10 rounded-[40px] shadow-2xl border border-primary/10 animate-in slide-in-from-bottom-4">
                    <h2 className="text-2xl font-black text-on-surface mb-10 leading-tight">
                      {selectedTest.questions[currentQuestionIndex].question_text}
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedTest.questions[currentQuestionIndex].options.map(
                        (option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="w-full p-5 text-left rounded-2xl border-2 border-slate-100 hover:border-primary hover:bg-primary/5 font-medium text-on-surface transition-all flex items-center gap-4 group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-on-primary transition-all">
                              {String.fromCharCode(65 + idx)}
                            </div>
                            {option}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel p-10 rounded-[48px] shadow-2xl border border-primary/10 text-center space-y-10 animate-in zoom-in-95 bg-white relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
                    
                    <div className="relative z-10 space-y-6">
                      <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-200 animate-bounce">
                        <span className="material-symbols-outlined text-5xl">
                          emoji_events
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-center gap-3">
                          <span className="px-5 py-2 bg-blue-50 text-primary rounded-2xl font-black text-xs uppercase tracking-widest border border-blue-100">
                            {level} деңгей
                          </span>
                          <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-emerald-100">
                            {Math.round((score / selectedTest.questions.length) * 100)}% Нәтиже
                          </span>
                        </div>
                        <h2 className="text-5xl font-black text-on-surface tracking-tighter">
                          {score} <span className="text-xl text-outline">/ {selectedTest.questions.length}</span>
                        </h2>
                      </div>
                    </div>

                    {/* AI Feedback Section */}
                    <div className="relative p-8 bg-gradient-to-br from-slate-50 to-white rounded-[40px] border-2 border-primary/5 text-left space-y-4 shadow-inner group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary text-on-primary rounded-lg flex items-center justify-center animate-pulse">
                          <span className="material-symbols-outlined text-sm fill-1">auto_awesome</span>
                        </div>
                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">AI Ментордың ұсынысы</span>
                      </div>
                      <p className="text-lg font-bold text-on-surface-variant leading-relaxed">
                        "{aiFeedback}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <button
                        onClick={() => startTest(selectedTest)}
                        className="py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                      >
                        Қайта тапсыру
                      </button>
                      <button
                        onClick={() => { setSelectedTest(null); setActiveSession(null); }}
                        className="py-5 bg-white border-2 border-slate-100 rounded-3xl font-black text-on-surface hover:bg-slate-50 transition-all active:scale-95"
                      >
                        Мәзірге қайту
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Session Leaderboard Sidebar */}
              {activeSession && (
                <div className="w-full lg:w-[320px] glass-panel p-8 rounded-[40px] border border-primary/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary fill-1">monitoring</span>
                      Live Rating
                    </h3>
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase animate-pulse">
                      Live
                    </div>
                  </div>
                  <div className="space-y-3">
                    {sessionParticipants.sort((a, b) => b.score - a.score).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-white text-slate-400'}`}>
                            {idx + 1}
                          </div>
                          <p className="font-bold text-sm truncate text-on-surface">
                            {p.profiles?.full_name || p.guest_name || "Оқушы"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-primary">{p.score}</span>
                          {p.is_finished && (
                            <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {sessionParticipants.length === 0 && (
                      <p className="text-center text-xs text-outline italic py-4">Оқушылар күтілуде...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {!activeSession && <BottomNavBar />}

      {/* Session Modal */}
      {showSessionModal && activeSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[48px] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-on-surface">Сессия басталды!</h3>
              <p className="text-on-surface-variant font-medium">Оқушыларға PIN кодты немесе QR-ды көрсетіңіз</p>
            </div>

            <div className="bg-primary/5 p-8 rounded-[40px] border-2 border-primary/10 space-y-6 text-center">
              <div className="space-y-1">
                <p className="text-xs font-black text-primary uppercase tracking-widest">Кіру коды (PIN)</p>
                <p className="text-6xl font-black text-primary tracking-tighter">{activeSession.pin}</p>
              </div>
              
              <div className="flex justify-center p-4 bg-white rounded-3xl shadow-sm border border-primary/5">
                <QRCodeSVG value={`${window.location.origin}/tests?session=${activeSession.id}`} size={200} />
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  const test = allTests.find(t => t.id === activeSession.test_id);
                  if (test) startTest(test);
                  setShowSessionModal(false);
                }}
                className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                Тестке өту
              </button>
              <button 
                onClick={() => { setShowSessionModal(false); setActiveSession(null); }}
                className="w-full py-4 bg-slate-100 text-on-surface rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                Жабу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingQuiz && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[48px] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh]">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-on-surface">Квизді өңдеу</h3>
              <p className="text-on-surface-variant font-medium">Мәліметтерді өзгертіп, сақтаңыз</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-on-surface-variant uppercase ml-2">Тақырыбы</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary outline-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-on-surface-variant uppercase ml-2">Сұрақтар (JSON)</label>
                <textarea 
                  value={editQuestions}
                  onChange={(e) => setEditQuestions(e.target.value)}
                  rows={10}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary outline-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={saveQuiz}
                className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                Сақтау
              </button>
              <button 
                onClick={() => setEditingQuiz(null)}
                className="flex-1 py-4 bg-slate-100 text-on-surface rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                Болдырмау
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Name Modal */}
      {showGuestNameModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[48px] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-on-surface">Қош келдіңіз!</h3>
              <p className="text-on-surface-variant font-medium">Тестке қатысу үшін есіміңізді жазыңыз</p>
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Есіміңіз..."
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary outline-none font-bold"
              />
              <button 
                onClick={handleGuestJoin}
                className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Бастау
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
