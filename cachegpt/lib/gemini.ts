import { GoogleGenAI } from '@google/genai';

export async function askGemini(prompt: string) {
    try {
        // Ensure you have GEMINI_API_KEY set in your .env file
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return { text: response.text };
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return {
            error: error.message || "Failed to generate content"
        };
    }
}