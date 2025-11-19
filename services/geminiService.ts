import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure environment variable is handled
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateBusinessInsight = async (contextData: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are an expert Sales Intelligence Analyst for "Comando Lab". 
      Analyze the following data context and provide a concise, futuristic, and actionable business insight in Portuguese.
      Focus on risks or opportunities. Keep it under 50 words.
      
      Context: ${contextData}`,
      config: {
        temperature: 0.7,
      }
    });
    
    return response.text || "Não foi possível gerar insight no momento.";
  } catch (error) {
    console.error("Error generating insight:", error);
    return "Erro ao conectar com a Central de Inteligência.";
  }
};

export const chatWithAnalyst = async (history: {role: string, parts: {text: string}[]}[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: history,
      config: {
        systemInstruction: `Você é o assistente de IA da plataforma Comando Lab Sales Intelligence. 
        Sua persona é profissional, direta e analítica.
        Você ajuda gerentes comerciais e vendedores a entenderem seus números.
        Responda sempre em Português do Brasil.
        Mantenha um tom "futurista corporativo".`,
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};