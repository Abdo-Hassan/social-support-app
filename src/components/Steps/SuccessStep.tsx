import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Stack,
  Alert,
} from "@mui/material";
import {
  Check as CheckIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useApplication } from "../../hooks/use-application";
import noApplication from "../../../public/assets/noApplication.svg";
interface SavedApplicationResult {
  referenceNumber: string;
  submissionDate: string;
  personalInfo: Record<string, unknown>;
  familyFinancial: Record<string, unknown>;
  situationDescriptions: Record<string, unknown>;
}

export const SuccessStep: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const {
    resetApplication,
    referenceNumber,
    saveApplicationResult,
    loadApplicationResult,
  } = useApplication();

  const [savedResult, setSavedResult] = useState<SavedApplicationResult | null>(
    null
  );
  const [copySuccess, setCopySuccess] = useState(false);
  const [isResultPage, setIsResultPage] = useState(false);

  // Check if we're on the /application-result route
  useEffect(() => {
    const isOnResultPage = location.pathname === "/application-result";
    setIsResultPage(isOnResultPage);

    if (isOnResultPage) {
      // Load saved result from localStorage
      const result = loadApplicationResult();
      setSavedResult(result);
    } else if (referenceNumber) {
      // Save result when we have a reference number (coming from form submission)
      saveApplicationResult(referenceNumber);
    }
  }, [
    location.pathname,
    referenceNumber,
    loadApplicationResult,
    saveApplicationResult,
  ]);

  // Determine reference number to display
  const displayReferenceNumber =
    (isResultPage && savedResult?.referenceNumber) ||
    referenceNumber ||
    `SSP-${Math.floor(Math.random() * 90000000) + 10000000}`;

  const handleNewApplication = () => {
    if (isResultPage) {
      navigate("/");
      resetApplication();
    }
  };

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(displayReferenceNumber);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.warn("Failed to copy reference number:", error);
    }
  };

  const nextSteps = [
    t("success:processing"),
    t("success:contact"),
    t("success:decision"),
  ];

  // Show error message if no saved result on result page
  if (isResultPage && !savedResult) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 700,
          mx: "auto",
          my: 3,
          p: { xs: 2, md: 3 },
        }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          {t(
            "common:actions.noApplicationFound",
            "No saved application result found."
          )}
        </Typography>

        <img
          src={noApplication}
          alt="no application"
          width={300}
          height={300}
        />
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleNewApplication}
            startIcon={<AddIcon />}
            size="large"
            sx={{
              minWidth: { xs: "100%", sm: 220 },
              py: 1.5,
              fontWeight: 600,
            }}>
            {t("common:actions.applyNewRequest", "Apply New Request")}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: { xs: 2, md: 3 } }}>
      {/* Copy Success Message */}
      {copySuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t(
            "common:actions.copiedToClipboard",
            "Reference number copied to clipboard!"
          )}
        </Alert>
      )}

      <Box sx={{ textAlign: "center", mb: 4 }}>
        {/* Success Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "success.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}>
          <CheckIcon sx={{ fontSize: 40, color: "white" }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 2,
            fontSize: { xs: "1.75rem", md: "2rem" },
          }}>
          {isResultPage
            ? t("success:applicationResult", "Application Result")
            : t("success:title")}
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, lineHeight: 1.6 }}>
          {isResultPage
            ? t(
                "success:resultSubtitle",
                "Here are your application details and reference number."
              )
            : t("success:subtitle")}
        </Typography>
      </Box>

      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Reference Number */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}>
              {t("success:referenceNumber")}
            </Typography>
            <Box
              sx={{
                bgcolor: "primary.50",
                border: 1,
                borderColor: "primary.200",
                borderRadius: 2,
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  fontFamily: "monospace",
                }}>
                {displayReferenceNumber}
              </Typography>
              <IconButton
                onClick={handleCopyReference}
                size="small"
                sx={{
                  color: "primary.main",
                  "&:hover": { bgcolor: "primary.100" },
                }}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}>
            {t("success:message")}
          </Typography>

          {/* What happens next */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 3,
              }}>
              {t("success:nextSteps")}
            </Typography>

            <Stack spacing={2}>
              {nextSteps.map((step, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      flexShrink: 0,
                      mt: 0.25,
                    }}>
                    {index + 1}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.5 }}>
                    {step}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleNewApplication}
          startIcon={isResultPage ? <AddIcon /> : <RefreshIcon />}
          size="large"
          sx={{
            minWidth: { xs: "100%", sm: 220 },
            py: 1.5,
            fontWeight: 600,
          }}>
          {isResultPage
            ? t("common:actions.applyNewRequest", "Apply New Request")
            : t("success:newApplication")}
        </Button>
      </Box>
    </Box>
  );
};
