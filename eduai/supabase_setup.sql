-- 1. Profiles table (extends Supabase Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  grade text,
  xp integer default 0,
  streak integer default 0,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- 2. Courses table
create table if not exists courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subject text not null,
  grade text,
  description text,
  image_url text,
  total_lessons integer default 10,
  created_at timestamp with time zone default now()
);

-- 3. Lessons table
create table if not exists lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses on delete cascade not null,
  title text not null,
  content text,
  video_url text,
  order_index integer default 0,
  created_at timestamp with time zone default now()
);

-- 4. Questions table (for tests)
create table if not exists questions (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses on delete cascade not null,
  question_text text not null,
  options jsonb not null, -- Array of strings
  correct_option integer not null, -- Index of correct option
  created_at timestamp with time zone default now()
);

-- 5. User Progress table
create table if not exists user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id uuid references courses on delete cascade not null,
  progress_percent integer default 0,
  last_accessed timestamp with time zone default now(),
  unique(user_id, course_id)
);

-- 6. Chat Messages table
create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  role text check (role in ('user', 'assistant')),
  content text not null,
  image_url text,
  created_at timestamp with time zone default now()
);

-- 7. Community Quizzes (AI Generated)
create table if not exists community_quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  questions jsonb not null, -- Array of objects: {question, options, correct}
  created_at timestamp with time zone default now()
);

-- 8. Test Sessions (for Group/Class testing)
drop table if exists session_participants;
drop table if exists test_sessions;

create table test_sessions (
  id uuid default gen_random_uuid() primary key,
  test_id uuid not null, -- Can be course_id or community_quiz_id
  created_by uuid references auth.users on delete cascade not null,
  pin text unique, -- Short PIN for joining
  status text check (status in ('active', 'finished')) default 'active',
  created_at timestamp with time zone default now()
);

-- 9. Session Participants
create table session_participants (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references test_sessions on delete cascade not null,
  user_id uuid references profiles on delete cascade not null,
  score integer default 0,
  is_finished boolean default false,
  joined_at timestamp with time zone default now(),
  unique(session_id, user_id)
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

-- Policies (Drop if exists then create)
do $$
begin
  drop policy if exists "Users can view their own profile" on profiles;
  drop policy if exists "Users can update their own profile" on profiles;
  drop policy if exists "Anyone can view courses" on courses;
  drop policy if exists "Anyone can view lessons" on lessons;
  drop policy if exists "Anyone can view questions" on questions;
  drop policy if exists "Users can view their own progress" on user_progress;
  drop policy if exists "Users can update their own progress" on user_progress;
  drop policy if exists "Users can view their own messages" on chat_messages;
  drop policy if exists "Users can insert their own messages" on chat_messages;
  drop policy if exists "Anyone can view community quizzes" on community_quizzes;
  drop policy if exists "Users can insert their own community quizzes" on community_quizzes;
  drop policy if exists "Anyone can view test sessions" on test_sessions;
  drop policy if exists "Users can create test sessions" on test_sessions;
  drop policy if exists "Anyone can join sessions" on session_participants;
  drop policy if exists "Participants can update their score" on session_participants;
end $$;

create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Anyone can view courses" on courses for select using (true);
create policy "Anyone can view lessons" on lessons for select using (true);
create policy "Anyone can view questions" on questions for select using (true);
create policy "Users can view their own progress" on user_progress for select using (auth.uid() = user_id);
create policy "Users can update their own progress" on user_progress for insert with check (auth.uid() = user_id);
create policy "Users can view their own messages" on chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert their own messages" on chat_messages for insert with check (auth.uid() = user_id);
create policy "Anyone can view community quizzes" on community_quizzes for select using (true);
create policy "Users can insert their own community quizzes" on community_quizzes for insert with check (auth.uid() = user_id);
create policy "Users can update their own community quizzes" on community_quizzes for update using (auth.uid() = user_id);
create policy "Users can delete their own community quizzes" on community_quizzes for delete using (auth.uid() = user_id);
create policy "Anyone can view test sessions" on test_sessions for select using (true);
create policy "Users can create test sessions" on test_sessions for insert with check (auth.uid() = created_by);
create policy "Anyone can join sessions" on session_participants for insert with check (auth.uid() = user_id);
create policy "Participants can update their score" on session_participants for update using (auth.uid() = user_id);
-- 10. Achievements
create table if not exists achievements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  icon text, -- material-symbols-outlined name
  requirement_type text not null, -- 'streak', 'xp', 'quizzes_published', 'test_score'
  requirement_value integer not null
);

