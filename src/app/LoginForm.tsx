"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { login } from "./auth/actions";

export default function LoginForm({ error }: { error?: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={login} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined">error</span>
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label
          className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1"
          htmlFor="email"
        >
          Электрондық пошта
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            mail
          </span>
          <input
            className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-on-surface"
            id="email"
            name="email"
            placeholder="mysaly@edu.kz"
            type="email"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex justify-between items-end px-1">
          <label
            className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider"
            htmlFor="password"
          >
            Құпия сөз
          </label>
          <Link
            className="text-primary text-[11px] font-bold hover:underline transition-all"
            href="#"
            onClick={(e) => { e.preventDefault(); alert("Құпия сөзді қалпына келтіру функциясы жақында қосылады!"); }}
          >
            Құпия сөзді ұмыттыңыз ба?
          </Link>
        </div>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            lock
          </span>
          <input
            className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest rounded-2xl py-4 pl-12 pr-12 outline-none transition-all font-medium text-on-surface"
            id="password"
            name="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            required
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
          </button>
        </div>
      </div>

      {/* Login Button */}
      <button
        className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        type="submit"
      >
        <span>Кіру</span>
        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </button>

      {/* Divider */}
      <div className="relative my-10 flex items-center">
        <div className="flex-grow border-t border-outline-variant"></div>
        <span className="px-4 text-outline text-[11px] font-bold uppercase tracking-widest bg-transparent">
          немесе
        </span>
        <div className="flex-grow border-t border-outline-variant"></div>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          type="button"
          onClick={() => alert("Google арқылы кіру дайындалуда...")}
          className="flex items-center justify-center gap-3 py-3.5 border border-outline-variant rounded-2xl hover:bg-surface-container-low active:scale-95 transition-all group"
        >
          <Image
            alt="Google icon"
            width={20}
            height={20}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnn13-hHrBIF380ssZfs1-6V_LF8FU2CRsQ7jXSxKtLYmfFnIXS_ftaPq3JgAzhlT7tBJWoSm2e0SW8j_YaLk9w7TBGgTGRoxXBjrqZwH_o4buQokg7zqaAqoOkpHNV0yvQu3-6dM1AOuf2DMBpiNyzLCSLMuwq20fghXnBD4vj61B-D9D7AcsV_13E2rQez_NAZjgzNCjmXHgFAQ9Jycmyy1jYHIT5dSCuKcWm7wYlnh-0Wf8S6fBr2T5H7MKBhUDR5tHDpO8uFVC"
          />
          <span className="font-bold text-on-surface">Google</span>
        </button>
        <button 
          type="button"
          onClick={() => alert("Apple арқылы кіру дайындалуда...")}
          className="flex items-center justify-center gap-3 py-3.5 border border-outline-variant rounded-2xl hover:bg-surface-container-low active:scale-95 transition-all group"
        >
          <span className="material-symbols-outlined text-on-surface text-[22px]">
            ios
          </span>
          <span className="font-bold text-on-surface">Apple</span>
        </button>
      </div>
    </form>
  );
}
