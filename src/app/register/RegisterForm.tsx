"use client";

import { useState } from "react";
import { signup } from "../auth/actions";

export default function RegisterForm({ error }: { error?: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={signup} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined">error</span>
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <label
          className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-1"
          htmlFor="full_name"
        >
          Толық аты-жөніңіз
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            person
          </span>
          <input
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none rounded-2xl transition-all font-medium text-on-surface"
            id="full_name"
            name="full_name"
            placeholder="Мысалы: Азамат Бақытұлы"
            type="text"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-1"
          htmlFor="email"
        >
          Электрондық пошта
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            mail
          </span>
          <input
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none rounded-2xl transition-all font-medium text-on-surface"
            id="email"
            name="email"
            placeholder="example@edu.kz"
            type="email"
            required
          />
        </div>
      </div>

      {/* Grade Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-1"
            htmlFor="role"
          >
            Рөліңіз
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              manage_accounts
            </span>
            <select
              className="w-full pl-12 pr-10 py-4 bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none rounded-2xl appearance-none transition-all font-medium text-on-surface"
              id="role"
              name="role"
              required
              defaultValue="student"
            >
              <option value="student">Оқушы</option>
              <option value="teacher">Мұғалім</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none group-focus-within:text-primary">
              expand_more
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-1"
            htmlFor="grade"
          >
            Сыныбыңыз
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              grade
            </span>
            <select
              className="w-full pl-12 pr-10 py-4 bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none rounded-2xl appearance-none transition-all font-medium text-on-surface"
              id="grade"
              name="grade"
              required
              defaultValue=""
            >
              <option disabled value="">
                Таңдау
              </option>
              {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                <option key={g} value={g}>
                  {g}-сынып
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none group-focus-within:text-primary">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-1"
          htmlFor="password"
        >
          Құпия сөз
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            lock
          </span>
          <input
            className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none rounded-2xl transition-all font-medium text-on-surface"
            id="password"
            name="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            required
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-black shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 group"
        type="submit"
      >
        <span>Тіркелу</span>
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </button>
    </form>
  );
}
