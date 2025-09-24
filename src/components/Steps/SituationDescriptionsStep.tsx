import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  situationDescriptionsSchema, 
  SituationDescriptions, 
  AIAssistanceRequest 
} from '../../types/form';
import { useApplication } from '../../contexts/ApplicationContext';
import { AIAssistanceModal } from '../AI/AIAssistanceModal';

export const SituationDescriptionsStep: React.FC = () => {
  const { t } = useTranslation();
  const { 
    situationDescriptions, 
    updateSituationDescriptions, 
    setCurrentStep,
    setSubmitting,
    familyFinancial,
    personalInfo
  } = useApplication();

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [currentAIRequest, setCurrentAIRequest] = useState<AIAssistanceRequest | null>(null);
  const [activeField, setActiveField] = useState<keyof SituationDescriptions | null>(null);

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid }, 
    watch,
    setValue,
    getValues
  } = useForm<SituationDescriptions>({
    resolver: zodResolver(situationDescriptionsSchema),
    defaultValues: situationDescriptions as SituationDescriptions,
    mode: 'onChange'
  });

  // Auto-save on form changes
  const watchedValues = watch();
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSituationDescriptions(watchedValues);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedValues, updateSituationDescriptions]);

  const openAIAssistance = (field: keyof SituationDescriptions) => {
    const request: AIAssistanceRequest = {
      field: field as AIAssistanceRequest['field'],
      context: {
        employmentStatus: familyFinancial?.employmentStatus,
        monthlyIncome: familyFinancial?.monthlyIncome,
        maritalStatus: familyFinancial?.maritalStatus,
        dependents: familyFinancial?.dependents,
        existingText: getValues(field)
      }
    };

    setCurrentAIRequest(request);
    setActiveField(field);
    setAiModalOpen(true);
  };

  const handleAIAccept = (text: string) => {
    if (activeField) {
      setValue(activeField, text, { shouldValidate: true, shouldDirty: true });
    }
    setAiModalOpen(false);
    setActiveField(null);
  };

  const handleAIEdit = (text: string) => {
    if (activeField) {
      setValue(activeField, text, { shouldValidate: true, shouldDirty: true });
      // Focus on the textarea after a brief delay
      setTimeout(() => {
        const textarea = document.getElementById(activeField);
        if (textarea) {
          textarea.focus();
          // Place cursor at the end
          (textarea as HTMLTextAreaElement).setSelectionRange(text.length, text.length);
        }
      }, 100);
    }
    setAiModalOpen(false);
    setActiveField(null);
  };

  const onSubmit = async (data: SituationDescriptions) => {
    setSubmitting(true);
    updateSituationDescriptions(data);
    
    // Simulate API submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock reference number
      const referenceNumber = `SSP-${Date.now().toString().slice(-8)}`;
      
      // Navigate to success page
      setCurrentStep('success');
    } catch (error) {
      console.error('Submission error:', error);
      // Handle error - show toast or error message
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevious = () => {
    setCurrentStep('family');
  };

  const fieldConfigs = [
    {
      name: 'financialSituation' as const,
      label: t('situation.financialSituation'),
      placeholder: t('situation.financialPlaceholder')
    },
    {
      name: 'employmentCircumstances' as const,
      label: t('situation.employmentCircumstances'),
      placeholder: t('situation.employmentPlaceholder')
    },
    {
      name: 'reasonForApplying' as const,
      label: t('situation.reasonForApplying'),
      placeholder: t('situation.reasonPlaceholder')
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="form-section">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t('situation.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('situation.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {fieldConfigs.map((config) => (
            <div key={config.name} className="form-field">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={config.name} className="form-label">
                  {config.label} <span className="text-error">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => openAIAssistance(config.name)}
                  className="btn-secondary text-sm px-4 py-2"
                  aria-label={`${t('situation.helpMeWrite')} for ${config.label}`}
                >
                  <svg 
                    className="w-4 h-4 mr-2 inline" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" 
                    />
                  </svg>
                  {t('situation.helpMeWrite')}
                </button>
              </div>
              
              <Controller
                name={config.name}
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id={config.name}
                    className="form-textarea"
                    rows={6}
                    placeholder={config.placeholder}
                    aria-describedby={
                      errors[config.name] ? `${config.name}-error` : `${config.name}-help`
                    }
                    aria-invalid={!!errors[config.name]}
                  />
                )}
              />
              
              {errors[config.name] && (
                <p id={`${config.name}-error`} className="form-error" role="alert">
                  {t(errors[config.name]?.message as string)}
                </p>
              )}
              
              <p id={`${config.name}-help`} className="form-helper">
                Minimum 50 characters. Use the "Help Me Write" button for AI assistance.
              </p>
            </div>
          ))}

          <div className="bg-muted/30 border border-border rounded-md p-4">
            <div className="flex items-start">
              <svg 
                className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  {t('situation.aiAssistance')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Click "Help Me Write" next to any field to get AI-powered suggestions 
                  tailored to your specific situation. You can accept, edit, or discard 
                  the suggestions as needed.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handlePrevious}
              className="btn-outline"
            >
              {t('form.previous')}
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="btn-primary"
              aria-describedby={!isValid ? 'form-invalid' : undefined}
            >
              {t('form.submit')}
            </button>
            {!isValid && (
              <p id="form-invalid" className="sr-only">
                Please complete all required fields before submitting
              </p>
            )}
          </div>
        </form>
      </div>

      {/* AI Assistance Modal */}
      {aiModalOpen && currentAIRequest && (
        <AIAssistanceModal
          isOpen={aiModalOpen}
          onClose={() => {
            setAiModalOpen(false);
            setActiveField(null);
          }}
          onAccept={handleAIAccept}
          onEdit={handleAIEdit}
          request={currentAIRequest}
        />
      )}
    </div>
  );
};