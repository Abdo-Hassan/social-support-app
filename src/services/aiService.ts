import { AIAssistanceRequest, AIAssistanceResponse } from "../types/form";
import i18n from "../i18n/config";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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

  const basePromptAR = `أنت مساعد ذكي تساعد المواطنين في كتابة أوصاف واضحة ومتعاطفة ومهنية لطلب المساعدة الحكومية.

الإرشادات:
- اكتب بصيغة المتكلم
- كن صادقاً ومباشراً لكن محترماً
- استخدم لغة بسيطة وواضحة
- ركز على الحقائق والظروف المحددة
- اجعل الردود بين 100-300 كلمة
- كن متعاطفاً لكن ليس مفرط العاطفة
- ادرج التفاصيل ذات الصلة التي تثبت الحاجة
- أجب باللغة العربية

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

// Generate AI assistance
export const generateAIAssistance = async (
  request: AIAssistanceRequest
): Promise<AIAssistanceResponse> => {
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      error:
        "OpenAI API key not configured. Please set VITE_OPENAI_API_KEY environment variable.",
    };
  }

  try {
    const systemPrompt = getSystemPrompt(request.field, request.context);
    const currentLanguage = i18n.language;
    const isArabic = currentLanguage === "ar";

    const userPrompt = isArabic
      ? `يرجى مساعدتي في كتابة وصف ${request.field} لطلب المساعدة الاجتماعية الخاص بي.`
      : `Please help me write a ${request.field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} description for my social support application.`;

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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      return {
        success: true,
        suggestion: data.choices[0].message.content.trim(),
      };
    } else {
      return {
        success: false,
        error: "Invalid response from OpenAI API",
      };
    }
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return {
          success: false,
          error: "Invalid OpenAI API key. Please check your configuration.",
        };
      }

      if (error.message.includes("429")) {
        return {
          success: false,
          error: "API rate limit exceeded. Please try again later.",
        };
      }

      if (error.message.includes("5")) {
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

// Mock AI service for demo purposes (when no API key is available)
export const generateMockAIAssistance = async (
  request: AIAssistanceRequest
): Promise<AIAssistanceResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === "ar";

  const mockResponsesEN = {
    financialSituation: `I am currently experiencing significant financial hardship due to my unemployment status. With no steady income, I am struggling to meet basic needs including rent, utilities, and groceries for my family. My monthly expenses exceed $2,000 while I have no regular income. I have been applying for jobs actively but have not yet secured employment. The lack of income has made it increasingly difficult to provide for my dependents and maintain our housing situation. This financial assistance would help bridge the gap while I continue searching for stable employment.`,

    employmentCircumstances: `I have been unemployed for the past three months after my previous employer had to let me go due to company downsizing. Before that, I worked steadily for two years in retail. I am actively searching for employment and have submitted applications to numerous positions in retail, customer service, and warehouse work. However, I face challenges including limited transportation options and the need to arrange childcare for my dependents. I have been utilizing online job boards and visiting potential employers in person. Despite my efforts, I have not yet secured a new position, which has created this urgent need for temporary financial support.`,

    reasonForApplying: `I am applying for this financial assistance to help stabilize my family's situation during this challenging period of unemployment. The assistance would primarily help cover essential expenses including housing, utilities, and food while I continue my active job search. This support would prevent us from falling behind on rent and ensure my dependents have their basic needs met. I am committed to finding employment and becoming self-sufficient again. This temporary assistance would provide the stability needed to focus on securing stable employment without the immediate stress of potential eviction or utility disconnection. I believe with this support, I can successfully transition back to financial independence.`,
  };

  const mockResponsesAR = {
    financialSituation: `أواجه حالياً صعوبات مالية كبيرة بسبب وضعي كعاطل عن العمل. بدون دخل ثابت، أواجه صعوبة في تلبية الاحتياجات الأساسية بما في ذلك الإيجار والمرافق والطعام لعائلتي. تتجاوز مصاريفي الشهرية 2000 دولار بينما ليس لدي دخل منتظم. لقد كنت أتقدم للوظائف بنشاط لكنني لم أحصل على عمل بعد. أدى نقص الدخل إلى جعل الأمر صعباً بشكل متزايد لإعالة المعالين والحفاظ على وضع السكن. ستساعد هذه المساعدة المالية في سد الفجوة بينما أواصل البحث عن عمل مستقر.`,

    employmentCircumstances: `لقد كنت عاطلاً عن العمل لمدة ثلاثة أشهر بعد أن اضطر صاحب العمل السابق لتسريحي بسبب تقليص حجم الشركة. قبل ذلك، عملت بانتظام لمدة عامين في قطاع التجزئة. أبحث بنشاط عن عمل وقدمت طلبات لعدة مناصب في التجزئة وخدمة العملاء وأعمال المستودعات. ومع ذلك، أواجه تحديات بما في ذلك خيارات النقل المحدودة والحاجة لترتيب رعاية الأطفال للمعالين. كنت أستخدم مواقع البحث عن الوظائف وأزور أصحاب العمل المحتملين شخصياً. رغم جهودي، لم أحصل على منصب جديد بعد، مما خلق هذه الحاجة الملحة للدعم المالي المؤقت.`,

    reasonForApplying: `أتقدم بطلب هذه المساعدة المالية لمساعدة في استقرار وضع عائلتي خلال هذه الفترة الصعبة من البطالة. ستساعد المساعدة بشكل أساسي في تغطية النفقات الأساسية بما في ذلك السكن والمرافق والطعام بينما أواصل البحث النشط عن عمل. سيمنع هذا الدعم من التأخر في دفع الإيجار ويضمن تلبية الاحتياجات الأساسية للمعالين. أنا ملتزم بإيجاد عمل والعودة للاكتفاء الذاتي مرة أخرى. ستوفر هذه المساعدة المؤقتة الاستقرار المطلوب للتركيز على تأمين عمل مستقر دون الضغط الفوري من احتمال الإخلاء أو قطع المرافق. أعتقد أنه بهذا الدعم، يمكنني الانتقال بنجاح إلى الاستقلال المالي مرة أخرى.`,
  };

  const responses = isArabic ? mockResponsesAR : mockResponsesEN;

  return {
    success: true,
    suggestion: responses[request.field],
  };
};
