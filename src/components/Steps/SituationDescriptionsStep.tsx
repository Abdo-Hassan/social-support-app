import { zodResolver } from "@hookform/resolvers/zod";
import {
  AutoAwesome as AIIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useApplication } from "../../hooks/use-application";
import api from "../../services/api";
import {
  AIAssistanceRequest,
  SituationDescriptions,
  situationDescriptionsSchema,
} from "../../types/form";
import { AIAssistanceModal } from "../AI/AIAssistanceModal";
import { NavigationButtons } from "../UI/NavigationButtons";

export const SituationDescriptionsStep: React.FC = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    situationDescriptions,
    completeSituationDescriptionsStep,
    setCurrentStep,
    isSubmitting,
    setSubmitting,
    setReferenceNumber,
    saveApplicationResult,
    familyFinancial,
    personalInfo,
    resetApplication,
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
    completeSituationDescriptionsStep(data);

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
        resetApplication();
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
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 0 } }}>
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
                fontSize: { xs: "1rem", md: "1.5rem" },
              }}>
              {t("situation:title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("situation:subtitle")}
            </Typography>
          </Box>

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
                    startIcon={
                      <AIIcon sx={{ ml: isRtl ? 1 : 0, mr: isRtl ? 0 : 1 }} />
                    }
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
                        <span
                          style={{
                            textAlign: isRtl ? "right" : "left",
                            display: "block",
                          }}>
                          {errors[config.name]?.message
                            ? t(errors[config.name]?.message as string)
                            : t("situation:helperText.minCharacters")}
                        </span>
                      }
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "1rem",
                          bgcolor: "background.default",
                          lineHeight: 1.5,
                        },
                        "& textarea": {
                          resize: "vertical",
                          minHeight: "0px", // Equivalent to 6 rows
                        },
                      }}
                    />
                  )}
                />

                {index < fieldConfigs.length - 1 && <Divider sx={{ mt: 4 }} />}
              </Box>
            ))}

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
