"use client";

import { useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_option: number;
};

type Test = {
  course_id: string;
  course_title: string;
  questions: Question[];
};

export default function TestsClient({ tests }: { tests: Test[] }) {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (index: number) => {
    if (!selectedTest) return;

    if (index === selectedTest.questions[currentQuestionIndex].correct_option) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < selectedTest.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const startTest = (test: Test) => {
    setSelectedTest(test);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      <TopAppBar />

      <main className="max-w-[1280px] mx-auto px-6 py-10 animate-in fade-in duration-700">
        {!selectedTest ? (
          <section className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-on-surface tracking-tight">
                Білімді тексеру
              </h1>
              <p className="text-on-surface-variant font-medium text-lg">
                Курстар бойынша дайын тесттерді тапсырып, деңгейіңізді анықтаңыз.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tests.map((test) => (
                <div
                  key={test.course_id}
                  className="glass-panel p-8 rounded-[40px] border border-blue-50 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group"
                >
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-primary-container text-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <span className="material-symbols-outlined text-3xl fill-1">
                        quiz
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-on-surface">
                        {test.course_title}
                      </h3>
                      <p className="text-on-surface-variant font-medium">
                        {test.questions.length} сұрақтан тұрады
                      </p>
                    </div>
                    <button
                      onClick={() => startTest(test)}
                      className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Тестті бастау
                    </button>
                  </div>
                </div>
              ))}
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
              <div className="glass-panel p-10 rounded-[40px] shadow-2xl border border-primary/10 text-center space-y-8 animate-in zoom-in-95">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <span className="material-symbols-outlined text-5xl">
                    emoji_events
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-on-surface">
                    Нәтиже: {score} / {selectedTest.questions.length}
                  </h2>
                  <p className="text-on-surface-variant font-medium text-lg">
                    {score === selectedTest.questions.length
                      ? "Керемет! Сіз барлық сұраққа дұрыс жауап бердіңіз."
                      : "Жақсы нәтиже! Біліміңізді әлі де шыңдауға болады."}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => startTest(selectedTest)}
                    className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg shadow-primary/20"
                  >
                    Қайта тапсыру
                  </button>
                  <button
                    onClick={() => setSelectedTest(null)}
                    className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-black text-on-surface"
                  >
                    Мәзірге қайту
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
}
