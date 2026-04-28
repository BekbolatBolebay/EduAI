"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BottomNavBar from "@/components/BottomNavBar";
import { createClient } from "@/utils/supabase/client";
import ChatQuiz from "@/components/ChatQuiz";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

      <main className="flex-1 max-w-[900px] mx-auto w-full px-6 pt-8 pb-44 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-12">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-6 w-full ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Icon/Avatar */}
              <div className={`flex-shrink-0 ${m.role === "assistant" ? "pt-2" : "pt-1"}`}>
                {m.role === "assistant" ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-500 text-[28px] fill-1 animate-pulse">auto_awesome</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 border-2 border-white shadow-sm">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 min-w-0 ${
                m.role === "assistant" 
                  ? "" 
                  : "max-w-[80%] bg-primary text-on-primary px-7 py-4 rounded-[32px] rounded-tr-none shadow-lg shadow-primary/20 self-end"
              }`}>
                {/* Markdown Content */}
                <div className={`flex flex-col gap-5 ${
                  m.role === "assistant" ? "text-slate-700" : "text-white"
                }`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className={`leading-relaxed text-[16px] ${m.role === "user" ? "font-bold" : "font-medium"}`}>{children}</p>,
                      h1: ({ children }) => <h1 className="text-2xl font-black text-on-surface mt-6 mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-black text-on-surface mt-5 mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-black text-on-surface mt-4 mb-1">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc ml-5 space-y-3 my-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-5 space-y-3 my-2">{children}</ol>,
                      li: ({ children }) => <li className="pl-1">{children}</li>,
                      strong: ({ children }) => <strong className={`font-black ${m.role === "assistant" ? "text-primary" : "text-white"}`}>{children}</strong>,
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="rounded-2xl overflow-hidden my-6 shadow-xl border border-slate-800 w-full">
                            <div className="bg-slate-800 px-5 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between items-center">
                              <span>{match[1]}</span>
                              <span className="material-symbols-outlined text-sm">code</span>
                            </div>
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className={`${className} bg-slate-100 px-1.5 py-0.5 rounded-md text-primary font-bold`} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {(() => {
                      const quizMatch = m.content.match(/\{[\s\S]*"type":\s*"quiz"[\s\S]*\}/);
                      if (quizMatch) {
                        try {
                          const quizData = JSON.parse(quizMatch[0]);
                          const textContent = m.content.replace(quizMatch[0], "").trim();
                          return textContent;
                        } catch (e) {
                          return m.content;
                        }
                      }
                      return m.content;
                    })()}
                  </ReactMarkdown>

                  {/* Quiz Integration */}
                  {(() => {
                    const quizMatch = m.content.match(/\{[\s\S]*"type":\s*"quiz"[\s\S]*\}/);
                    if (quizMatch) {
                      try {
                        const quizData = JSON.parse(quizMatch[0]);
                        return (
                          <div className="mt-8 bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm w-full">
                            <ChatQuiz questions={quizData.questions} />
                          </div>
                        );
                      } catch (e) { return null; }
                    }
                    return null;
                  })()}
                </div>
                {m.image_url && (
                  <div className="mt-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-[500px]">
                    <img src={m.image_url} alt="Generated" className="w-full h-auto" />
                  </div>
                )}
                
                {/* Message Actions (Assistant only) */}
                {m.role === "assistant" && (
                  <div className="flex items-center gap-1 mt-4 ml-14 animate-in fade-in slide-in-from-top-1 duration-700">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(m.content.replace(/\{[\s\S]*\}/, "").trim());
                        alert("Көшірілді!");
                      }}
                      className="p-2 text-outline hover:text-primary transition-colors rounded-lg hover:bg-primary/5 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Көшіру</span>
                    </button>
                    <div className="w-px h-3 bg-slate-100 mx-1"></div>
                    <button className="p-2 text-outline hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                      <span className="material-symbols-outlined text-[16px]">share</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex-shrink-0 pt-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-400 text-[28px] fill-1 animate-pulse">auto_awesome</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 py-2">
                <div className="w-2 h-2 bg-blue-400/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-400/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-400/40 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Modern Chat Input Area */}
      <div className="fixed bottom-28 left-0 w-full px-6 z-40 animate-in slide-in-from-bottom-8 duration-700">
        <div className="max-w-[800px] mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="relative group"
          >
            <div className="bg-white/95 backdrop-blur-2xl border-2 border-slate-100 focus-within:border-primary/30 rounded-[35px] p-2 pr-3 shadow-2xl shadow-primary/5 transition-all duration-500 flex items-end gap-2 min-h-[70px]">
              {/* Attachment Button */}
              <button 
                type="button" 
                onClick={() => alert("Жақында қосылады...")}
                className="mb-1.5 ml-1.5 w-11 h-11 text-outline hover:text-primary transition-all hover:bg-primary/5 rounded-[20px] flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-[24px]">add</span>
              </button>

              {/* Textarea Input */}
              <textarea
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
                className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-bold placeholder:text-outline/40 py-4 px-2 max-h-[200px] overflow-y-auto no-scrollbar resize-none leading-relaxed"
                placeholder="Хабарлама жазыңыз немесе сұрақ қойыңыз..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize
                  e.target.style.height = 'inherit';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                disabled={isLoading}
              />

              {/* Send Button */}
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="mb-1 w-13 h-13 aspect-square bg-primary text-on-primary rounded-[25px] flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all group disabled:opacity-30 disabled:scale-100 disabled:grayscale shrink-0"
              >
                <span className="material-symbols-outlined text-[26px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform font-black">
                  north_east
                </span>
              </button>
            </div>
            
            {/* Disclaimer */}
            <p className="text-[10px] text-center mt-3 font-bold text-outline uppercase tracking-[0.15em] opacity-40">
              Robot Mentor қателесуі мүмкін. Маңызды ақпаратты тексеріңіз.
            </p>
          </form>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
