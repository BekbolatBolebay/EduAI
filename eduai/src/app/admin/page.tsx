import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
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

  if (profile?.role !== "admin") {
    return redirect("/home");
  }

  // Fetch all users
  const { data: allUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch all quizzes
  const { data: allQuizzes } = await supabase
    .from("community_quizzes")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  return <AdminDashboardClient 
    profile={profile} 
    users={allUsers || []} 
    quizzes={allQuizzes || []}
  />;
}
