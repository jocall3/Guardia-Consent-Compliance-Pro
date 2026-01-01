
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const performPrivacyAssessment = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class Privacy and Compliance Officer. Provide concise, expert analysis on privacy impact assessments, GDPR/CCPA compliance, and policy gaps. Use bullet points and clear headings.",
        temperature: 0.7,
      },
    });

    return response.text || "No assessment could be generated at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with AI Compliance Assistant.");
  }
};
