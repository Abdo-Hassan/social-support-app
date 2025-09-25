import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    react: {
      useSuspense: true,
    },
    ns: ["common", "personal", "family", "situation", "success"],
    defaultNS: "common",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      // Add request options for better error handling
      requestOptions: {
        cache: "default",
      },
    },
    detection: {
      // Check localStorage first, then browser settings, then HTML lang attribute
      order: ["localStorage", "navigator", "htmlTag"],
      // Cache the detected language in localStorage
      caches: ["localStorage"],
      // Key used in localStorage
      lookupLocalStorage: "i18nextLng",
      // Don't automatically set HTML lang attribute (we do it manually in App.tsx)
      htmlTag: document.documentElement,
    },
    // Preload all namespaces for the detected language
    preload: ["en", "ar"],
    // Load all namespaces upfront
    load: "all",
    // Wait for all resources to load
    partialBundledLanguages: false,
  });

// Helper function to verify localStorage language persistence
export const getStoredLanguage = () => {
  return localStorage.getItem("i18nextLng");
};

// Helper function to manually set language in localStorage (fallback)
export const setStoredLanguage = (lng: string) => {
  localStorage.setItem("i18nextLng", lng);
};

export default i18n;
