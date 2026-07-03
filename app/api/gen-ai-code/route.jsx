import { generateCode } from "@/configs/AiModel";
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

    const generatedResponse = await generateCode(prompt);

    if (generatedResponse?.files) {
      return NextResponse.json(generatedResponse);
    }

    console.error("Gen Code response invalid:", { generatedResponse });

    return NextResponse.json(
      {
        error: "Unable to generate valid code files.",
        generatedResponse,
      },
      { status: 500 }
    );

  } catch (e) {
    console.error("Gen Code Error:", e);

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