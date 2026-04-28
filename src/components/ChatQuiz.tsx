"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { QRCodeSVG } from "qrcode.react";

type Question = {
  question: string;
  options: string[];
  correct: number;
};

export default function ChatQuiz({ questions }: { questions: Question[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  
  const supabase = createClient();

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Жариялау үшін жүйеге кіру қажет");
        return;
      }

      const { data, error } = await supabase.from("community_quizzes").insert({
        user_id: user.id,
        title: questions[0].question.substring(0, 50) + "...",
        questions: questions
      }).select().single();

      if (error) throw error;
      setQuizId(data.id);
      setIsPublished(true);
    } catch (e) {
      console.error(e);
      alert("Қате кетті");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentIndex].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const quizLink = quizId ? `${window.location.origin}/tests?id=${quizId}` : "";

    return (
      <div className="bg-primary/5 p-8 rounded-[32px] border-2 border-primary/10 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary/20">
          <span className="material-symbols-outlined text-4xl">emoji_events</span>
        </div>
        <div>
          <h3 className="text-2xl font-black text-on-surface mb-2">Квиз аяқталды!</h3>
          <p className="text-on-surface-variant font-bold">
            Нәтижеңіз: <span className="text-primary text-xl">{score} / {questions.length}</span>
          </p>
        </div>

        {isPublished && quizId && (
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-emerald-100 animate-in fade-in slide-in-from-top-4">
            <p className="text-emerald-600 font-black text-sm uppercase tracking-widest mb-4">Жарияланды! QR кодты бөлісіңіз:</p>
            <div className="flex justify-center mb-4 p-4 bg-slate-50 rounded-2xl">
              <QRCodeSVG value={quizLink} size={150} />
            </div>
            <p className="text-[10px] text-outline break-all font-mono">{quizLink}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!isPublished && (
            <button 
              disabled={isPublishing}
              onClick={handlePublish}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">publish</span>
              {isPublishing ? 'Жариялау...' : 'Квизді жариялау'}
            </button>
          )}
          <button 
            onClick={() => { setCurrentIndex(0); setScore(0); setShowResult(false); setSelectedOption(null); setIsAnswered(false); setIsPublished(false); setQuizId(null); }}
            className="w-full py-4 bg-white border border-slate-200 text-on-surface rounded-2xl font-black hover:bg-slate-50 transition-all"
          >
            Қайта бастау
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="bg-white p-8 rounded-[32px] border border-blue-50 shadow-xl space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <span className="px-4 py-1.5 bg-blue-50 text-primary rounded-full text-xs font-black uppercase tracking-widest">
          Сұрақ {currentIndex + 1} / {questions.length}
        </span>
        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-black text-on-surface leading-tight">
        {q.question}
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {q.options.map((option, idx) => {
          let stateClass = "border-slate-100 hover:border-primary/30 hover:bg-slate-50";
          if (isAnswered) {
            if (idx === q.correct) stateClass = "border-emerald-500 bg-emerald-50 text-emerald-700";
            else if (idx === selectedOption) stateClass = "border-red-500 bg-red-50 text-red-700";
            else stateClass = "opacity-50 border-slate-100";
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`p-5 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center group ${stateClass}`}
            >
              <span>{option}</span>
              {isAnswered && idx === q.correct && (
                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              )}
              {isAnswered && idx === selectedOption && idx !== q.correct && (
                <span className="material-symbols-outlined text-red-500">cancel</span>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <button
          onClick={nextQuestion}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
        >
          {currentIndex + 1 === questions.length ? "Нәтижені көру" : "Келесі сұрақ"}
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
