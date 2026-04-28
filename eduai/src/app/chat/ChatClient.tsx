"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BottomNavBar from "@/components/BottomNavBar";
import { createClient } from "@/utils/supabase/client";
import ChatQuiz from "@/components/ChatQuiz";

type Message = {
  role: "user" | "assistant";
  content: string;
  image_url?: string;
};

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history
  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        setMessages(data.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
          image_url: m.image_url
        })));
      } else {
        // Initial greeting if no history
        setMessages([{
          role: "assistant",
          content: "Сәлем! Мен сенің EduAI менторыңмын. Бүгін не үйренгің келеді?"
        }]);
      }
    };

    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    const userMessage: Message = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save user message to DB
        await supabase.from("chat_messages").insert({
          user_id: user.id,
          role: "user",
          content: userText
        });
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const assistantMessage = await response.json();
      setMessages((prev) => [...prev, assistantMessage]);

      if (user) {
        // Save assistant message to DB
        await supabase.from("chat_messages").insert({
          user_id: user.id,
          role: "assistant",
          content: assistantMessage.content,
          image_url: assistantMessage.image_url
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Кешіріңіз, қате кетті. Қайта көріңіз." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* TopAppBar for Chat */}
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-white/80 backdrop-blur-2xl border-b border-blue-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
            <Image
              alt="AI Avatar"
              className="w-full h-full object-cover"
              width={48}
              height={48}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2YVeCsfjPdfC5NUk2-VcbqkqVfM5RLXZNUawTzaasH_wJk0Eglke_IvX8vrcXCZwcM-Wbn4Md1n0sFSoOkrpfovJNNziPZM_8LSRTYVSn0FmwSC8g8jOV0vcEEQO6PontW608C4NFRYyP5Di8E7ZvJMGS0BJ9AeWZ-FVUPju2qUD0qaE-XqhK5IUP5m0izS_7XMdXJuClhOD4gyN9GuZYhb_-lSC5DmmBz2DDgH8Y7diWIRpt6SQCwdT_4OkDFFHOwQ3foeEGCwVM"
            />
          </div>
          <div>
            <h1 className="font-black text-on-surface tracking-tight">
              Robot Mentor
            </h1>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              <p className="text-xs text-secondary font-black uppercase tracking-widest">
                {isLoading ? 'Жауап жазуда...' : 'AI Assistant • Online'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-6 pt-8 pb-40 overflow-y-auto">
        <div className="flex flex-col gap-8">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-4 max-w-[85%] animate-in fade-in duration-500 ${
                m.role === "user" ? "self-end flex-row-reverse" : ""
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                m.role === "assistant" ? "bg-blue-100 text-primary" : "bg-slate-200"
              }`}>
                <span className="material-symbols-outlined fill-1">
                  {m.role === "assistant" ? "smart_toy" : "person"}
                </span>
              </div>
              <div className={`glass-panel p-6 rounded-[24px] shadow-sm ${
                m.role === "assistant" ? "rounded-tl-none" : "rounded-tr-none bg-primary/5"
              }`}>
                {/* Parse for Quiz JSON */}
                {(() => {
                  const quizMatch = m.content.match(/\{[\s\S]*"type":\s*"quiz"[\s\S]*\}/);
                  if (quizMatch) {
                    try {
                      const quizData = JSON.parse(quizMatch[0]);
                      const textContent = m.content.replace(quizMatch[0], "").trim();
                      return (
                        <div className="space-y-6">
                          {textContent && <p className="font-medium text-on-surface leading-relaxed">{textContent}</p>}
                          <ChatQuiz questions={quizData.questions} />
                        </div>
                      );
                    } catch (e) {
                      return <p className="font-medium text-on-surface leading-relaxed">{m.content}</p>;
                    }
                  }
                  return <p className="font-medium text-on-surface leading-relaxed">{m.content}</p>;
                })()}
                
                {m.image_url && (
                  <div className="mt-4 rounded-2xl overflow-hidden shadow-lg border border-primary/10">
                    <img src={m.image_url} alt="Generated" className="w-full h-auto" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-4 max-w-[85%] animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-blue-100 text-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined fill-1 animate-bounce">smart_toy</span>
              </div>
              <div className="glass-panel px-6 py-4 rounded-[24px] rounded-tl-none shadow-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Chat Input */}
      <div className="fixed bottom-28 left-0 w-full px-6 z-40">
        <div className="max-w-[1280px] mx-auto">
          <form 
            onSubmit={handleSubmit} 
            onClick={() => inputRef.current?.focus()}
            className="bg-white/90 backdrop-blur-2xl border border-blue-100 rounded-[32px] p-2.5 shadow-2xl flex items-center gap-3 cursor-text"
          >
            <input
              type="file"
              id="chat-file-input"
              className="hidden"
              accept="image/*"
              onChange={() => alert("Сурет талдау функциясы жақында қосылады!")}
            />
            <button 
              type="button" 
              onClick={() => document.getElementById('chat-file-input')?.click()}
              className="p-3.5 text-outline hover:text-primary transition-colors hover:bg-blue-50 rounded-2xl"
            >
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <input
              ref={inputRef}
              className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline/50"
              placeholder="Хабарлама жазыңыз..."
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-on-primary shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all group disabled:opacity-50 disabled:scale-100"
            >
              <span className="material-symbols-outlined group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                send
              </span>
            </button>
          </form>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
