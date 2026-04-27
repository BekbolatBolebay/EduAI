"use client";

import Image from "next/image";
import BottomNavBar from "@/components/BottomNavBar";
import TopAppBar from "@/components/TopAppBar";
import { signOut } from "../auth/actions";

type Profile = {
  full_name: string;
  grade: string;
  xp: number;
  streak: number;
  avatar_url?: string;
};

export default function ProfileClient({ profile }: { profile: Profile | null }) {
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
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-white">
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
            <h3 className="text-4xl font-black text-on-surface">0</h3>
            <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Жетістіктер</p>
          </div>
        </div>

        {/* Secondary Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">history</span>
              Соңғы белсенділік
            </h2>
            <div className="glass-panel p-8 rounded-[40px] border border-slate-100 text-center py-20">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">pending_actions</span>
              <p className="text-on-surface-variant font-medium">Белсенділік әзірге жоқ. Оқуды бастаңыз!</p>
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
    </div>
  );
}
