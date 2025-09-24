import React from "react";
import { useTranslation } from "react-i18next";
import { Language } from "../../types/form";

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage: Language = currentLanguage === "en" ? "ar" : "en";
    onLanguageChange(newLanguage);
  };

  return (
    <header
      className="bg-card border-b border-card-border shadow-sm"
      role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  SSP
                </span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-foreground">
                  Social Support Portal
                </h1>
                <p className="text-sm text-muted-foreground">
                  Government Financial Assistance Application
                </p>
              </div>
            </div>
          </div>

          <nav
            className="flex items-center space-x-4"
            role="navigation"
            aria-label="Main navigation">
            <button
              onClick={toggleLanguage}
              className="btn-ghost text-sm"
              aria-label={`Switch to ${
                currentLanguage === "en" ? "Arabic" : "English"
              }`}>
              {t("navigation.language")}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
