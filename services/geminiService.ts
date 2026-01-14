
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Robust local landmark dictionary for Dharmanagar & Panisagar region
 * to be used as a high-quality fallback when API quotas are exhausted.
 */
const DHARMANAGAR_LANDMARKS = [
    "Dharmanagar Railway Station",
    "Panisagar RD Block",
    "Maharaja Bir Bikram Kishore Manikya statue",
    "Netaji Statue",
    "Rabindra Corner",
    "Nazrul Statue",
    "Atal Corner",
    "Kalibari Temple, Dharmanagar",
    "North Tripura District Hospital",
    "Dharmanagar ISBT (Bus Stand)",
    "Dharmanagar Daily Market",
    "Kadamtala Block Office",
    "Dharmanagar Govt. Degree College",
    "Vivekananda Sardha Satabarshiki Mahavidyalaya"
];

export const editRideImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: 'image/png',
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    return null;
  }
};

export const getSmartLocationSuggestions = async (input: string): Promise<{name: string, lat?: number, lng?: number}[]> => {
    if (!input || input.trim().length < 2) return [];
    
    const query = input.toLowerCase();

    try {
        const ai = getAI();
        // Tier 1: Attempt high-precision Maps Grounding
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User is searching for: "${input}" in Dharmanagar or Panisagar, North Tripura. Find exact landmarks.`,
            config: {
                tools: [{ googleMaps: {} }],
            },
        });

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        if (chunks.length > 0) {
            return chunks
                .map((chunk: any) => ({
                    name: chunk.maps?.title || chunk.web?.title || "",
                }))
                .filter(loc => loc.name.length > 0)
                .slice(0, 5);
        }

        // Tier 2: Fallback to structured text parsing if grounding returns no chunks
        const text = response.text || "";
        const lines = text.split('\n')
            .map(line => line.replace(/^\d+\.\s*/, '').replace(/\*/g, '').trim())
            .filter(line => line.length > 3 && !line.toLowerCase().includes('here are'))
            .slice(0, 5);

        if (lines.length > 0) return lines.map(name => ({ name }));

    } catch (e: any) {
        // Handle Quota Exhaustion (429) specifically or general failures
        if (e?.message?.includes('429') || e?.message?.includes('RESOURCE_EXHAUSTED')) {
            console.warn("Gemini Quota Exhausted. Using local lookup engine.");
        } else {
            console.error("Location Service Error:", e);
        }
    }

    // Tier 3: Local Semantic Search (Dharmanagar Engine)
    // This ensures zero downtime for the user even without API availability.
    const locals = DHARMANAGAR_LANDMARKS
        .filter(l => l.toLowerCase().includes(query))
        .map(name => ({ name }));

    // If typing doesn't match specific locals, provide top defaults
    return locals.length > 0 ? locals.slice(0, 5) : DHARMANAGAR_LANDMARKS.slice(0, 5).map(name => ({ name }));
};
