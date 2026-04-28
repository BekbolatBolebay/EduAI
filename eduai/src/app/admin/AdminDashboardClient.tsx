"use client";

import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboardClient({ profile, users, quizzes }: { profile: any, users: any[], quizzes: any[] }) {
  const supabase = createClient();

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    
    if (error) alert("Қате: " + error.message);
    else window.location.reload();
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Бұл тестті өшіргіңіз келе ме?")) return;
    const { error } = await supabase
      .from("community_quizzes")
      .delete()
      .eq("id", quizId);
    
    if (error) alert("Қате: " + error.message);
    else window.location.reload();
  };

  return (
    <div className="bg-background min-h-screen pb-40">
      <TopAppBar />

      <main className="max-w-[1280px] mx-auto px-6 py-10 animate-in fade-in duration-700">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">Администратор панелі</h1>
          <p className="text-on-surface-variant font-medium text-lg">Платформаны басқару және пайдаланушылар бақылауы</p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Users Management */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">group</span>
              Пайдаланушылар ({users.length})
            </h2>
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Аты-жөні</th>
                      <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Сынып</th>
                      <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Рөлі</th>
                      <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">XP</th>
                      <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Әрекет</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 font-bold text-on-surface">{u.full_name}</td>
                        <td className="px-8 py-6 text-slate-500">{u.grade}-сынып</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            u.role === "admin" ? "bg-purple-100 text-purple-600" : 
                            u.role === "teacher" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-black text-primary">{u.xp}</td>
                        <td className="px-8 py-6">
                          <select 
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            className="bg-slate-100 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 ring-primary transition-all"
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Quizzes Management */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">quiz</span>
              Барлық тесттер ({quizzes.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-bold text-on-surface line-clamp-2">{quiz.title}</h4>
                      <button 
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      Автор: {quiz.profiles?.full_name || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
