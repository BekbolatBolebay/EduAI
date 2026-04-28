import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TeacherDashboardClient from "./TeacherDashboardClient";

export default async function TeacherDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "teacher" && profile?.role !== "admin") {
    return redirect("/home");
  }

  // Fetch teacher's quizzes stats
  const { data: myQuizzes } = await supabase
    .from("community_quizzes")
    .select("*, test_results(count)")
    .eq("user_id", user.id);

  // Fetch global stats for dashboard
  const { count: totalStudents } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  return <TeacherDashboardClient 
    profile={profile} 
    myQuizzes={myQuizzes || []} 
    totalStudents={totalStudents || 0}
  />;
}
