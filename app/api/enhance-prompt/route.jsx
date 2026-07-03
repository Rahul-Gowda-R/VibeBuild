import { enhancePrompt } from "@/configs/AiModel";
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

    const result = await enhancePrompt(prompt);

    return NextResponse.json({
      enhancedPrompt: result.trim(),
      success: true,
    });

  } catch (error) {
    console.error("Enhance Prompt Error:", error);

    return NextResponse.json(
      {
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}