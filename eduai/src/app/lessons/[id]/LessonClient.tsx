"use client";

import { useState, useEffect } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

type Lesson = {
  id: string;
  title: string;
  content: string;
  video_url?: string;
  order_index: number;
};

type Course = {
  id: string;
  title: string;
  subject: string;
  lessons: Lesson[];
};

const getEmbedUrl = (url: string) => {
  if (!url) return null;
  if (url.includes("embed")) return url;
  
  let videoId = "";
  if (url.includes("v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export default function LessonClient({ course }: { course: Course }) {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  
  // Fallback demo lessons if DB is empty
  const fallbackLessons: Lesson[] = [
    {
      id: "demo-1",
      title: "Python-ға кіріспе",
      content: "Бұл сабақта біз Python бағдарламалау тілінің негіздерімен танысамыз. Айнымалылар, деректер типтері және алғашқы бағдарламамызды жазуды үйренеміз.",
      video_url: "https://www.youtube.com/embed/jBzwzrDvZ18",
      order_index: 1
    },
    {
      id: "demo-2",
      title: "Циклдер мен Шарттар",
      content: "Бағдарламалаудың ең маңызды бөлігі - логикалық шарттар (if/else) және қайталану циклдері (for/while).",
      video_url: "https://www.youtube.com/embed/8vBZZ5F-0vA",
      order_index: 2
    }
  ];

  const lessons = (course.lessons && course.lessons.length > 0) ? course.lessons : fallbackLessons;
  const activeLesson = lessons[activeLessonIndex];
  const supabase = createClient();

  useEffect(() => {
    if (lessons.length === 0) return;
    const updateProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const progress = Math.round(((activeLessonIndex + 1) / course.lessons.length) * 100);

      await supabase.from("user_progress").upsert({
        user_id: user.id,
        course_id: course.id,
        progress_percent: progress,
        last_accessed: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' });
    };

    updateProgress();
  }, [activeLessonIndex, course.id, course.lessons.length]);

  return (
    <div className="bg-background min-h-screen pb-32">
      <TopAppBar />

      <main className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar: Lesson List */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="mb-6">
            <Link href="/catalog" className="flex items-center gap-2 text-primary font-black mb-4 hover:underline">
              <span className="material-symbols-outlined">arrow_back</span>
              Каталогқа қайту
            </Link>
            <h1 className="text-3xl font-black text-on-surface tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-sm font-black text-outline uppercase tracking-widest mt-2">
              {course.subject} • {lessons.length} Сабақ
            </p>
          </div>

          <div className="space-y-4">
            {lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonIndex(index)}
                  className={`w-full p-6 rounded-[24px] text-left transition-all flex items-center gap-4 ${
                    activeLessonIndex === index
                      ? "bg-primary text-on-primary shadow-xl shadow-primary/20 scale-[1.02]"
                      : "bg-white border border-slate-100 hover:border-primary/20 text-on-surface"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                    activeLessonIndex === index ? "bg-white/20" : "bg-slate-50 text-slate-400"
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-bold">{lesson.title}</span>
                </button>
              ))
            ) : (
              <div className="p-10 text-center glass-panel rounded-[32px] border-dashed border-2 border-slate-200">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">auto_stories</span>
                <p className="text-sm text-on-surface-variant font-medium">Сабақтар әлі қосылмаған</p>
              </div>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-8 space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000">
          {activeLesson ? (
            <>
              <div className="glass-panel p-12 rounded-[48px] shadow-2xl border border-white/50 relative overflow-hidden group/content">
                {/* Decorative background for content */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 group-hover/content:bg-primary/10 transition-colors duration-1000"></div>
                
                <div className="flex justify-between items-start mb-10">
                  <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
                    {activeLesson.title}
                  </h2>
                  <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Learning
                  </div>
                </div>
                
                {/* Premium Video Player */}
                {activeLesson.video_url && (
                  <div className="mb-12 aspect-video rounded-[40px] overflow-hidden shadow-[0_30px_100px_rgba(0,69,141,0.25)] border-[6px] border-white relative group/video">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10 opacity-0 group-hover/video:opacity-100 transition-opacity duration-500"></div>
                    <iframe
                      width="100%"
                      height="100%"
                      src={getEmbedUrl(activeLesson.video_url) || ""}
                      title={activeLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="relative z-0"
                    ></iframe>
                  </div>
                )}

                <div className="prose prose-lg prose-blue max-w-none">
                  <p className="text-xl text-on-surface-variant leading-relaxed font-medium whitespace-pre-wrap">
                    {activeLesson.content}
                  </p>
                </div>

                {/* Lesson Footer Info */}
                <div className="mt-16 pt-10 border-t border-slate-100 flex flex-wrap gap-6 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
                      <span className="material-symbols-outlined fill-1">verified_user</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-outline uppercase tracking-widest">Курс авторы</p>
                      <p className="font-bold text-on-surface">EduAI Сарапшылары</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all">
                      <span className="material-symbols-outlined">share</span>
                    </button>
                    <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all">
                      <span className="material-symbols-outlined">bookmark</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center gap-8">
                <button 
                  disabled={activeLessonIndex === 0}
                  onClick={() => setActiveLessonIndex(prev => prev - 1)}
                  className="flex-1 py-6 px-10 rounded-[28px] bg-white border-2 border-slate-100 font-black text-on-surface hover:border-primary hover:text-primary transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-sm"
                >
                  <span className="material-symbols-outlined text-3xl">chevron_left</span>
                  Алдыңғы сабақ
                </button>
                <button 
                  disabled={lessons.length <= 1 || activeLessonIndex === lessons.length - 1}
                  onClick={() => setActiveLessonIndex(prev => prev + 1)}
                  className="flex-1 py-6 px-10 rounded-[28px] bg-primary text-on-primary font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] hover:bg-primary-container active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                >
                  Келесі сабақ
                  <span className="material-symbols-outlined text-3xl">chevron_right</span>
                </button>
              </div>
            </>
          ) : (
            <div className="h-[600px] glass-panel rounded-[48px] flex flex-col items-center justify-center text-center p-10 border-dashed border-4 border-slate-100 animate-in zoom-in-95 duration-700">
              <div className="w-32 h-32 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-7xl">play_circle</span>
              </div>
              <h2 className="text-3xl font-black text-on-surface mb-4">Сабақ мазмұны бос</h2>
              <p className="text-lg text-on-surface-variant font-medium max-w-md">
                Оқуды бастау үшін сол жақ мәзірден сабақты таңдаңыз немесе жаңа курстарды күтіңіз.
              </p>
            </div>
          )}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
