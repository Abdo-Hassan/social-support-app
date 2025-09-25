import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS, ar } from "date-fns/locale";
import { ApplicationProvider } from "./contexts/ApplicationProvider";
import { Header } from "./components/Layout/Header";
import { ProgressBar } from "./components/Layout/ProgressBar";
import { LoadingSpinner } from "./components/UI/LoadingSpinner";
import { I18nProvider } from "./components/I18nProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { createAppTheme } from "./theme";
import { useApplication } from "./hooks/use-application";
import { ApplicationPage } from "./pages/ApplicationPage";
import { ApplicationResultPage } from "./pages/ApplicationResultPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const dateLocale = isRtl ? ar : enUS;
  const theme = React.useMemo(
    () => createAppTheme(i18n.language),
    [i18n.language]
  );

  useEffect(() => {
    // Set document direction and language attributes
    const dir = isRtl ? "rtl" : "ltr";
    const lang = i18n.language;

    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);

    // Set the dir attribute on the body for better CSS support
    document.body.setAttribute("dir", dir);
  }, [i18n.language, isRtl]);

  // Ensure language is loaded on mount
  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng");
    if (
      storedLang &&
      ["en", "ar"].includes(storedLang) &&
      storedLang !== i18n.language
    ) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={dateLocale}>
          <CssBaseline />
          <ErrorBoundary>
            <I18nProvider>
              <ApplicationProvider>
                <Routes>
                  <Route path="/" element={<ApplicationPage />} />
                  <Route
                    path="/application-result"
                    element={<ApplicationResultPage />}
                  />
                  {/* 404 catch-all route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </ApplicationProvider>
            </I18nProvider>
          </ErrorBoundary>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
