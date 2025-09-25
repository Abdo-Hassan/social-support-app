import React, { useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS, ar } from "date-fns/locale";
import { ApplicationProvider } from "./contexts/ApplicationProvider";
import { Header } from "./components/Layout/Header";
import { ProgressBar } from "./components/Layout/ProgressBar";
import { LoadingSpinner } from "./components/UI/LoadingSpinner";
import { createAppTheme } from "./theme";
import "./i18n/i18n";
import { useApplication } from "./hooks/use-application";
import { PersonalInfoStep } from "@/components/Steps/PersonalInfoStep";
import { FamilyFinancialStep } from "@/components/Steps/FamilyFinancialStep";
import { SituationDescriptionsStep } from "@/components/Steps/SituationDescriptionsStep";
import { SuccessStep } from "@/components/Steps/SuccessStep";

const AppContent: React.FC = () => {
  const { currentStep } = useApplication();

  const renderStep = () => {
    switch (currentStep) {
      case "personal":
        return <PersonalInfoStep />;
      case "family":
        return <FamilyFinancialStep />;
      case "situation":
        return <SituationDescriptionsStep />;
      case "success":
        return <SuccessStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}>
      <Header />
      <ProgressBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 2, md: 2 },
        }}>
        {renderStep()}
      </Box>
    </Box>
  );
};

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

    // Also set the dir attribute on the body for better CSS support
    document.body.setAttribute("dir", dir);

    if (process.env.NODE_ENV === "development") {
      console.log(`Document attributes updated: dir=${dir}, lang=${lang}`);
    }
  }, [i18n.language, isRtl]);

  // Ensure language is loaded on mount
  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng");
    if (
      storedLang &&
      ["en", "ar"].includes(storedLang) &&
      storedLang !== i18n.language
    ) {
      if (process.env.NODE_ENV === "development") {
        console.log(`Loading stored language preference: ${storedLang}`);
      }
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={dateLocale}>
        <CssBaseline />
        <Suspense
          fallback={<LoadingSpinner message="Loading application..." />}>
          <ApplicationProvider>
            <AppContent />
          </ApplicationProvider>
        </Suspense>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
