import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CatalogClient from "./CatalogClient";

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

  return <CatalogClient initialCourses={courses || []} />;
}
