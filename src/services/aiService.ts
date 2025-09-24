import axios from "axios";
import { AIAssistanceRequest, AIAssistanceResponse } from "../types/form";

// OpenAI API Configuration
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const TIMEOUT = 30000; // 30 seconds

// Get OpenAI API key from environment variable
const getApiKey = (): string | null => {
  return process.env.OPENAI_API_KEY || null;
};

// System prompts for different fields
const getSystemPrompt = (
  field: AIAssistanceRequest["field"],
  context: AIAssistanceRequest["context"]
): string => {
  const basePrompt = `You are an AI assistant helping citizens write clear, empathetic, and professional descriptions for a government social support application. 

Guidelines:
- Write in first person
- Be honest and direct but respectful
- Use simple, clear language
- Focus on facts and specific circumstances
- Keep responses between 100-300 words
- Be empathetic but not overly emotional
- Include relevant details that demonstrate need

Context about the applicant:
- Employment Status: ${context.employmentStatus || "Not provided"}
- Monthly Income: ${
    context.monthlyIncome ? `$${context.monthlyIncome}` : "Not provided"
  }
- Marital Status: ${context.maritalStatus || "Not provided"}
- Number of Dependents: ${context.dependents || "Not provided"}
- Existing Text: ${context.existingText || "None"}`;

  switch (field) {
    case "financialSituation":
      return `${basePrompt}

Task: Help write a description of their current financial situation. Include details about:
- Monthly income vs expenses
- Any debts or financial obligations
- Unexpected financial hardships
- Basic needs they're struggling to meet
- Impact on family/dependents

Write a clear, factual description of their financial challenges.`;

    case "employmentCircumstances":
      return `${basePrompt}

Task: Help write a description of their employment circumstances. Include details about:
- Current job status and history
- Barriers to employment (skills, health, transportation, childcare)
- Recent job loss or reduction in hours
- Efforts to find employment or improve situation
- Impact of employment status on family

Write a clear description of their employment situation and challenges.`;

    case "reasonForApplying":
      return `${basePrompt}

Task: Help write a compelling reason for why they're applying for assistance. Include:
- Specific needs the assistance will address
- How it will improve their situation
- Plans for moving toward self-sufficiency
- Impact on family/dependents if assistance is received
- Any immediate or urgent needs

Write a clear explanation of why they need assistance and how it will help.`;

    default:
      return basePrompt;
  }
};

// Generate AI assistance
export const generateAIAssistance = async (
  request: AIAssistanceRequest
): Promise<AIAssistanceResponse> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      success: false,
      error:
        "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.",
    };
  }

  try {
    const systemPrompt = getSystemPrompt(request.field, request.context);

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Please help me write a ${request.field
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()} description for my social support application.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: TIMEOUT,
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return {
        success: true,
        suggestion: response.data.choices[0].message.content.trim(),
      };
    } else {
      return {
        success: false,
        error: "Invalid response from OpenAI API",
      };
    }
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        return {
          success: false,
          error: "Request timed out. Please try again.",
        };
      }

      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Invalid OpenAI API key. Please check your configuration.",
        };
      }

      if (error.response?.status === 429) {
        return {
          success: false,
          error: "API rate limit exceeded. Please try again later.",
        };
      }

      if (error.response?.status >= 500) {
        return {
          success: false,
          error:
            "OpenAI service is temporarily unavailable. Please try again later.",
        };
      }
    }

    return {
      success: false,
      error: "Failed to generate assistance. Please try again.",
    };
  }
};

export const generateMockAIAssistance = async (
  request: AIAssistanceRequest
): Promise<AIAssistanceResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockResponses = {
    financialSituation: `I am currently experiencing significant financial hardship due to my unemployment status. With no steady income, I am struggling to meet basic needs including rent, utilities, and groceries for my family. My monthly expenses exceed $2,000 while I have no regular income. I have been applying for jobs actively but have not yet secured employment. The lack of income has made it increasingly difficult to provide for my dependents and maintain our housing situation. This financial assistance would help bridge the gap while I continue searching for stable employment.`,

    employmentCircumstances: `I have been unemployed for the past three months after my previous employer had to let me go due to company downsizing. Before that, I worked steadily for two years in retail. I am actively searching for employment and have submitted applications to numerous positions in retail, customer service, and warehouse work. However, I face challenges including limited transportation options and the need to arrange childcare for my dependents. I have been utilizing online job boards and visiting potential employers in person. Despite my efforts, I have not yet secured a new position, which has created this urgent need for temporary financial support.`,

    reasonForApplying: `I am applying for this financial assistance to help stabilize my family's situation during this challenging period of unemployment. The assistance would primarily help cover essential expenses including housing, utilities, and food while I continue my active job search. This support would prevent us from falling behind on rent and ensure my dependents have their basic needs met. I am committed to finding employment and becoming self-sufficient again. This temporary assistance would provide the stability needed to focus on securing stable employment without the immediate stress of potential eviction or utility disconnection. I believe with this support, I can successfully transition back to financial independence.`,
  };

  return {
    success: true,
    suggestion: mockResponses[request.field],
  };
};
