import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS, ar } from 'date-fns/locale';
import { ApplicationProvider } from './contexts/ApplicationContext';
import { Header } from './components/Layout/Header';
import { ProgressBar } from './components/Layout/ProgressBar';
import { Footer } from './components/Layout/Footer';
import { PersonalInfoStep } from './components/Steps/PersonalInfoStep';
import { FamilyFinancialStep } from './components/Steps/FamilyFinancialStep';
import { SituationDescriptionsStep } from './components/Steps/SituationDescriptionsStep';
import { SuccessStep } from './components/Steps/SuccessStep';
import { useApplication } from './contexts/ApplicationContext';
import { theme } from './theme/theme';
import './i18n/config';


const AppContent: React.FC = () => {
  const { currentStep } = useApplication();
  
  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoStep />;
      case 'family':
        return <FamilyFinancialStep />;
      case 'situation':
        return <SituationDescriptionsStep />;
      case 'success':
        return <SuccessStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <ProgressBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 2, md: 4 },
        }}
      >
        {renderStep()}
      </Box>
      <Footer />
    </Box>
  );
};

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const dateLocale = isRtl ? ar : enUS;

  useEffect(() => {
    // Set document direction and language
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language, isRtl]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocale}>
        <CssBaseline />
        <ApplicationProvider>
          <AppContent />
        </ApplicationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;