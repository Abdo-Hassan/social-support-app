import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "./UI/LoadingSpinner";
import i18n from "../i18n/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const { ready } = useTranslation([
    "common",
    "personal",
    "family",
    "situation",
    "success",
  ]);

  useEffect(() => {
    const checkReady = () => {
      // Check if all namespaces are loaded
      const requiredNamespaces = [
        "common",
        "personal",
        "family",
        "situation",
        "success",
      ];
      const currentLanguage = i18n.language;

      const allLoaded = requiredNamespaces.every(
        (ns) =>
          i18n.hasResourceBundle(currentLanguage, ns) ||
          i18n.hasResourceBundle("en", ns) // fallback
      );

      if (allLoaded && ready) {
        setIsReady(true);
      }
    };

    // Initial check
    checkReady();

    // Listen for language changes and resource loading
    i18n.on("loaded", checkReady);
    i18n.on("languageChanged", checkReady);

    return () => {
      i18n.off("loaded", checkReady);
      i18n.off("languageChanged", checkReady);
    };
  }, [ready]);

  if (!isReady) {
    return <LoadingSpinner message="Loading translations..." />;
  }

  return <>{children}</>;
};
