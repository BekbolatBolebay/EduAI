import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { subject, grade, topic, count = 10 } = await req.json();

    if (!subject || !grade || !topic) {
      return NextResponse.json(
        { error: "Пән, сынып және тақырып қажет" },
        { status: 400 }
      );
    }

    const prompt = `Сен EduAI жобасының білім беру сарапшысысың. 
    ${grade}-сынып оқушыларына арналған "${subject}" пәні бойынша "${topic}" тақырыбында ${count} сұрақтан тұратын тест дайында.
    
    Жауапты ТЕК ҚАНА мынадай JSON форматында қайтар (басқа мәтін қоспа):
    [
      {
        "question": "Сұрақ мәтіні",
        "options": ["нұсқа 1", "нұсқа 2", "нұсқа 3", "нұсқа 4"],
        "correct": 0
      }
    ]
    
    Маңызды: Сұрақтар қызықты әрі оқу бағдарламасына сай болуы керек.`;

    const chatResponse = await fetch(process.env.ALEM_AI_CHAT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ALEM_AI_CHAT_API_KEY}`,
      },
      body: JSON.stringify({
        model: "alemllm",
        messages: [
          {
            role: "system",
            content: "Сен тек JSON форматында жауап беретін сарапшысың. Ешқандай түсініктемесіз тек таза JSON қайтар.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!chatResponse.ok) {
      throw new Error(`AI API error: ${chatResponse.statusText}`);
    }

    const chatData = await chatResponse.json();
    const content = chatData.choices[0].message.content;
    
    // Attempt to parse JSON from the response (in case AI adds markdown blocks)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const quizData = JSON.parse(jsonMatch ? jsonMatch[0] : content);

    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return NextResponse.json(
      { error: "Тест генерациялау кезінде қате кетті" },
      { status: 500 }
    );
  }
}
