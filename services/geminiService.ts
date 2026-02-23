
import { GoogleGenAI } from "@google/genai";
import { IP_VISUAL_IDENTITY } from "../constants";

export interface EnhancedPromptResult {
  prompt: string;
  groundingMetadata?: {
    webSearchQueries?: string[];
    groundingChunks?: Array<{
      web?: { uri?: string; title?: string };
    }>;
  };
}

export async function generateEnhancedPrompt(
  product: string, 
  userInput: string, 
  merchantName?: string,
  textOnRight?: boolean
): Promise<EnhancedPromptResult> {
  // Initialize API
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // If not International Payments, just return user input as prompt
  if (product !== 'international') {
    return { prompt: userInput };
  }

  try {
    const textSide = textOnRight ? "RIGHT" : "LEFT";
    const objectSide = textOnRight ? "LEFT" : "RIGHT";

    let promptContext = `
      ${IP_VISUAL_IDENTITY.promptGenerationRules.systemPrompt}
      
      VISUAL DNA & RULES:
      - Summary: ${IP_VISUAL_IDENTITY.visualDNA.summary}
      - Mandatory Elements: ${IP_VISUAL_IDENTITY.promptGenerationRules.mandatoryElements.join(", ")}
      - Visual Rules: ${JSON.stringify(IP_VISUAL_IDENTITY.visualDNA.visualRules)}
      
      LAYOUT REQUIREMENT:
      - The text will overlay on the ${textSide} side of the banner.
      - Therefore, ${IP_VISUAL_IDENTITY.promptGenerationRules.textSideAwareness.replace("textOnLeft is true", textOnRight ? "false" : "true").replace("textOnRight is true", textOnRight ? "true" : "false")}
    `;

    let userContent = "";
    let tools = [];

    if (merchantName) {
      userContent = `
        Merchant Name: "${merchantName}". 
        Context: ${userInput || "Create a co-branded visual for this merchant."}
        
        MERCHANT CONTEXT RULES:
        ${IP_VISUAL_IDENTITY.merchantContextRules.instructions}
        
        DOMAIN MAPPING REFERENCE:
        ${JSON.stringify(IP_VISUAL_IDENTITY.domainVisualMapping.domains)}
        
        Task: 1. Search for what this merchant does. 2. Identify their domain. 3. Blend domain objects with IP 3D coins/globe as per rules.
      `;
      
      // Enable Search Grounding for Merchant info
      tools.push({ googleSearch: {} });
    } else {
      userContent = `
        Scenario/Focus: "${userInput || "Global Reach"}".
        
        SCENARIO TEMPLATES:
        ${JSON.stringify(IP_VISUAL_IDENTITY.promptGenerationRules.scenarioTemplates.scenarios)}
        
        Task: Create a detailed image generation prompt for the selected scenario following the IP Visual DNA rules.
      `;
    }

    // Use a text model (gemini-3-flash-preview) for reasoning and prompt construction with tools
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: promptContext + "\n\n" + userContent }] }
      ],
      config: {
        tools: tools.length > 0 ? tools : undefined
      }
    });

    const generatedText = response.text || userInput;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return { 
      prompt: generatedText,
      groundingMetadata: groundingMetadata 
    };

  } catch (error) {
    console.error("Error generating enhanced prompt:", error);
    // Fallback to basic prompt if AI fails
    return { prompt: userInput || "3D globe and floating currency coins, blue sky background, clean composition" };
  }
}

export async function generateBackgroundImage(prompt: string, textOnRight: boolean = false): Promise<string> {
  // Initialize inside the function to ensure we use the latest API key from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  try {
    // Note: The enhanced prompt should already contain layout instructions, but we add them here as a safety net
    // for standard manual prompts.
    const textPosition = textOnRight ? "RIGHT" : "LEFT";
    const subjectPosition = textOnRight ? "LEFT" : "RIGHT";

    const finalPrompt = `${prompt}. 
    CRITICAL: Main subject on the ${subjectPosition}, negative space on the ${textPosition}. 
    High resolution, 8k, 3D render, photorealistic, no text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9", // Closest supported for 1200x628
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}
