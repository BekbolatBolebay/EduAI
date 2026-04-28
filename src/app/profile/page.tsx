import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
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

  // Fetch achievements
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select(`
      unlocked_at,
      achievements (*)
    `)
    .eq("user_id", user.id);

  // Fetch test results
  const { data: testResults } = await supabase
    .from("test_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return <ProfileClient 
    profile={profile} 
    achievements={userAchievements || []}
    testResults={testResults || []}
  />;
}
