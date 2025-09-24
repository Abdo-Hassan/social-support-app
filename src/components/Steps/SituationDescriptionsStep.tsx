import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  useTheme,
  useMediaQuery,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  AutoAwesome as AIIcon,
  Info as InfoIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { 
  situationDescriptionsSchema, 
  SituationDescriptions, 
  AIAssistanceRequest 
} from '../../types/form';
import { useApplication } from '../../contexts/ApplicationContext';
import { AIAssistanceModal } from '../AI/AIAssistanceModal';

export const SituationDescriptionsStep: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { 
    situationDescriptions, 
    updateSituationDescriptions, 
    setCurrentStep,
    submitting,
    setSubmitting,
    familyFinancial,
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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Card elevation={2}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              {t('situation.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('situation.subtitle')}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {fieldConfigs.map((config, index) => (
              <Box key={config.name} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor={config.name}
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      alignSelf: { xs: 'flex-start', sm: 'center' },
                    }}
                  >
                    {config.label} <span style={{ color: theme.palette.error.main }}>*</span>
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => openAIAssistance(config.name)}
                    startIcon={<AIIcon />}
                    sx={{
                      borderColor: 'secondary.main',
                      color: 'secondary.main',
                      '&:hover': {
                        borderColor: 'secondary.dark',
                        bgcolor: 'secondary.50',
                      },
                      alignSelf: { xs: 'flex-end', sm: 'center' },
                    }}
                  >
                    {t('situation.helpMeWrite')}
                  </Button>
                </Box>
                
                <Controller
                  name={config.name}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id={config.name}
                      multiline
                      rows={6}
                      placeholder={config.placeholder}
                      error={!!errors[config.name]}
                      helperText={
                        errors[config.name]?.message
                          ? t(errors[config.name]?.message as string)
                          : 'Minimum 50 characters. Use the "Help Me Write" button for AI assistance.'
                      }
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '1rem',
                          lineHeight: 1.5,
                        },
                      }}
                    />
                  )}
                />
                
                {index < fieldConfigs.length - 1 && (
                  <Divider sx={{ mt: 4 }} />
                )}
              </Box>
            ))}

            <Alert
              severity="info"
              icon={<InfoIcon />}
              sx={{
                mb: 4,
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {t('situation.aiAssistance')}
              </Typography>
              <Typography variant="body2">
                Click "Help Me Write" next to any field to get AI-powered suggestions 
                tailored to your specific situation. You can accept, edit, or discard 
                the suggestions as needed.
              </Typography>
            </Alert>

            {/* Navigation */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                gap: 2,
                pt: 3,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevious}
                startIcon={<ArrowBack />}
                disabled={submitting}
                size="large"
                sx={{
                  minWidth: { xs: '100%', sm: 150 },
                  py: 1.5,
                }}
              >
                {t('form.previous')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || submitting}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                size="large"
                sx={{
                  minWidth: { xs: '100%', sm: 180 },
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {submitting ? t('form.loading') : t('form.submit')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

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
    </Box>
  );
};