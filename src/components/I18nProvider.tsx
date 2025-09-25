import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  // This will trigger Suspense if translations are not ready
  const { t, ready } = useTranslation([
    "common",
    "personal",
    "family",
    "situation",
    "success",
  ]);

  // If translations are not ready, this will trigger Suspense
  if (!ready) {
    throw new Promise((resolve) => {
      i18n.loadNamespaces(
        ["common", "personal", "family", "situation", "success"],
        resolve
      );
    });
  }

  return <>{children}</>;
};
