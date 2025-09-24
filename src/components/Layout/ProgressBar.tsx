import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormStep } from '../../types/form';

interface ProgressBarProps {
  currentStep: FormStep;
}

interface StepInfo {
  id: FormStep;
  translationKey: string;
  stepNumber: number;
}

const steps: StepInfo[] = [
  { id: 'personal', translationKey: 'steps.personal', stepNumber: 1 },
  { id: 'family', translationKey: 'steps.family', stepNumber: 2 },
  { id: 'situation', translationKey: 'steps.situation', stepNumber: 3 },
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const { t } = useTranslation();

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const getStepStatus = (stepIndex: number, currentIndex: number) => {
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const currentStepIndex = getCurrentStepIndex();

  // Don't show progress bar on success page
  if (currentStep === 'success') {
    return null;
  }

  return (
    <div className="step-progress" role="progressbar" aria-valuemin={0} aria-valuemax={3} aria-valuenow={currentStepIndex + 1}>
      {steps.map((step, index) => {
        const status = getStepStatus(index, currentStepIndex);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="step-item">
            <div className="flex items-center">
              <div 
                className={`step-circle ${status}`}
                aria-label={`Step ${step.stepNumber}: ${t(step.translationKey)}`}
              >
                {status === 'completed' ? (
                  <svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ) : (
                  <span>{step.stepNumber}</span>
                )}
              </div>
              
              <div className="ml-3 min-w-0">
                <p className={`text-sm font-medium ${
                  status === 'active' ? 'text-primary' : 
                  status === 'completed' ? 'text-success' : 
                  'text-muted-foreground'
                }`}>
                  {t(step.translationKey)}
                </p>
              </div>
            </div>

            {!isLast && (
              <div 
                className={`step-connector ${currentStepIndex > index ? 'completed' : ''}`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};