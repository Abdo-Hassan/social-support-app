import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
} from "@mui/material";
import {
  ArrowBack,
  AutoAwesome as AIIcon,
  Info as InfoIcon,
  Send as SendIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import {
  situationDescriptionsSchema,
  SituationDescriptions,
  AIAssistanceRequest,
} from "../../types/form";
import { useApplication } from "../../hooks/use-application";
import { AIAssistanceModal } from "../AI/AIAssistanceModal";
import { NavigationButtons } from "../UI/NavigationButtons";
import api from "../../services/api";

export const SituationDescriptionsStep: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    situationDescriptions,
    updateSituationDescriptions,
    setCurrentStep,
    isSubmitting,
    setSubmitting,
    setReferenceNumber,
    saveApplicationResult,
    familyFinancial,
    personalInfo,
  } = useApplication();

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [currentAIRequest, setCurrentAIRequest] =
    useState<AIAssistanceRequest | null>(null);
  const [activeField, setActiveField] = useState<
    keyof SituationDescriptions | null
  >(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
  } = useForm<SituationDescriptions>({
    resolver: zodResolver(situationDescriptionsSchema),
    defaultValues: situationDescriptions as SituationDescriptions,
    mode: "onChange",
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
      field: field as AIAssistanceRequest["field"],
      context: {
        employmentStatus: familyFinancial?.employmentStatus,
        monthlyIncome: familyFinancial?.monthlyIncome,
        maritalStatus: familyFinancial?.maritalStatus,
        dependents: familyFinancial?.dependents,
        existingText: getValues(field),
      },
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
          (textarea as HTMLTextAreaElement).setSelectionRange(
            text.length,
            text.length
          );
        }
      }, 100);
    }
    setAiModalOpen(false);
    setActiveField(null);
  };

  const onSubmit = async (data: SituationDescriptions) => {
    setSubmitting(true);
    setSubmitError(null);
    updateSituationDescriptions(data);

    // Prepare complete form data for submission
    const formData = {
      personalInfo,
      familyFinancial,
      situationDescriptions: data,
    };

    try {
      // Submit application via API
      const response = await api.post("/application/submit", formData);

      if (response.data.code === 200) {
        // Success - set reference number and save application result
        setReferenceNumber(response.data.referenceNumber);
        saveApplicationResult(response.data.referenceNumber);

        // Navigate to application result page
        navigate("/application-result");
      } else {
        // Unexpected success response format
        throw new Error(
          response.data.message || t("situation:errors.unexpectedResponse")
        );
      }
    } catch (error) {
      console.error("Submission error:", error);

      // Handle different types of errors
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError(t("situation:errors.unexpectedError"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevious = () => {
    setCurrentStep("family");
  };

  const fieldConfigs = [
    {
      name: "financialSituation" as const,
      label: t("situation:financialSituation"),
      placeholder: t("situation:financialPlaceholder"),
    },
    {
      name: "employmentCircumstances" as const,
      label: t("situation:employmentCircumstances"),
      placeholder: t("situation:employmentPlaceholder"),
    },
    {
      name: "reasonForApplying" as const,
      label: t("situation:reasonForApplying"),
      placeholder: t("situation:reasonPlaceholder"),
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Card elevation={2}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 1,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}>
              {t("situation:title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("situation:subtitle")}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {fieldConfigs.map((config, index) => (
              <Box key={config.name} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 },
                  }}>
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor={config.name}
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      alignSelf: { xs: "flex-start", sm: "center" },
                    }}>
                    {config.label}{" "}
                    <span style={{ color: theme.palette.error.main }}>*</span>
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => openAIAssistance(config.name)}
                    startIcon={<AIIcon />}
                    sx={{
                      borderColor: "success.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        borderColor: "success.dark",
                        bgcolor: "primary.dark",
                      },
                      alignSelf: { xs: "flex-end", sm: "center" },
                    }}>
                    {t("situation:helpMeWrite")}
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
                          : t("situation:helperText.minCharacters")
                      }
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "1rem",
                          lineHeight: 1.5,
                        },
                      }}
                    />
                  )}
                />

                {index < fieldConfigs.length - 1 && <Divider sx={{ mt: 4 }} />}
              </Box>
            ))}

            <Alert
              severity="info"
              icon={<InfoIcon />}
              sx={{
                mb: 4,
                "& .MuiAlert-message": {
                  width: "100%",
                },
              }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {t("situation:aiAssistance")}
              </Typography>
              <Typography variant="body2">
                {t("situation:helperText.aiDescription")}
              </Typography>
            </Alert>

            {/* Error Alert */}
            {submitError && (
              <Alert
                severity="error"
                icon={<ErrorIcon />}
                sx={{ mb: 4 }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => setSubmitError(null)}>
                    {t("situation:helperText.dismiss")}
                  </Button>
                }>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}>
                  {t("situation:helperText.submissionFailed")}
                </Typography>
                <Typography variant="body2">{submitError}</Typography>
              </Alert>
            )}

            {/* Navigation */}
            <NavigationButtons
              onPrevious={handlePrevious}
              onNext={handleSubmit(onSubmit)}
              nextText={isSubmitting ? t("form.loading") : t("form.submit")}
              nextIcon={<SendIcon />}
              nextType="submit"
              isLoading={isSubmitting}
              isNextDisabled={!isValid || isSubmitting}
              previousDisabled={isSubmitting}
            />
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
