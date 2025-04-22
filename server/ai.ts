import OpenAI from "openai";
import { z } from "zod";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-your-key-here" 
});

export interface BrandProfileInput {
  brandName: string;
  tagline?: string;
  missionStatement?: string;
  keywords: string[];
  targetAudience?: string;
  tone: string[];
  industry?: string;
}

export interface ColorPaletteOutput {
  primary: {
    name: string;
    hex: string;
    meaning: string;
  }[];
  secondary: {
    name: string;
    hex: string;
    meaning: string;
  }[];
  accent: {
    name: string;
    hex: string;
    meaning: string;
  }[];
}

export interface TypographyOutput {
  headingFont: string;
  bodyFont: string;
  accentFont?: string;
  typescale: {
    level: string;
    size: string;
    weight: number;
    application: string;
  }[];
}

export interface BrandStoryOutput {
  story: string;
  values: string[];
  personality: string[];
  voiceAndTone: {
    description: string;
    examples: {
      dos: string[];
      donts: string[];
    };
  };
}

export async function generateColorPalette(
  brandProfile: BrandProfileInput
): Promise<ColorPaletteOutput> {
  const prompt = `
    Generate a professional color palette for a brand with the following profile:
    - Brand name: ${brandProfile.brandName}
    - Tagline: ${brandProfile.tagline || "N/A"}
    - Industry: ${brandProfile.industry || "N/A"}
    - Keywords: ${brandProfile.keywords.join(", ")}
    - Target audience: ${brandProfile.targetAudience || "N/A"}
    - Tone/voice: ${brandProfile.tone.join(", ")}
    
    Create a color palette with:
    - 1-2 primary colors that represent the core brand identity
    - 2-3 secondary colors that complement the primary colors
    - 1-2 accent colors for highlights and calls to action
    
    For each color, provide:
    - A descriptive name
    - The hex code
    - A brief explanation of its meaning/significance to the brand
    
    Format your response as JSON with this structure:
    {
      "primary": [{"name": "Color Name", "hex": "#HEXCODE", "meaning": "Meaning"}],
      "secondary": [{"name": "Color Name", "hex": "#HEXCODE", "meaning": "Meaning"}],
      "accent": [{"name": "Color Name", "hex": "#HEXCODE", "meaning": "Meaning"}]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const colorPalette = JSON.parse(content) as ColorPaletteOutput;
    return colorPalette;
  } catch (error) {
    console.error("Error generating color palette:", error);
    throw error;
  }
}

export async function generateTypography(
  brandProfile: BrandProfileInput
): Promise<TypographyOutput> {
  const prompt = `
    Recommend typography for a brand with the following profile:
    - Brand name: ${brandProfile.brandName}
    - Tagline: ${brandProfile.tagline || "N/A"}
    - Industry: ${brandProfile.industry || "N/A"}
    - Keywords: ${brandProfile.keywords.join(", ")}
    - Target audience: ${brandProfile.targetAudience || "N/A"}
    - Tone/voice: ${brandProfile.tone.join(", ")}
    
    Select appropriate fonts from Google Fonts:
    - A heading font that captures the brand personality
    - A body text font that's highly readable
    - An optional accent font for special elements (if needed)
    
    Also create a type scale with size recommendations for:
    - H1, H2, H3, H4 headings
    - Body text, small text
    - Button text and labels
    
    Format your response as JSON with this structure:
    {
      "headingFont": "Font Name",
      "bodyFont": "Font Name",
      "accentFont": "Font Name", // or null if not needed
      "typescale": [
        {"level": "H1", "size": "3rem", "weight": 700, "application": "Main page titles"},
        // Additional entries for other levels
      ]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const typography = JSON.parse(content) as TypographyOutput;
    return typography;
  } catch (error) {
    console.error("Error generating typography:", error);
    throw error;
  }
}

export async function generateBrandStory(
  brandProfile: BrandProfileInput
): Promise<BrandStoryOutput> {
  const prompt = `
    Create a brand story/identity for:
    - Brand name: ${brandProfile.brandName}
    - Tagline: ${brandProfile.tagline || "N/A"}
    - Mission statement: ${brandProfile.missionStatement || "N/A"}
    - Industry: ${brandProfile.industry || "N/A"}
    - Keywords: ${brandProfile.keywords.join(", ")}
    - Target audience: ${brandProfile.targetAudience || "N/A"}
    - Tone/voice: ${brandProfile.tone.join(", ")}
    
    Generate the following:
    1. A compelling brand story (2-3 paragraphs)
    2. 3-5 core brand values with brief explanations
    3. 4-6 brand personality traits
    4. Voice and tone guidelines with examples of do's and don'ts
    
    Format your response as JSON with this structure:
    {
      "story": "Brand story text here...",
      "values": ["Value 1", "Value 2", ...],
      "personality": ["Trait 1", "Trait 2", ...],
      "voiceAndTone": {
        "description": "Overall description of voice and tone",
        "examples": {
          "dos": ["Example 1", "Example 2", ...],
          "donts": ["Example 1", "Example 2", ...]
        }
      }
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const brandStory = JSON.parse(content) as BrandStoryOutput;
    return brandStory;
  } catch (error) {
    console.error("Error generating brand story:", error);
    throw error;
  }
}

export async function generateLogoGuidelines(
  brandProfile: BrandProfileInput,
  colorPalette: ColorPaletteOutput
): Promise<any> {
  const prompt = `
    Create logo usage guidelines for:
    - Brand name: ${brandProfile.brandName}
    - Industry: ${brandProfile.industry || "N/A"}
    - Brand colors: ${JSON.stringify(colorPalette)}
    
    Provide detailed guidelines for:
    1. Logo clear space requirements
    2. Minimum size guidelines
    3. Approved color variations
    4. Improper logo usage examples
    5. Logo placement recommendations
    
    Format your response as JSON.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating logo guidelines:", error);
    throw error;
  }
}

export async function generateDigitalGuidelines(
  brandProfile: BrandProfileInput,
  colorPalette: ColorPaletteOutput,
  typography: TypographyOutput
): Promise<any> {
  const prompt = `
    Create digital design guidelines for:
    - Brand name: ${brandProfile.brandName}
    - Brand colors: ${JSON.stringify(colorPalette)}
    - Typography: ${JSON.stringify(typography)}
    
    Provide guidelines for:
    1. UI component design principles
    2. Digital accessibility standards
    3. Animation and transition specifications
    4. Responsive design principles
    5. Digital asset usage
    
    Format your response as JSON.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating digital guidelines:", error);
    throw error;
  }
}

export async function generatePrintGuidelines(
  brandProfile: BrandProfileInput,
  colorPalette: ColorPaletteOutput,
  typography: TypographyOutput
): Promise<any> {
  const prompt = `
    Create print design guidelines for:
    - Brand name: ${brandProfile.brandName}
    - Brand colors: ${JSON.stringify(colorPalette)}
    - Typography: ${JSON.stringify(typography)}
    
    Provide guidelines for:
    1. Business card specifications
    2. Letterhead and stationery design
    3. Brochure and flyer standards
    4. Print production specifications (paper, finishes)
    5. Large format printing guidelines
    
    Format your response as JSON.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating print guidelines:", error);
    throw error;
  }
}