create table if not exists user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles on delete cascade not null,
  achievement_id uuid references achievements on delete cascade not null,
  unlocked_at timestamp with time zone default now(),
  unique(user_id, achievement_id)
);

-- 11. Test Results History
create table if not exists test_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles on delete cascade not null,
  test_id uuid not null, -- references standard test or community quiz
  test_title text not null,
  score integer not null,
  total_questions integer not null,
  created_at timestamp with time zone default now()
);

-- RLS and Initial Data
alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table test_results enable row level security;

create policy "Anyone can view achievements" on achievements for select using (true);
create policy "Users can view their own achievements" on user_achievements for select using (auth.uid() = user_id);
create policy "Users can view their own test results" on test_results for select using (auth.uid() = user_id);
create policy "Users can insert their own test results" on test_results for insert with check (auth.uid() = user_id);

insert into achievements (title, description, icon, requirement_type, requirement_value) values
('Жас зерттеуші', 'Алғашқы тестті 100% тапсырдыңыз', 'school', 'test_score', 100),
('Квиз шебері', '3 квиз жариялаңыз', 'edit_square', 'quizzes_published', 3),
('Тұрақтылық', '5 күн қатарынан оқыдыңыз', 'local_fire_department', 'streak', 5),
('Білім шыңы', '1000 XP жинадыңыз', 'military_tech', 'xp', 1000);

-- Real-time
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table user_progress;
alter publication supabase_realtime add table community_quizzes;
alter publication supabase_realtime add table session_participants;

-- Trigger for profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url;
  return new;
end;
$$ language plpgsql security definer;

-- Insert Real Courses & Lessons with Video URLs
do $$
declare
  course_id uuid;
begin
  -- Clear existing data to avoid duplicates if re-running
  delete from questions;
  delete from lessons;
  delete from courses;

  -- Python Course
  insert into courses (title, subject, grade, description, image_url, total_lessons)
  values ('Python негіздері', 'БАҒДАРЛАМАЛАУ', '9', 'Бағдарламалау әлеміне алғашқы қадам. Синтаксис, айнымалылар және циклдер.', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4', 5)
  returning id into course_id;

  insert into lessons (course_id, title, content, video_url, order_index) values
  (course_id, 'Python-ға кіріспе', 'Бұл сабақта біз Python тілінің тарихы мен оны орнату жолдарын қарастырамыз.', 'https://www.youtube.com/embed/jBzwzrDvZ18', 1),
  (course_id, 'Айнымалылар мен деректер типтері', 'Айнымалылар - бұл деректерді сақтайтын контейнерлер. Python-да бірнеше негізгі деректер типі бар.', 'https://www.youtube.com/embed/vW1F7_pL8kY', 2);

  insert into questions (course_id, question_text, options, correct_option) values
  (course_id, 'Python тілінде экранға шығару функциясы қалай аталады?', '["output()", "print()", "write()", "console.log()"]', 1),
  (course_id, 'Айнымалы дегеніміз не?', '["Деректер сақталатын орын", "Функция түрі", "Ойын түрі", "Экран беті"]', 0),
  (course_id, 'Python-да бүтін санды қалай белгілейміз?', '["float", "string", "int", "boolean"]', 2),
  (course_id, 'Цикл дегеніміз не?', '["Бір әрекетті қайталау", "Экранды өшіру", "Сурет салу", "Музыка ойнату"]', 0);

  -- Robotics Course
  insert into courses (title, subject, grade, description, image_url, total_lessons)
  values ('Робототехника: Arduino', 'ТЕХНОЛОГИЯ', '10', 'Arduino-мен жұмыс істеуді үйреніп, өз роботыңызды жасаңыз.', 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb', 8)
  returning id into course_id;

  insert into lessons (course_id, title, content, video_url, order_index) values
  (course_id, 'Arduino дегеніміз не?', 'Arduino - бұл микроконтроллерлермен жұмыс істеуге арналған ашық платформа.', 'https://www.youtube.com/embed/D8Hndp6N88w', 1);

  insert into questions (course_id, question_text, options, correct_option) values
  (course_id, 'Arduino-да жарық диодын қосу үшін қай пинді қолданамыз?', '["Digital", "Analog", "Power", "Ground"]', 0),
  (course_id, 'Микроконтроллер дегеніміз не?', '["Кішкентай компьютер", "Үлкен экран", "Батарея", "Сымдар жиынтығы"]', 0);
end $$;
