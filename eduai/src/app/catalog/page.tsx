import { createClient } from "@/utils/supabase/server";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CatalogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

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
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          <button className="px-8 py-3 bg-primary text-on-primary rounded-2xl font-black shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
            Барлығы
          </button>
          {["Робототехника", "Бағдарламалау", "Ғылым", "Математика"].map(
            (label) => (
              <button
                key={label}
                className="px-8 py-3 bg-white text-on-surface-variant border border-outline-variant/30 rounded-2xl font-bold whitespace-nowrap hover:bg-primary/5 hover:border-primary/20 transition-all active:scale-95 shadow-sm"
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {courses?.map((course, index) => {
            const isFeatured = index === 0;
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
                      Курсқа жазылу
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
