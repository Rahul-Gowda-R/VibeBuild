import { GoogleGenAI } from "@google/genai";
import Prompt from "../data/Prompt.jsx";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// ================= CHAT =================
export async function sendChatMessage(prompt) {
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `
${Prompt.CHAT_PROMPT}

User Request:
${prompt}
`,
    config: {
      temperature: 0.7,
    },
  });

  return response.text?.trim() || "";
}

// ================= ENHANCE PROMPT =================
export async function enhancePrompt(prompt) {
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `
${Prompt.ENHANCE_PROMPT_RULES}

User Prompt:
${prompt}
`,
    config: {
      temperature: 0.4,
    },
  });

  return response.text?.trim() || "";
}

// ================= CODE GENERATION =================
export async function generateCode(prompt) {
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `
${Prompt.CODE_GEN_PROMPT}

User Request:
${prompt}
`,
    config: {
      temperature: 0,
      responseMimeType: "application/json",
    },
  });

  const text = response.text?.trim() || "";

  try {
    return JSON.parse(cleanJsonResponse(text));
  } catch (error) {
    console.error("JSON Parse Error:", error);
    console.log(text);

    return {
      raw: text,
    };
  }
}

// ================= CLEAN JSON =================
export function cleanJsonResponse(text) {
  return text.replace(/```json|```/g, "").trim();
}