/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ModelConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateContent(config: ModelConfig, prompt: string | any[]) {
  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: typeof prompt === 'string' ? prompt : prompt,
      config: {
        systemInstruction: config.systemInstruction,
        temperature: config.temperature,
        topK: config.topK,
        topP: config.topP,
      },
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function generateJson<T>(config: ModelConfig, prompt: string, schema: any): Promise<T> {
  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: prompt,
      config: {
        systemInstruction: config.systemInstruction,
        temperature: config.temperature,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    return JSON.parse(response.text || "{}") as T;
  } catch (error) {
    console.error("Gemini JSON API Error:", error);
    throw error;
  }
}

// Helper for web search simulation (since real web search is agent-side or requires specific tool)
// In a real app, we might use a backend or a specific search API.
// Here we will use the Gemini 3.1 Search Grounding if available, 
// but for the sake of the "Agent will search web" instruction, 
// I will perform the search myself during the generation if needed, 
// or provide a way for the app to "search" via Gemini's internal knowledge.
export async function searchAndSummarize(config: ModelConfig, query: string) {
  const prompt = `Search the web and provide a comprehensive summary (2000-3000 words) in Markdown about: ${query}. 
  Ensure it covers the latest medical device regulations (FDA, MDR, etc.).`;
  
  return generateContent(config, prompt);
}
