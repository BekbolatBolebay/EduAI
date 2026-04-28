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

  // Fetch leaderboard data
  const { data: topUsers, error: usersError } = await supabase
    .from("profiles")
    .select("full_name, xp, avatar_url")
    .order("xp", { ascending: false })
    .limit(5);

  // Fetch courses
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id, title");

  // Fetch all questions
  const { data: allQuestions, error: questionsError } = await supabase
    .from("questions")
    .select("*");

  // Fetch community quizzes
  const { data: communityQuizzes, error: communityError } = await supabase
    .from("community_quizzes")
    .select("*");

  if (coursesError || questionsError || communityError) {
    console.error("Tests Page Error:", coursesError || questionsError || communityError);
  }

  // Transform standard tests
  const standardTests = courses?.map((course: any) => ({
    id: course.id,
    title: course.title,
    questions: (allQuestions?.filter(q => q.course_id === course.id) || []).map(q => ({
      id: q.id,
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option
    })),
    type: "standard"
  })).filter(t => t.questions.length > 0) || [];

  // Transform community tests
  const communityTests = communityQuizzes?.map((cq: any) => ({
    id: cq.id,
    title: cq.title,
    questions: cq.questions.map((q: any, idx: number) => ({
      id: `${cq.id}-${idx}`,
      question_text: q.question,
      options: q.options,
      correct_option: q.correct
    })),
    type: "community" as "community"
  })) || [];

  return <TestsClient 
    standardTests={standardTests as any} 
    communityTests={communityTests as any} 
    topUsers={topUsers || []} 
    communityQuizzesSource={communityQuizzes || []}
  />;
}
