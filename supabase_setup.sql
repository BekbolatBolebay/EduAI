-- EduAI Database Setup
-- Run this in Supabase SQL Editor

-- 1. Profiles Table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('student', 'teacher', 'admin')) default 'student',
  grade text,
  xp integer default 0,
  streak integer default 0,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- 2. Courses Table
create table if not exists courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text,
  image_url text,
  xp_reward integer default 100,
  created_at timestamp with time zone default now()
);

-- 3. Lessons Table
create table if not exists lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses on delete cascade not null,
  title text not null,
  content text, -- Markdown content
  video_url text,
  order_index integer not null,
  created_at timestamp with time zone default now()
);

-- 4. Questions Table (for standard courses)
create table if not exists questions (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references lessons on delete cascade not null,
  question_text text not null,
  options jsonb not null, -- Array of strings
  correct_option integer not null,
  created_at timestamp with time zone default now()
);

-- 5. User Progress
create table if not exists user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id uuid references courses on delete cascade not null,
  last_lesson_id uuid references lessons on delete cascade,
  progress_percent integer default 0,
  updated_at timestamp with time zone default now(),
  unique(user_id, course_id)
);

-- 6. AI Mentors / Chat Messages
create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- 7. Community Quizzes (Teacher-created)
create table if not exists community_quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  questions jsonb not null, -- Array of objects: {question, options, correct}
  created_at timestamp with time zone default now()
);

-- 8. Test Sessions (for Group/Class testing)
create table if not exists test_sessions (
  id uuid default gen_random_uuid() primary key,
  test_id uuid not null,
  created_by uuid references auth.users on delete cascade not null,
  pin text unique,
  status text check (status in ('active', 'finished')) default 'active',
  created_at timestamp with time zone default now()
);

-- 9. Session Participants
create table if not exists session_participants (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references test_sessions on delete cascade not null,
  user_id uuid references profiles on delete cascade,
  guest_name text,
  score integer default 0,
  is_finished boolean default false,
  joined_at timestamp with time zone default now()
);

-- 10. Test Results (History)
create table if not exists test_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  test_id uuid not null,
  test_title text,
  score integer not null,
  total_questions integer not null,
  created_at timestamp with time zone default now()
);

-- 11. Achievements
create table if not exists achievements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  icon text,
  requirement_type text, -- 'test_score', 'streak', 'course_complete'
  requirement_value integer,
  created_at timestamp with time zone default now()
);

create table if not exists user_achievements (
  user_id uuid references auth.users on delete cascade not null,
  achievement_id uuid references achievements on delete cascade not null,
  unlocked_at timestamp with time zone default now(),
  primary key(user_id, achievement_id)
);

-- Enable RLS
alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table questions enable row level security;
alter table user_progress enable row level security;
alter table chat_messages enable row level security;
alter table community_quizzes enable row level security;
alter table test_sessions enable row level security;
alter table session_participants enable row level security;
alter table test_results enable row level security;

-- Policies
-- Profiles
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Courses/Lessons/Questions (Public Read)
drop policy if exists "Anyone can view courses" on courses;
create policy "Anyone can view courses" on courses for select using (true);
drop policy if exists "Anyone can view lessons" on lessons;
create policy "Anyone can view lessons" on lessons for select using (true);
drop policy if exists "Anyone can view questions" on questions;
create policy "Anyone can view questions" on questions for select using (true);

-- User Progress (Owner Only)
drop policy if exists "Users can manage own progress" on user_progress;
create policy "Users can manage own progress" on user_progress for all using (auth.uid() = user_id);

-- Chat Messages (Owner Only)
drop policy if exists "Users can manage own chat" on chat_messages;
create policy "Users can manage own chat" on chat_messages for all using (auth.uid() = user_id);

-- Community Quizzes
drop policy if exists "Anyone can view community quizzes" on community_quizzes;
create policy "Anyone can view community quizzes" on community_quizzes for select using (true);

drop policy if exists "Users can manage own community quizzes" on community_quizzes;
create policy "Users can manage own community quizzes" on community_quizzes for all using (auth.uid() = user_id);

-- Test Sessions
drop policy if exists "Anyone can view sessions" on test_sessions;
create policy "Anyone can view sessions" on test_sessions for select using (true);

drop policy if exists "Users can manage own sessions" on test_sessions;
create policy "Users can manage own sessions" on test_sessions for all using (auth.uid() = created_by);

-- Session Participants (Open for Sessions)
drop policy if exists "Anyone can view participants" on session_participants;
create policy "Anyone can view participants" on session_participants for select using (true);

drop policy if exists "Anyone can join/update participants" on session_participants;
create policy "Anyone can join/update participants" on session_participants for all using (true);

-- Test Results (Owner Only)
drop policy if exists "Users can view own results" on test_results;
create policy "Users can view own results" on test_results for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own results" on test_results;
create policy "Users can insert own results" on test_results for insert with check (auth.uid() = user_id);

-- TRIGGER: Handle New User
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, grade)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'grade'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
