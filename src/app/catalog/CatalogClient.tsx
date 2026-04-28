"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

type Course = {
  id: string;
  title: string;
  subject: string;
  description: string;
  image_url: string;
  grade: string;
};

export default function CatalogClient({ initialCourses }: { initialCourses: Course[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Барлығы");

  const categories = ["Барлығы", "Робототехника", "Бағдарламалау", "Ғылым", "Математика", "Технология"];

  const filteredCourses = initialCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Mapping subjects to categories for better matching
    const subjectToCategory: { [key: string]: string } = {
      "информатика": "робототехника",
      "технология": "робототехника",
      "бағдарламалау": "бағдарламалау",
      "математика": "математика",
      "физика": "ғылым",
    };

    const courseCategory = subjectToCategory[course.subject.toLowerCase()] || course.subject.toLowerCase();
    const matchesCategory =
      selectedCategory === "Барлығы" ||
      courseCategory === selectedCategory.toLowerCase() ||
      course.subject.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background min-h-screen pb-32">
      <TopAppBar />

      <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 animate-in fade-in duration-700">
        <div className="mb-12 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">
              Сабақтар каталогы
            </h1>
            <p className="text-on-surface-variant font-medium text-lg">
              Өзіңізге ұнайтын бағытты таңдап, білім алуды бастаңыз.
            </p>
          </div>

          <div className="relative max-w-2xl group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-3xl focus:ring-2 focus:ring-primary outline-none shadow-sm shadow-primary/5 transition-all font-medium placeholder:text-outline/50 text-on-surface"
              placeholder="Қандай курс іздеп жүрсіз?"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((label) => (
            <button
              key={label}
              onClick={() => setSelectedCategory(label)}
              className={`px-8 py-3 rounded-2xl font-black transition-all active:scale-95 whitespace-nowrap shadow-sm ${
                selectedCategory === label
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-white text-on-surface-variant border border-outline-variant/30 hover:bg-primary/5 hover:border-primary/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => {
              const isFeatured = index === 0 && searchQuery === "" && selectedCategory === "Барлығы";
              return (
                <div
                  key={course.id}
                  className={`${
                    isFeatured ? "md:col-span-8" : "md:col-span-4"
                  } group bg-white rounded-[40px] shadow-sm border border-blue-50 hover:shadow-2xl hover:border-primary/20 transition-all duration-700 overflow-hidden`}
                >
                  <div className={`flex flex-col ${isFeatured ? "md:flex-row" : ""} h-full`}>
                    <div className={`${isFeatured ? "md:w-1/2 h-80 md:h-auto" : "h-52"} relative overflow-hidden`}>
                      <Image
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        src={course.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                      />
                    </div>
                    <div className={`${isFeatured ? "md:w-1/2 p-10" : "p-8"} flex flex-col justify-between space-y-6`}>
                      <div className="space-y-4">
                        <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                          {course.subject}
                        </span>
                        <h3 className={`${isFeatured ? "text-3xl" : "text-2xl"} font-black text-on-surface leading-tight`}>
                          {course.title}
                        </h3>
                        <p className="text-on-surface-variant font-medium leading-relaxed line-clamp-3">
                          {course.description}
                        </p>
                      </div>
                      <Link 
                        href={`/lessons/${course.id}`}
                        className="w-full py-4 bg-primary text-center text-on-primary rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"
                      >
                        Сабақты бастау
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-12 py-20 text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-outline/30">search_off</span>
              <p className="text-on-surface-variant text-xl font-bold">Ештеңе табылмады</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("Барлығы"); }}
                className="text-primary font-black hover:underline"
              >
                Барлық курстарды көру
              </button>
            </div>
          )}
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
