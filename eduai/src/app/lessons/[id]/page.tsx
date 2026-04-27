import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LessonClient from "./LessonClient";

export default async function CourseLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  // Fetch course with its lessons
  const { data: course } = await supabase
    .from("courses")
    .select("*, lessons(*)")
    .eq("id", id)
    .single();

  if (!course) {
    return redirect("/catalog");
  }

  // Sort lessons by order_index
  course.lessons = course.lessons.sort((a: any, b: any) => a.order_index - b.order_index);

  return <LessonClient course={course} />;
}
