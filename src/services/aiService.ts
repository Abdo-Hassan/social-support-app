import { AIAssistanceRequest, AIAssistanceResponse } from "../types/form";
import i18n from "@/i18n/i18n";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Configuration constants
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// System prompts for different fields with language support
const getSystemPrompt = (
  field: AIAssistanceRequest["field"],
  context: AIAssistanceRequest["context"]
): string => {
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === "ar";

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

// Helper function to create timeout promise
const createTimeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("REQUEST_TIMEOUT"));
    }, timeout);
  });
};

// Helper function to wait for retry delay
const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Helper function to get user-friendly error messages
const getUserFriendlyError = (error: Error, isArabic: boolean): string => {
  const errorMessage = error.message.toLowerCase();

  if (
    errorMessage.includes("request_timeout") ||
    errorMessage.includes("timeout")
  ) {
    return isArabic
      ? "انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى."
      : "Request timed out. Please try again.";
  }

  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    return isArabic
      ? "خطأ في الاتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى."
      : "Network connection error. Please check your internet connection and try again.";
  }

  if (errorMessage.includes("401")) {
    return isArabic
      ? "نحن نواجه مشكلات تقنية. يرجى المحاولة مرة أخرى لاحقاً."
      : "We are facing some technical issues. Please try again later.";
  }

  if (errorMessage.includes("429")) {
    return isArabic
      ? "تم تجاوز حد الطلبات. يرجى المحاولة بعد قليل."
      : "Too many requests. Please wait a moment and try again.";
  }

  if (errorMessage.includes("5")) {
    return isArabic
      ? "الخدمة غير متوفرة مؤقتاً. يرجى المحاولة لاحقاً."
      : "Service temporarily unavailable. Please try again later.";
  }

  return isArabic
    ? "حدث خطأ أثناء إنتاج المساعدة. يرجى المحاولة مرة أخرى."
    : "An error occurred while generating assistance. Please try again.";
};

// Main AI assistance generation function with retry logic
export const generateAIAssistance = async (
  request: AIAssistanceRequest
): Promise<AIAssistanceResponse> => {
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === "ar";

  if (!OPENAI_API_KEY) {
    return {
      success: false,
      error: isArabic
        ? "لم يتم تكوين مفتاح OpenAI API. يرجى التحقق من الإعدادات."
        : "OpenAI API key not configured. Please check your configuration.",
    };
  }

  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const systemPrompt = getSystemPrompt(request.field, request.context);

      const userPrompt = isArabic
        ? `يرجى مساعدتي في كتابة وصف ${request.field} لطلب المساعدة الاجتماعية الخاص بي.`
        : `Please help me write a ${request.field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} description for my social support application.`;

      // Create the fetch request with timeout
      const fetchPromise = fetch(OPENAI_API_URL, {
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

      // Race between fetch and timeout
      const response = await Promise.race([
        fetchPromise,
        createTimeoutPromise(REQUEST_TIMEOUT),
      ]);

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      const data = await response.json();

      if (data?.choices?.[0]?.message?.content) {
        return {
          success: true,
          suggestion: data.choices[0].message.content.trim(),
        };
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `OpenAI API attempt ${attempt}/${MAX_RETRIES} failed:`,
        lastError.message
      );

      // Don't retry on authentication errors or invalid API key
      if (lastError.message.includes("401")) {
        break;
      }

      // Don't retry on client errors (4xx except 429)
      if (
        lastError.message.includes("4") &&
        !lastError.message.includes("429")
      ) {
        break;
      }

      // If this is not the last attempt, wait before retrying
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
        await wait(delay);
      }
    }
  }

  // All attempts failed, return user-friendly error
  return {
    success: false,
    error: getUserFriendlyError(lastError, isArabic),
  };
};
