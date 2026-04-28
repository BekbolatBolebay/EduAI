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
    </form>
  );
}
