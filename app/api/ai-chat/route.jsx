import { sendChatMessage } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await sendChatMessage(prompt);

    return NextResponse.json({
      result,
      success: true,
    });

  } catch (e) {
    console.error("AI Chat Error:", e);

    if (e?.status === 429) {
      return NextResponse.json(
        { error: "Quota exceeded" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}