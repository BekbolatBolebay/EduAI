import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "student";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (role === "teacher") {
    return NextResponse.redirect(new URL("/teacher", baseUrl));
  } else if (role === "admin") {
    return NextResponse.redirect(new URL("/admin", baseUrl));
  } else {
    return NextResponse.redirect(new URL("/student/home", baseUrl));
  }
}
