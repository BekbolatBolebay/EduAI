# EduAI — Жасанды Интеллектке негізделген білім беру платформасы

EduAI — мектеп оқушыларына арналған заманауи оқу платформасы. Платформа жасанды интеллект (Alem AI) көмегімен оқушыларға жеке менторлық жасайды, тесттер ұсынады және оқу процесін қызықты әрі тиімді етеді.

## 🚀 Технологиялық стек

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI Integration**: [Alem AI](https://llm.alem.ai/) (Text & Image Generation)
- **Icons**: Material Symbols & Google Fonts (Plus Jakarta Sans)

## ✨ Негізгі мүмкіндіктер

1.  **AI Ментор (Robot Mentor)**:
    - AlemLLM моделі негізіндегі ақылды чат.
    - Мәтіндік сұрақтарға жауап беру және суреттер генерациялау (Text-to-Image).
    - Чат тарихын сақтау мүмкіндігі.
2.  **Оқу курстары (Courses)**:
    - Бағдарламалау (Python), Робототехника және т.б. курстар.
    - Бейнесабақтар интеграциясы (YouTube).
3.  **Тестілеу жүйесі (Tests)**:
    - Әр курс бойынша деңгейді тексеруге арналған интерактивті тесттер.
    - Нәтижелерді бірден есептеу.
4.  **Жеке Профиль (Gamification)**:
    - XP ұпайлары мен Streak (күндік рекордтар).
    - Пайдаланушының оқу прогресін бақылау.
5.  **Қауіпсіздік**:
    - Supabase Auth арқылы толық қорғалған тіркелу және кіру жүйесі.

## 📁 Жоба құрылымы

- `eduai/`: Негізгі Next.js қосымшасы (Frontend & Backend).
- `eduai_legacy/`: Жобаның алғашқы (HTML/Static) нұсқалары.
- `supabase_setup.sql`: Дерекқорды баптауға арналған SQL скрипт.

## 🛠 Орнату және іске қосу

1.  **Репозиторийді көшіру:**
    ```bash
    git clone https://github.com/BekbolatBolebay/EduAI.git
    cd EduAI/eduai
    ```

2.  **Тәуелділіктерді орнату:**
    ```bash
    npm install
    ```

3.  **Environment Variables баптау:**
    `.env.local` файлын жасап, Supabase және Alem AI кілттерін қосыңыз.

4.  **Жобаны қосу:**
    ```bash
    npm run dev
    ```

## 🌐 Vercel-ге орналастыру (Deployment)

Vercel-ге салған кезде **Root Directory** ретінде `eduai` папкасын таңдаңыз.

---
Жоба авторы: **Bekbolat Bolebay**
