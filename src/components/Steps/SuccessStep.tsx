import React from "react";
import { useTranslation } from "react-i18next";
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
} from "@mui/material";
import {
  Check as CheckIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useApplication } from "../../hooks/use-application";

export const SuccessStep: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { resetApplication } = useApplication();

  // Generate mock reference number
  const referenceNumber = `SSP-${
    Math.floor(Math.random() * 90000000) + 10000000
  }`;

  const handleNewApplication = () => {
    resetApplication();
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(referenceNumber);
    // You could add a toast notification here
  };

  const nextSteps = [
    "Your application will be reviewed within 5-7 business days",
    "You may be contacted for additional information",
    "You will be notified of the decision by email and mail",
  ];

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: { xs: 2, md: 3 } }}>
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
          Application Submitted Successfully
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, lineHeight: 1.6 }}>
          Thank you for your application
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
              Reference Number
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
                SSP-{referenceNumber}
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
            Your application has been received and is being processed. You will
            receive an email confirmation shortly.
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
              What happens next?
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
          startIcon={<RefreshIcon />}
          size="large"
          sx={{
            minWidth: { xs: "100%", sm: 220 },
            py: 1.5,
            fontWeight: 600,
          }}>
          Submit New Application
        </Button>
      </Box>
    </Box>
  );
};
