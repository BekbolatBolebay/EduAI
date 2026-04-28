"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function BottomNavBar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (data) setRole(data.role);
      }
    };
    getRole();
  }, []);

  const navItems = [
    ...(role === "teacher" || role === "admin" 
      ? [{ icon: "dashboard", label: "Панель", href: "/teacher" }]
      : [{ icon: "home", label: "Оқу", href: "/student/home" }]),
    { icon: "quiz", label: "Тесттер", href: "/tests" },
    { icon: "smart_toy", label: "Ментор", href: "/chat" },
    { icon: "menu_book", label: "Каталог", href: "/catalog" },
    { icon: "person", label: "Профиль", href: "/profile" },
    ...(role === "admin" 
      ? [{ icon: "admin_panel_settings", label: "Админ", href: "/admin" }]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-8 pt-4 bg-white/90 backdrop-blur-2xl border-t border-blue-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[40px] overflow-x-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-90 duration-300 min-w-[64px] ${
              isActive
                ? "text-primary bg-primary/10 px-2 py-2 rounded-2xl"
                : "text-outline hover:text-primary"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[24px] ${
                isActive ? "fill-1" : ""
              }`}
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[9px] font-bold tracking-wide uppercase">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
