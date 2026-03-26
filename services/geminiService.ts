/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Modality } from "@google/genai";
import { Asset, PlacedLayer } from "../types";

/**
 * Helper to strip the data URL prefix (e.g. "data:image/png;base64,")
 */
const getBase64Data = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

/**
 * Generates a product mockup by compositing multiple logos onto a product image.
 */
export const generateMockup = async (
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[],
  instruction: string
): Promise<string> => {
  try {
    // Create instance here to get latest key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = 'gemini-2.5-flash-image';

    // 1. Add Product Base
    const parts: any[] = [
      {
        inlineData: {
          mimeType: product.mimeType,
          data: getBase64Data(product.data),
        },
      },
    ];

    // 2. Add All Logos
    let layoutHints = "";
    layers.forEach((layer, index) => {
      parts.push({
        inlineData: {
          mimeType: layer.asset.mimeType,
          data: getBase64Data(layer.asset.data),
        },
      });

      // Construct simple positioning hint (assuming 0,0 is top-left)
      const vPos = layer.placement.y < 33 ? "top" : layer.placement.y > 66 ? "bottom" : "center";
      const hPos = layer.placement.x < 33 ? "left" : layer.placement.x > 66 ? "right" : "center";
      
      layoutHints += `\n- Logo ${index + 1}: Place at ${vPos}-${hPos} area (approx coords: ${Math.round(layer.placement.x)}% x, ${Math.round(layer.placement.y)}% y). Scale: ${layer.placement.scale}.`;
    });

    // 3. Add Instructions
    const finalPrompt = `
    User Instructions: ${instruction}
    
    Layout Guidance based on user's rough placement on canvas:
    ${layoutHints}

    System Task: Composite the provided logo images (images 2-${layers.length + 1}) onto the first image (the product) to create a realistic product mockup. 
    Follow the Layout Guidance for positioning if provided, but prioritize realistic surface warping, lighting, and perspective blending.
    Output ONLY the resulting image.
    `;

    parts.push({ text: finalPrompt });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                 return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Mockup generation failed:", error);
    throw error;
  }
};

/**
 * Generates a new logo or product base from scratch using text.
 */
export const generateAsset = async (prompt: string, type: 'logo' | 'product' | 'model3d'): Promise<string> => {
   try {
    if (type === 'model3d') {
      throw new Error("3D Model generation is not supported yet.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = 'gemini-2.5-flash-image';
    
    const enhancedPrompt = type === 'logo' 
        ? `A high-quality, professional vector-style logo design of a ${prompt}. Isolated on a pure white background. Minimalist and clean, single distinct logo.`
        : `Professional studio product photography of a single ${prompt}. Ghost mannequin style or flat lay. Front view, isolated on neutral background. High resolution, photorealistic. Single object only, no stacks, no duplicates.`;

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [{ text: enhancedPrompt }]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                 return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
     throw new Error("No image generated");

   } catch (error) {
       console.error("Asset generation failed:", error);
       throw error;
   }
}

/**
 * Generates creative prompts based on user input (code, text, or images).
 */
export const generatePrompts = async (
  textInput: string,
  assets: Asset[],
  targetType: 'image' | 'animation' | 'video' | 'code'
): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = 'gemini-3-flash-preview';

    const parts: any[] = [];
    
    // Add text/code input
    parts.push({ text: `Source Input (Code/Text): \n${textInput}` });

    // Add visual assets
    assets.forEach(asset => {
      if (asset.type !== 'model3d') {
        parts.push({
          inlineData: {
            mimeType: asset.mimeType,
            data: getBase64Data(asset.data),
          },
        });
      }
    });

    const systemPrompt = `
      You are a Senior UI/UX Designer and Expert Frontend Developer for the "PrecioHogar" project.
      
      Project Context (PrecioHogar):
      - Framework: Next.js 16.2.1 (App Router), TypeScript 5.9.3 (Strict), pnpm.
      - Backend: Supabase (Source of Truth, snake_case).
      - Design System: "The Radiant Curator" (Editorial Surfaces).
        - Colors: Background (#f7f6f5), Foreground (#2e2f2f), Primary (#af2700), Secondary/Accent (#ff7856).
        - Typography: 'Epilogue' (Display/Headings), 'Plus Jakarta Sans' (Body).
        - UI Patterns: Modern Editorial, Glassmorphism (.glass), Ambient Shadows (shadow-ambient).
        - Components: shadcn/ui (Radix UI + Tailwind), Lucide React icons, Framer Motion for animations.
      
      Task: Analyze the provided source input (code, HTML/TSX, or description) and any attached images/logos.
      
      If targetType is 'code':
      - Analyze the provided code for bugs, performance issues, or design inconsistencies.
      - Generate 3 distinct versions of "Improved Code" or "Refactored Snippets".
      - Focus on these specific improvements:
        1. GRAPHIC DESIGN (The Radiant Curator):
           - Refine visual hierarchy and negative space.
           - Apply sophisticated glassmorphism and ambient shadows.
           - Use primary color (#af2700) and gradients (from #af2700 to #ff7856) effectively.
           - Improve iconography (Lucide) and image treatment.
        2. ANIMATIONS & MICROINTERACTIONS:
           - Add smooth entry transitions (fade-ins, slide-ups) using staggered animations for lists (Framer Motion).
           - Implement microinteractions on hover/active states (1.02x scale, elevation changes).
           - Include elegant state transitions or skeletons.
        3. FUNCTIONALITY & UX:
           - Optimize user flows and CTA clarity.
           - Ensure accessibility and legibility (Epilogue/Plus Jakarta Sans).
           - Provide clear visual feedback for interactive elements.
        4. RESPONSIVENESS:
           - Ensure flawless behavior on desktop, tablet, and mobile.
           - Adjust grids and paddings for small screens.
      - Return the code snippets as strings in the JSON array.
      
      If targetType is 'image', 'animation', or 'video':
      - Generate 3 distinct, high-quality, and detailed prompts for creating a ${targetType} that is directly inspired by or adapted from this input.
      - Ensure the prompts align with the "Modern Editorial" and "Vibrant" style of PrecioHogar.
      
      Return ONLY a JSON array of strings.
    `;

    parts.push({ text: systemPrompt });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (text) {
      const result = JSON.parse(text);
      if (Array.isArray(result)) {
        return result;
      }
    }
    throw new Error("Invalid response from prompt generator");

  } catch (error) {
    console.error("Prompt generation failed:", error);
    throw error;
  }
};
