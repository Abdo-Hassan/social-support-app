import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { useApplication } from "../../hooks/use-application";

const useSteps = () => {
  const { t } = useTranslation();
  return [
    { key: "personal", label: t("steps.personal") },
    { key: "family", label: t("steps.family") },
    { key: "situation", label: t("steps.situation") },
  ] as const;
};

export const ProgressBar: React.FC = () => {
  const { t } = useTranslation();
  const { currentStep } = useApplication();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const steps = useSteps();

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;

  if (currentStep === "success") {
    return null;
  }

  if (isMobile) {
    return (
      <Box
        role="navigation"
        aria-label="Application steps"
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          py: 3,
        }}>
        <Container maxWidth="lg">
          {/* Mobile Progress Dots */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            {steps.map((_, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor:
                      index < activeStep
                        ? "#10B981" // Green for completed
                        : index === activeStep
                        ? "primary.main" // Blue for active
                        : "#E5E7EB", // Gray for pending
                    mx: 0.5,
                  }}
                  {...(index === activeStep && { "aria-current": "step" })}
                />
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      width: 20,
                      height: 2,
                      bgcolor: index < activeStep ? "#10B981" : "#E5E7EB",
                      mx: 0.5,
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>

          {/* Current Step Info */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Step {activeStep + 1} of {steps.length}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, color: "text.primary" }}>
              {steps[activeStep].label}
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      role="navigation"
      aria-label="Application steps"
      sx={{
        py: 2,
      }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", maxWidth: 800 }}>
            {steps.map((step, index) => (
              <Box
                key={step.key}
                sx={{ display: "flex", alignItems: "center" }}>
                {/* Step Circle and Content */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}>
                  {/* Step Circle */}
                  <Box
                    sx={{
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        index < activeStep
                          ? "#29A366" // Green for completed
                          : index === activeStep
                          ? "primary.main" // Blue for active
                          : "#E5E7EB", // Gray for pending
                      color:
                        index < activeStep
                          ? "white" // White checkmark on green
                          : index === activeStep
                          ? "white" // White number on blue
                          : "#9CA3AF", // Gray number on gray
                      fontWeight: 600,
                      fontSize: "1rem",
                      mb: 1,
                    }}
                    {...(index === activeStep && { "aria-current": "step" })}>
                    {index < activeStep ? (
                      <Check sx={{ fontSize: "1.2rem" }} />
                    ) : (
                      index + 1
                    )}
                  </Box>

                  {/* Step Label */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color:
                        index === activeStep
                          ? "primary.main"
                          : "text.secondary",
                      textAlign: "center",
                      maxWidth: 160,
                      lineHeight: 1.3,
                    }}>
                    {step.label}
                  </Typography>
                </Box>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      width: 120,
                      height: 2,
                      bgcolor: index < activeStep ? "#10B981" : "#E5E7EB",
                      mx: 2,
                      mb: 0,
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
