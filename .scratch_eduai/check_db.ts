import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkData() {
  const { data: courses, error: coursesError } = await supabase.from("courses").select("*");
  console.log("Courses:", courses?.length, coursesError || "");

  const { data: lessons, error: lessonsError } = await supabase.from("lessons").select("*");
  console.log("Lessons:", lessons?.length, lessonsError || "");

  const { data: questions, error: questionsError } = await supabase.from("questions").select("*");
  console.log("Questions:", questions?.length, questionsError || "");

  if (courses && courses.length > 0) {
    console.log("First Course ID:", courses[0].id);
    const { data: joined, error: joinError } = await supabase
      .from("courses")
      .select("id, title, lessons(*), questions(*)")
      .eq("id", courses[0].id)
      .single();
    console.log("Joined Data for first course:", joined ? "Found" : "Not Found", joinError || "");
    if (joined) {
      console.log("Lessons count:", joined.lessons?.length);
      console.log("Questions count:", joined.questions?.length);
    }
  }
}

checkData();
