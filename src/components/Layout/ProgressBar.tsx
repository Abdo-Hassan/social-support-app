import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Container,
  useTheme,
  useMediaQuery,
  MobileStepper,
} from '@mui/material';
import { useApplication } from '../../contexts/ApplicationContext';

const steps = ['personal', 'family', 'situation'] as const;

export const ProgressBar: React.FC = () => {
  const { t } = useTranslation();
  const { currentStep } = useApplication();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const currentStepIndex = steps.indexOf(currentStep as typeof steps[number]);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;

  if (currentStep === 'success') {
    return null;
  }

  if (isMobile) {
    return (
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <MobileStepper
            variant="progress"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            sx={{
              bgcolor: 'transparent',
              '& .MuiMobileStepper-progress': {
                width: '100%',
                height: 8,
                borderRadius: 4,
              },
            }}
            nextButton={<div />}
            backButton={<div />}
          />
          <Box sx={{ textAlign: 'center', pb: 2 }}>
            <Box sx={{ typography: 'body2', color: 'text.secondary', mb: 0.5 }}>
              Step {activeStep + 1} of {steps.length}
            </Box>
            <Box sx={{ typography: 'subtitle1', fontWeight: 500, color: 'text.primary' }}>
              {t(`steps.${steps[activeStep]}`)}
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            py: 3,
            '& .MuiStepConnector-root': {
              top: 22,
            },
            '& .MuiStepConnector-line': {
              borderColor: 'divider',
              borderTopWidth: 2,
            },
            '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
              borderColor: 'primary.main',
            },
            '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
              borderColor: 'primary.main',
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    typography: 'body2',
                    fontWeight: index === activeStep ? 600 : 400,
                    color: index === activeStep ? 'primary.main' : 'text.secondary',
                    mt: 1,
                  },
                  '& .MuiStepIcon-root': {
                    fontSize: '1.8rem',
                    color: index <= activeStep ? 'primary.main' : 'action.disabled',
                  },
                  '& .MuiStepIcon-text': {
                    fill: 'white',
                    fontWeight: 600,
                  },
                }}
              >
                {t(`steps.${step}`)}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Container>
    </Box>
  );
};