import { AIAssistanceRequest, AIAssistanceResponse } from "../types/form";
import i18n from "@/i18n/i18n";

// Use Netlify function endpoint (works both locally and in production)
const AI_PROXY_URL = "/.netlify/functions/ai-proxy";

// Configuration constants
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

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

  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Create the fetch request with timeout to our secure proxy
      const fetchPromise = fetch(AI_PROXY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: request.field,
          context: request.context,
          language: currentLanguage,
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

      if (data?.success && data?.suggestion) {
        return {
          success: true,
          suggestion: data.suggestion,
        };
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `AI Proxy attempt ${attempt}/${MAX_RETRIES} failed:`,
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
