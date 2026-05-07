import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function transcribeAudio(file: File): Promise<string> {
  const base64Data = await fileToBase64(file);
  const mimeType = file.type;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        {
          text: `You are an elite music transcription AI. Analyze the provided audio/video and generate a high-fidelity ABC notation score.

Core Requirements:
1. Multi-Track Detection: If multiple instruments/voices are present, use ABC's multi-track features (V:1, V:2, etc.).
2. Labeling: Title the piece appropriately based on style/context.
3. Harmony: Include chord symbols (e.g., "C", "G7", "Dm") above the melody lines.
4. Professional Notation: Use standard ABC metadata (X, T, M, L, K) and ensure rhythmic integrity.

Return ONLY the ABC notation string. No markdown, no intro/outro.`,
        },
      ],
    },
  });

  return response.text || "";
}

export async function suggestChords(abcNotation: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: {
      parts: [
        {
          text: `You are a music theory expert. Given the following ABC notation melody, please add appropriate chord symbols (like "C", "Dm7", "G7") before the notes. 
          
Ensure the chords match the harmonic rhythm of the piece. 
Return ONLY the updated ABC notation string.

ABC Notation:
${abcNotation}`,
        },
      ],
    },
  });

  return response.text || abcNotation;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}
