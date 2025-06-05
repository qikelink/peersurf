// src/lib/groq.ts
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

type PromptParams = {
  style: string;
  keywords: string[];
};

type ChatParams = {
  messages: { role: "user" | "assistant"; content: string }[];
  style: string;
  keywords: string[];
};

export const generateAIPrompt = async ({ style, keywords }: PromptParams) => {
  try {
    const qualityValue = (2 + Math.random() * 2).toFixed(1);
    const creativityValue = (Math.random() * 0.5).toFixed(2);

    const systemMessage = getSystemMessage(style, keywords);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content:
            "Generate a character prompt with emphasis on important elements",
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.8,
      max_tokens: 80,
    });

    let response = chatCompletion.choices[0]?.message?.content || "";

    // Remove any preamble text
    response = response
      .replace(/^(here('s| is) a prompt.*?:|generating.*?:|prompt:)/i, "")
      .trim();

    // If response doesn't already include the parameters, add them
    if (!response.includes("--quality") || !response.includes("--creativity")) {
      response = response
        .replace(/(\s*--quality.*?)?(\s*--creativity.*?)?$/, "")
        .trim();
      response += ` --quality ${qualityValue} --creativity ${creativityValue}`;
    }

    // Clean up formatting
    response = response
      .replace(/\n/g, ", ")
      .replace(/,\s*,/g, ",")
      .replace(/\s+/g, " ")
      .trim();

    return response;
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw new Error("Failed to generate prompt");
  }
};

export const chatWithAI = async ({ messages, style, keywords }: ChatParams) => {
  try {
    const systemMessage = `
      You are a professional prompt engineer for AI image generation, helping users create and refine character descriptions.
      
      Current style: ${style}
      Current keywords: ${keywords.join(", ") || "none"}
      
      RULES:
      - Help users create or refine prompts for image generation
      - Focus on creating concise, rich descriptions of characters (people, creatures, or entities)
      - Always maintain the aesthetic of the style: ${style}
      - Include all keywords when relevant: ${keywords.join(", ") || "none"}
      - Use descriptive terms like: "ultra-realistic", "8k", "high quality" when appropriate
      - Add atmospheric and mood descriptors that complement the style
      - Use parentheses around 2-3 important elements, e.g.: (detailed face), (dramatic lighting)
      - Always include parameters: --quality [value 2.0-4.0] --creativity [value 0.0-0.5]
      - Make the character the central focus of suggestions
      - Format final prompts as a comma-separated list of descriptive elements
      - If asked to improve a prompt, make specific improvements
      - When sharing a complete prompt, put it in quotation marks for easy copying
      - Be conversational, helpful and responsive to user feedback
      - NEVER include any preamble in your responses. Just return the prompt or your response directly.
      - When the user asks for the final prompt, return ONLY the prompt with no explanations or preamble
    `;

    const groqMessages = [
      { role: "system" as const, content: systemMessage },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 150,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";

    const cleanedResponse = response
      .replace(/^(here('s| is) a prompt.*?:|generating.*?:|prompt:)/i, "")
      .trim();

    return cleanedResponse;
  } catch (error) {
    console.error("Error in chat:", error);
    throw new Error("Failed to chat with AI");
  }
};

const getSystemMessage = (style: string, keywords: string[]) => {
  return `
    You are a professional prompt engineer for AI image generation.
    Create a detailed character description using the specified style and keywords.
    
    Follow these rules:
    - Create a concise, rich description of a character (person, creature, or entity)
    - Style: ${style} should strongly influence the character's aesthetic
    - Incorporate all keywords: ${keywords.join(", ") || "none"}
    - The keywords should be relevant to the character's appearance, clothing, and accessories
    - Always include descriptive terms like: "ultra-realistic", "8k", "high quality"
    - Add atmospheric and mood descriptors that complement the style
    - Use parentheses around 2-3 important elements to emphasize them, e.g.: (detailed face), (dramatic lighting)
    - Always end the prompt with parameters: --quality [value] --creativity [value]
    - Make the character the central focus of the prompt
    - Format as a comma-separated list of descriptive elements
    - Output only the final prompt without any preamble
    - Never include any preamble in your responses such as (Here is a character prompt with emphasis on important elements:). Just return the prompt directly.
  `;
};
