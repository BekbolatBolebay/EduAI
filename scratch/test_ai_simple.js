const fs = require('fs');

function getEnv(key) {
  const env = fs.readFileSync('.env', 'utf8');
  const lines = env.split('\n');
  for (const line of lines) {
    if (line.startsWith(key + '=')) {
      return line.split('=')[1].trim();
    }
  }
  return null;
}

const ALEM_AI_CHAT_URL = getEnv('ALEM_AI_CHAT_URL');
const ALEM_AI_CHAT_API_KEY = getEnv('ALEM_AI_CHAT_API_KEY');

async function generateTest() {
  console.log("AI-дан тест генерациялануда...");
  
  const prompt = `10-сынып оқушыларына арналған "Физика" пәнінен "Кинематика" тақырыбы бойынша 3 сұрақтан тұратын тест дайында.
    Жауапты ТЕК ҚАНА JSON форматында қайтар:
    { "questions": [ { "question": "...", "options": ["...", "...", "...", "..."], "correct": 0 } ] }`;

  try {
    const response = await fetch(ALEM_AI_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ALEM_AI_CHAT_API_KEY}`,
      },
      body: JSON.stringify({
        model: "alemllm",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    console.log("--- AI ЖАУАБЫ ---");
    console.log(data.choices[0].message.content);
  } catch (error) {
    console.error("Қате кетті:", error.message);
  }
}

generateTest();
