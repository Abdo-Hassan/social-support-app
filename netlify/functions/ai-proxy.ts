import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface OpenAIRequest {
  field: string;
  context: {
    employmentStatus?: string;
    monthlyIncome?: number;
    maritalStatus?: string;
    dependents?: number;
    existingText?: string;
  };
  language: string;
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// System prompts generation
const getSystemPrompt = (
  field: string,
  context: OpenAIRequest["context"],
  isArabic: boolean
): string => {
  const basePromptEN = `You are an AI assistant helping citizens write clear, empathetic, and professional descriptions for their government assistance application. 

Guidelines:
- Write in first person
- Be honest and direct but respectful
- Use simple, clear language
- Focus on facts and specific circumstances
- Keep responses between 100-300 words
- Be empathetic but not overly emotional
- Include relevant details that demonstrate need
- Respond in English

Context about the applicant:
- Employment Status: ${context.employmentStatus || "Not provided"}
- Monthly Income: ${
    context.monthlyIncome ? `$${context.monthlyIncome}` : "Not provided"
  }
- Marital Status: ${context.maritalStatus || "Not provided"}
- Number of Dependents: ${context.dependents || "Not provided"}
- Existing Text: ${context.existingText || "None"}`;

  const basePromptAR = `أنت مساعد ذكي يساعد المواطنين في كتابة أوصاف واضحة ومهنية لطلب المساعدة الحكومية.

الإرشادات:
- اكتب بصيغة المتكلم فقط
- لا تبدأ بردك بمقدمات مثل "سأكون سعيداً" أو "بالطبع"
- أعطني النص النهائي مباشرة بدون أي تحية أو شرح
- اجعل النص من 100 إلى 300 كلمة
- ركز على الحقائق والظروف المحددة
- كن متعاطفاً لكن ليس مفرط العاطفة
- أجب باللغة العربية فقط
- اجعل الرد صالح للنسخ مباشرة في خانة الطلب

السياق حول المتقدم:
- حالة التوظيف: ${context.employmentStatus || "غير محدد"}
- الدخل الشهري: ${
    context.monthlyIncome ? `$${context.monthlyIncome}` : "غير محدد"
  }
- الحالة الاجتماعية: ${context.maritalStatus || "غير محدد"}
- عدد المعالين: ${context.dependents || "غير محدد"}
- النص الموجود: ${context.existingText || "لا يوجد"}`;

  const basePrompt = isArabic ? basePromptAR : basePromptEN;

  if (isArabic) {
    switch (field) {
      case "financialSituation":
        return `${basePrompt}

اكتب وصفاً واضحاً للوضع المالي الحالي للمتقدم، بما في ذلك أي ديون أو نفقات أو تحديات مالية يواجهها. ركز على الصعوبات المالية المحددة وتأثيرها.`;

      case "employmentCircumstances":
        return `${basePrompt}

اكتب وصفاً واضحاً لوضع توظيف المتقدم، بما في ذلك أي عقبات للتوظيف أو فقدان وظيفة مؤخراً أو تحديات في العثور على عمل. كن محدداً حول الظروف.`;

      case "reasonForApplying":
        return `${basePrompt}

اكتب شرحاً واضحاً لسبب طلب المتقدم لهذه المساعدة وكيف ستساعد في وضعه. ركز على الحاجة المحددة والنتائج المتوقعة.`;

      default:
        return basePrompt;
    }
  } else {
    switch (field) {
      case "financialSituation":
        return `${basePrompt}

Write a clear description of the applicant's current financial situation, including any debts, expenses, or financial challenges they're facing. Focus on specific financial difficulties and their impact.`;

      case "employmentCircumstances":
        return `${basePrompt}

Write a clear description of the applicant's employment situation, including any barriers to employment, recent job loss, or challenges in finding work. Be specific about circumstances.`;

      case "reasonForApplying":
        return `${basePrompt}

Write a clear explanation of why the applicant is seeking this assistance and how it will help their situation. Focus on the specific need and expected outcomes.`;

      default:
        return basePrompt;
    }
  }
};

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*", // In production, replace with your domain
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Check if API key is configured
  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not configured");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Server configuration error",
      }),
    };
  }

  try {
    // Parse request body
    const requestBody: OpenAIRequest = JSON.parse(event.body || "{}");
    const { field, context: userContext, language } = requestBody;

    if (!field) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Missing required field parameter",
        }),
      };
    }

    const isArabic = language === "ar";
    const systemPrompt = getSystemPrompt(field, userContext, isArabic);

    const userPrompt = isArabic
      ? `يرجى مساعدتي في كتابة وصف ${field} لطلب المساعدة الاجتماعية الخاص بي.`
      : `Please help me write a ${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} description for my social support application.`;

    // Call OpenAI API
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", response.status, errorData);

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: `OpenAI API error: ${response.status}`,
        }),
      };
    }

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          suggestion: data.choices[0].message.content.trim(),
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Invalid response from OpenAI",
        }),
      };
    }
  } catch (error) {
    console.error("Error in AI proxy function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
