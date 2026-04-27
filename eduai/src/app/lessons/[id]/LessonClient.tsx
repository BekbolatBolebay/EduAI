"use client";

import { useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import Link from "next/link";

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

export default function LessonClient({ course }: { course: Course }) {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const activeLesson = course.lessons[activeLessonIndex];

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
              {course.subject} • {course.lessons.length} Сабақ
            </p>
          </div>

          <div className="space-y-4">
            {course.lessons.map((lesson, index) => (
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
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          {activeLesson ? (
            <>
              <div className="glass-panel p-10 rounded-[40px] shadow-sm border border-blue-50">
                <h2 className="text-4xl font-black text-on-surface mb-8 leading-tight">
                  {activeLesson.title}
                </h2>
                
                {/* Video Player */}
                {activeLesson.video_url && (
                  <div className="mb-10 aspect-video rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
                    <iframe
                      width="100%"
                      height="100%"
                      src={activeLesson.video_url}
                      title={activeLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                <div className="prose prose-blue max-w-none">
                  <p className="text-lg text-on-surface-variant leading-relaxed font-medium whitespace-pre-wrap">
                    {activeLesson.content}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center gap-6">
                <button 
                  disabled={activeLessonIndex === 0}
                  onClick={() => setActiveLessonIndex(prev => prev - 1)}
                  className="flex-1 py-5 px-8 rounded-2xl bg-white border-2 border-slate-100 font-black text-on-surface hover:border-primary transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                  Алдыңғы
                </button>
                <button 
                  disabled={activeLessonIndex === course.lessons.length - 1}
                  onClick={() => setActiveLessonIndex(prev => prev + 1)}
                  className="flex-1 py-5 px-8 rounded-2xl bg-primary text-on-primary font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                >
                  Келесі
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-outline font-black italic">
              Сабақ таңдалмады
            </div>
          )}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
