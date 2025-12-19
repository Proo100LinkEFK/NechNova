
import { GoogleGenAI, Type } from "@google/genai";

export const generateSummary = async (content: string): Promise<string> => {
  // Fix: Initializing GoogleGenAI strictly with process.env.API_KEY as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Напиши краткое описание (summary) для следующей IT новости на русском языке. Максимум 2 предложения: ${content}`,
    });
    // Fix: Accessing .text property directly (not as a method).
    return response.text?.trim() || "Не удалось создать описание.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ошибка при генерации ИИ-описания.";
  }
};

export const suggestTitle = async (content: string): Promise<string> => {
  // Fix: Initializing GoogleGenAI strictly with process.env.API_KEY as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Предложи броский заголовок для следующей статьи на русском языке: ${content}`,
    });
    // Fix: Accessing .text property directly (not as a method).
    return response.text?.trim() || "Новая IT новость";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Без заголовка";
  }
};
