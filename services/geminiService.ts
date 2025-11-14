import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Q&A feature will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const askWaterSafetyQuestion = async (question: string): Promise<string> => {
  if (!API_KEY) {
    return "The Q&A feature is currently unavailable. Please check the API key configuration.";
  }
  
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = "You are a helpful assistant specializing in water safety, sanitation, and E. coli testing, specifically for community initiatives in rural India like Uppalapadu. Provide clear, concise, and practical advice. Do not mention that you are an AI model.";
    
    const response = await ai.models.generateContent({
        model: model,
        contents: `Question: ${question}`,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.95,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error while trying to answer your question. Please try again later.";
  }
};


export const generateEcoliTestImage = async (): Promise<string> => {
    if (!API_KEY) {
        throw new Error("The Image Generation feature is currently unavailable. Please check the API key configuration.");
    }

    try {
        const model = 'gemini-2.5-flash-image';
        const prompt = "A high-quality, clear photograph of two E. coli water test kit vials side-by-side against a neutral, well-lit background. The vial on the left should contain a clear, pale yellow liquid, indicating a NEGATIVE result for E. coli. The vial on the right should contain a vibrant, fluorescent yellow-green liquid, indicating a POSITIVE result for E. coli. Both vials should be clearly labeled.";

        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("No image data found in API response.");

    } catch (error) {
        console.error("Error calling Gemini API for image generation:", error);
        throw new Error("Sorry, I encountered an error while trying to generate the image. Please try again later.");
    }
};
