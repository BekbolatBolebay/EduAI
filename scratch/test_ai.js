const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const ALEM_AI_CHAT_URL = process.env.ALEM_AI_CHAT_URL;
const ALEM_AI_CHAT_API_KEY = process.env.ALEM_AI_CHAT_API_KEY;

async function generateTest() {
  console.log("AI-дан тест генерациялануда...");
  
  const prompt = `Сен білім беру саласындағы кәсіби сарапшысың. 
    10-сынып оқушыларына арналған "Физика" пәнінен "Кинематика" тақырыбы бойынша 3 сұрақтан тұратын тест дайында.
    
    Жауапты ТЕК ҚАНА мынадай JSON форматында қайтар:
    {
      "questions": [
        {
          "question": "Сұрақ мәтіні",
          "options": ["Нұсқа 1", "Нұсқа 2", "Нұсқа 3", "Нұсқа 4"],
          "correct": 0
        }
      ]
    }`;

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
          { role: "system", content: "Сен тек JSON форматында жауап беретін көмекшісің." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleanJson = content.replace(/```json|```/g, "").trim();
    const quizData = JSON.parse(cleanJson);

    console.log("--- ГЕНЕРАЦИЯЛАНҒАН ТЕСТ ---");
    console.log(JSON.stringify(quizData, null, 2));
    console.log("----------------------------");
  } catch (error) {
    console.error("Қате кетті:", error.message);
  }
}

generateTest();
