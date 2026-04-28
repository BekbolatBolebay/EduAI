import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { subject, grade, topic, count = 10 } = await req.json();

    const prompt = `Сен білім беру саласындағы кәсіби сарапшы және әдіскерсің. 
    ${grade} оқушыларына арналған "${subject}" пәнінен "${topic}" тақырыбы бойынша мемлекеттік білім беру стандартына сай ${count} сұрақтан тұратын кешенді тест дайында.
    
    Талаптар:
    1. Сұрақтар тек жай білімді емес, сонымен қатар логикалық ойлауды және алған білімді қолдануды тексеруі керек.
    2. Әр сұрақтың 4 нұсқасы болуы тиіс, оның біреуі ғана дұрыс.
    3. Сұрақтар мен нұсқалар академиялық тілде, сауатты жазылуы керек.
    4. Қиындық деңгейі: орташа және жоғары.
    
    Жауапты ТЕК ҚАНА мынадай JSON форматында қайтар (ешқандай қосымша мәтінсіз):
    {
      "questions": [
        {
          "question": "Сұрақ мәтіні",
          "options": ["Нұсқа 1", "Нұсқа 2", "Нұсқа 3", "Нұсқа 4"],
          "correct": 0
        }
      ]
    }
    
    Маңызды: Сұрақтардың сапасына және ${grade} бағдарламасына сәйкестігіне баса назар аудар.`;

    const response = await fetch(process.env.ALEM_AI_CHAT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ALEM_AI_CHAT_API_KEY}`,
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

    return NextResponse.json(quizData);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Генерация кезінде қате кетті" }, { status: 500 });
  }
}
