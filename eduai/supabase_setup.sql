-- 1. Profiles table (extends Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  grade text,
  xp integer default 0,
  streak integer default 0,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- 2. Courses table
create table courses (
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
create table lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses on delete cascade not null,
  title text not null,
  content text,
  video_url text,
  order_index integer default 0,
  created_at timestamp with time zone default now()
);

-- 4. Questions table (for tests)
create table questions (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses on delete cascade not null,
  question_text text not null,
  options jsonb not null, -- Array of strings
  correct_option integer not null, -- Index of correct option
  created_at timestamp with time zone default now()
);

-- 5. User Progress table
create table user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id uuid references courses on delete cascade not null,
  progress_percent integer default 0,
  last_accessed timestamp with time zone default now(),
  unique(user_id, course_id)
);

-- 6. Chat Messages table
create table chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  role text check (role in ('user', 'assistant')),
  content text not null,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table questions enable row level security;
alter table user_progress enable row level security;
alter table chat_messages enable row level security;

-- Policies
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Anyone can view courses" on courses for select using (true);
create policy "Anyone can view lessons" on lessons for select using (true);
create policy "Anyone can view questions" on questions for select using (true);
create policy "Users can view their own progress" on user_progress for select using (auth.uid() = user_id);
create policy "Users can update their own progress" on user_progress for insert with check (auth.uid() = user_id);
create policy "Users can view their own messages" on chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert their own messages" on chat_messages for insert with check (auth.uid() = user_id);

-- Real-time
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table user_progress;

-- Trigger for profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
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
  (course_id, 'Айнымалы дегеніміз не?', '["Деректер сақталатын орын", "Функция түрі", "Ойын түрі", "Экран беті"]', 0);

  -- Robotics Course
  insert into courses (title, subject, grade, description, image_url, total_lessons)
  values ('Робототехника: Arduino', 'ТЕХНОЛОГИЯ', '10', 'Arduino-мен жұмыс істеуді үйреніп, өз роботыңызды жасаңыз.', 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb', 8)
  returning id into course_id;

  insert into lessons (course_id, title, content, video_url, order_index) values
  (course_id, 'Arduino дегеніміз не?', 'Arduino - бұл микроконтроллерлермен жұмыс істеуге арналған ашық платформа.', 'https://www.youtube.com/embed/D8Hndp6N88w', 1);

  insert into questions (course_id, question_text, options, correct_option) values
  (course_id, 'Arduino-да жарық диодын қосу үшін қай пинді қолданамыз?', '["Digital", "Analog", "Power", "Ground"]', 0);
end $$;
