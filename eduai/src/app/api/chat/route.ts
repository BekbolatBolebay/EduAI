import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Check if the user is asking for an image
    const isImageRequest =
      lastMessage.toLowerCase().includes("сурет") ||
      lastMessage.toLowerCase().includes("draw") ||
      lastMessage.toLowerCase().includes("image");

    if (isImageRequest) {
      const imageResponse = await fetch(process.env.ALEM_AI_IMAGE_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ALEM_AI_IMAGE_API_KEY}`,
        },
        body: JSON.stringify({
          model: "text-to-image",
          prompt: lastMessage,
          size: "50x50", // As per user specification
        }),
      });

      const imageData = await imageResponse.json();
      return NextResponse.json({
        role: "assistant",
        content: "Міне, сіз сұраған сурет:",
        image_url: imageData.data?.[0]?.url || imageData.url,
      });
    }

    // Default: Chat completion
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
            content: "Сен EduAI жобасының ақылды менторысың. Қазақ тілінде білім беруге көмектесесің.",
          },
          ...messages.map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    const chatData = await chatResponse.json();
    return NextResponse.json(chatData.choices[0].message);
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json(
      { error: "AI-мен байланыс кезінде қате кетті" },
      { status: 500 }
    );
  }
}
