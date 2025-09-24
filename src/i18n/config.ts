import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      navigation: {
        home: "Home",
        application: "Application",
        help: "Help",
        language: "العربية",
      },

      // Progress Steps
      steps: {
        personal: "Personal Information",
        family: "Family & Financial",
        situation: "Situation Descriptions",
        review: "Review & Submit",
        success: "Application Submitted",
      },

      // Step 1 - Personal Information
      personal: {
        title: "Personal Information",
        subtitle: "Please provide your basic personal details",
        name: "Full Name",
        nationalId: "National ID",
        dateOfBirth: "Date of Birth",
        gender: "Gender",
        address: "Street Address",
        city: "City",
        state: "State/Province",
        country: "Country",
        phone: "Phone Number",
        email: "Email Address",
        genderOptions: {
          male: "Male",
          female: "Female",
          other: "Other",
          "prefer-not-to-say": "Prefer not to say",
        },
      },

      // Step 2 - Family & Financial
      family: {
        title: "Family & Financial Information",
        subtitle: "Tell us about your family situation and finances",
        maritalStatus: "Marital Status",
        dependents: "Number of Dependents",
        employmentStatus: "Employment Status",
        monthlyIncome: "Monthly Income",
        housingStatus: "Housing Status",
        maritalOptions: {
          single: "Single",
          married: "Married",
          divorced: "Divorced",
          widowed: "Widowed",
          separated: "Separated",
        },
        employmentOptions: {
          employed: "Employed Full-time",
          partTime: "Employed Part-time",
          unemployed: "Unemployed",
          retired: "Retired",
          student: "Student",
          disabled: "Unable to work due to disability",
        },
        housingOptions: {
          own: "Own Home",
          rent: "Renting",
          family: "Living with Family",
          homeless: "Homeless",
          temporary: "Temporary Housing",
        },
      },

      // Step 3 - Situation Descriptions
      situation: {
        title: "Describe Your Situation",
        subtitle:
          "Help us understand your circumstances with detailed descriptions",
        financialSituation: "Current Financial Situation",
        employmentCircumstances: "Employment Circumstances",
        reasonForApplying: "Reason for Applying",
        helpMeWrite: "Help Me Write",
        aiAssistance: "AI Writing Assistant",
        financialPlaceholder:
          "Describe your current financial situation, including any debts, expenses, or financial challenges you're facing...",
        employmentPlaceholder:
          "Explain your current employment situation, including any barriers to employment or recent job loss...",
        reasonPlaceholder:
          "Tell us why you're applying for this assistance and how it will help your situation...",
        aiModal: {
          title: "AI Writing Assistant",
          subtitle:
            "Our AI will help you write a clear and effective description",
          generating: "Generating your personalized text...",
          suggestion: "AI Suggestion",
          accept: "Accept",
          edit: "Accept & Edit",
          discard: "Discard",
          retry: "Try Again",
          error: "Failed to generate text. Please try again.",
          timeout: "Request timed out. Please try again.",
        },
      },

      // Common Form Elements
      form: {
        required: "Required",
        optional: "Optional",
        next: "Next Step",
        previous: "Previous",
        submit: "Submit Application",
        save: "Save Progress",
        loading: "Processing...",
        saved: "Progress saved",
        error: "Please correct the errors below",
      },

      // Validation Messages
      validation: {
        required: "This field is required",
        email: "Please enter a valid email address",
        phone: "Please enter a valid phone number",
        nationalId: "Please enter a valid National ID",
        pastDate: "Date must be in the past",
        adult: "You must be 18 or older",
        minLength: "Must be at least {{min}} characters",
        maxLength: "Must be no more than {{max}} characters",
        numeric: "Please enter a valid number",
        positive: "Must be a positive number",
      },

      // Success Page
      success: {
        title: "Application Submitted Successfully",
        subtitle: "Thank you for your application",
        message:
          "Your application has been received and is being processed. You will receive an email confirmation shortly.",
        referenceNumber: "Reference Number",
        nextSteps: "What happens next?",
        processing:
          "Your application will be reviewed within 5-7 business days",
        contact: "You may be contacted for additional information",
        decision: "You will be notified of the decision by email and mail",
        newApplication: "Submit New Application",
      },
    },
  },
  ar: {
    translation: {
      // Navigation
      navigation: {
        home: "الرئيسية",
        application: "الطلب",
        help: "المساعدة",
        language: "English",
      },

      // Progress Steps
      steps: {
        personal: "المعلومات الشخصية",
        family: "معلومات الأسرة والمالية",
        situation: "وصف الوضع",
        review: "المراجعة والإرسال",
        success: "تم إرسال الطلب",
      },

      // Step 1 - Personal Information
      personal: {
        title: "المعلومات الشخصية",
        subtitle: "يرجى تقديم تفاصيلك الشخصية الأساسية",
        name: "الاسم الكامل",
        nationalId: "رقم الهوية الوطنية",
        dateOfBirth: "تاريخ الميلاد",
        gender: "الجنس",
        address: "عنوان السكن",
        city: "المدينة",
        state: "المنطقة/المحافظة",
        country: "البلد",
        phone: "رقم الهاتف",
        email: "البريد الإلكتروني",
        genderOptions: {
          male: "ذكر",
          female: "أنثى",
          other: "آخر",
          "prefer-not-to-say": "أفضل عدم الإفصاح",
        },
      },

      // Step 2 - Family & Financial
      family: {
        title: "معلومات الأسرة والمالية",
        subtitle: "أخبرنا عن وضع أسرتك ووضعك المالي",
        maritalStatus: "الحالة الاجتماعية",
        dependents: "عدد الأفراد المعالين",
        employmentStatus: "حالة التوظيف",
        monthlyIncome: "الدخل الشهري",
        housingStatus: "وضع السكن",
        maritalOptions: {
          single: "أعزب",
          married: "متزوج",
          divorced: "مطلق",
          widowed: "أرمل",
          separated: "منفصل",
        },
        employmentOptions: {
          employed: "موظف بدوام كامل",
          partTime: "موظف بدوام جزئي",
          unemployed: "عاطل عن العمل",
          retired: "متقاعد",
          student: "طالب",
          disabled: "غير قادر على العمل بسبب الإعاقة",
        },
        housingOptions: {
          own: "منزل مملوك",
          rent: "إيجار",
          family: "العيش مع الأسرة",
          homeless: "بلا مأوى",
          temporary: "سكن مؤقت",
        },
      },

      // Step 3 - Situation Descriptions
      situation: {
        title: "صف وضعك",
        subtitle: "ساعدنا على فهم ظروفك من خلال أوصاف مفصلة",
        financialSituation: "الوضع المالي الحالي",
        employmentCircumstances: "ظروف التوظيف",
        reasonForApplying: "سبب التقدم للطلب",
        helpMeWrite: "ساعدني في الكتابة",
        aiAssistance: "مساعد الكتابة الذكي",
        financialPlaceholder:
          "صف وضعك المالي الحالي، بما في ذلك أي ديون أو نفقات أو تحديات مالية تواجهها...",
        employmentPlaceholder:
          "اشرح وضعك الوظيفي الحالي، بما في ذلك أي عقبات للتوظيف أو فقدان وظيفة مؤخراً...",
        reasonPlaceholder:
          "أخبرنا لماذا تتقدم بطلب للحصول على هذه المساعدة وكيف ستساعد في وضعك...",
        aiModal: {
          title: "مساعد الكتابة الذكي",
          subtitle: "سيساعدك الذكي الاصطناعي في كتابة وصف واضح وفعال",
          generating: "جاري إنتاج النص الشخصي لك...",
          suggestion: "اقتراح الذكي الاصطناعي",
          accept: "قبول",
          edit: "قبول وتحرير",
          discard: "إلغاء",
          retry: "حاول مرة أخرى",
          error: "فشل في إنتاج النص. يرجى المحاولة مرة أخرى.",
          timeout: "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.",
        },
      },

      // Common Form Elements
      form: {
        required: "مطلوب",
        optional: "اختياري",
        next: "الخطوة التالية",
        previous: "السابق",
        submit: "إرسال الطلب",
        save: "حفظ التقدم",
        loading: "جاري المعالجة...",
        saved: "تم حفظ التقدم",
        error: "يرجى تصحيح الأخطاء أدناه",
      },

      // Validation Messages
      validation: {
        required: "هذا الحقل مطلوب",
        email: "يرجى إدخال بريد إلكتروني صحيح",
        phone: "يرجى إدخال رقم هاتف صحيح",
        nationalId: "يرجى إدخال رقم هوية وطنية صحيح",
        pastDate: "يجب أن يكون التاريخ في الماضي",
        adult: "يجب أن تكون 18 سنة أو أكبر",
        minLength: "يجب أن يكون على الأقل {{min}} حروف",
        maxLength: "يجب ألا يزيد عن {{max}} حروف",
        numeric: "يرجى إدخال رقم صحيح",
        positive: "يجب أن يكون رقماً موجباً",
      },

      // Success Page
      success: {
        title: "تم إرسال الطلب بنجاح",
        subtitle: "شكراً لك على طلبك",
        message:
          "تم استلام طلبك وهو قيد المعالجة. ستتلقى رسالة تأكيد عبر البريد الإلكتروني قريباً.",
        referenceNumber: "الرقم المرجعي",
        nextSteps: "ماذا يحدث بعد ذلك؟",
        processing: "ستتم مراجعة طلبك خلال 5-7 أيام عمل",
        contact: "قد يتم الاتصال بك للحصول على معلومات إضافية",
        decision: "ستتم إشعارك بالقرار عبر البريد الإلكتروني والبريد العادي",
        newApplication: "تقديم طلب جديد",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",

  interpolation: {
    escapeValue: false, // react already does escaping
  },

  // Debug mode for development
  debug: false,
});

export default i18n;
