import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationProvider, useApplication } from './contexts/ApplicationContext';
import { Language, Direction } from './types/form';

// Import i18n configuration
import './i18n/config';

// Import components
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { ProgressBar } from './components/Layout/ProgressBar';
import { PersonalInfoStep } from './components/Steps/PersonalInfoStep';
import { FamilyFinancialStep } from './components/Steps/FamilyFinancialStep';
import { SituationDescriptionsStep } from './components/Steps/SituationDescriptionsStep';
import { SuccessStep } from './components/Steps/SuccessStep';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const ApplicationWizard: React.FC = () => {
  const { currentStep, isSubmitting } = useApplication();

  const renderCurrentStep = () => {
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
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 py-6" role="main">
        <div className="container mx-auto px-4">
          <ProgressBar currentStep={currentStep} />
          
          <div className="relative">
            {isSubmitting && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
                <div className="bg-card border border-card-border rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <div className="loading-spinner w-6 h-6 mr-3"></div>
                    <span className="text-foreground font-medium">
                      Submitting your application...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {renderCurrentStep()}
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  // Handle language and direction changes
  useEffect(() => {
    const newDirection: Direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    
    // Update document attributes
    document.documentElement.dir = newDirection;
    document.documentElement.lang = currentLanguage;
    
    // Update i18n language
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, i18n]);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
  };

  return (
    <ApplicationProvider>
      <div className={`min-h-screen bg-background text-foreground ${direction}`}>
        <Header 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
        
        <ApplicationWizard />
        
        <Footer />
        
        <Toaster />
        <Sonner />
      </div>
    </ApplicationProvider>
  );
};

export default App;
