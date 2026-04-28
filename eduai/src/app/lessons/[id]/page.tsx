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
  const { data: course, error } = await supabase
    .from("courses")
    .select("*, lessons(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Lessons Page Error:", error);
  }

  if (!course) {
    console.warn("Course not found for ID:", id);
    return redirect("/catalog");
  }

  // Sort lessons by order_index
  const sortedLessons = (course.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index);

  return <LessonClient course={{ ...course, lessons: sortedLessons }} />;
}
