import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TestsClient from "./TestsClient";

export default async function TestsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  // Fetch courses with their questions
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, questions(*)");

  // Transform data for the client component
  const tests = courses?.map((course: any) => ({
    course_id: course.id,
    course_title: course.title,
    questions: course.questions || [],
  })) || [];

  return <TestsClient tests={tests} />;
}
