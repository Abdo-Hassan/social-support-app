import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { ArrowBack, ArrowForward, Send as SendIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext: () => void;
  previousText?: string;
  nextText: string;
  nextIcon?: React.ReactNode;
  isLoading?: boolean;
  isNextDisabled?: boolean;
  nextType?: "button" | "submit";
  showBorder?: boolean;
  previousDisabled?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  previousText,
  nextText,
  nextIcon = <SendIcon />,
  isLoading = false,
  isNextDisabled = false,
  nextType = "submit",
  showBorder = true,
  previousDisabled = false,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const defaultPreviousText = previousText || t("form.previous");

  // Create button elements
  const PreviousButton = onPrevious && (
    <Button
      variant="outlined"
      {...(isRtl
        ? { startIcon: <ArrowForward /> }
        : { startIcon: <ArrowBack /> })}
      onClick={onPrevious}
      disabled={previousDisabled || isLoading}
      size="medium"
      sx={{
        minWidth: { xs: "100%", sm: 140 },
        py: 1,
        px: 2,
        fontWeight: 600,
        fontSize: "0.9rem",
        borderRadius: 5,
        textTransform: "none",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
        },
        "&:disabled": {
          bgcolor: "grey.300",
          color: "grey.600",
        },
      }}>
      {defaultPreviousText}
    </Button>
  );

  const NextButton = (
    <Button
      type={nextType}
      variant="contained"
      disabled={isNextDisabled || isLoading}
      onClick={nextType === "button" ? onNext : undefined}
      {...(isRtl
        ? {
            startIcon: isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              nextIcon
            ),
          }
        : {
            endIcon: isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              nextIcon
            ),
          })}
      size="medium"
      sx={{
        minWidth: { xs: "100%", sm: nextText.length > 8 ? 180 : 140 },
        py: 1,
        px: 2,
        fontWeight: 600,
        fontSize: "0.9rem",
        borderRadius: 5,
        textTransform: "none",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
        },
        "&:disabled": {
          bgcolor: "grey.300",
          color: "grey.600",
        },
      }}>
      {nextText}
    </Button>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: onPrevious
          ? "space-between"
          : isRtl
          ? "flex-start"
          : "flex-end",
        flexDirection: {
          xs: "column-reverse",
          sm: isRtl ? "row-reverse" : "row",
        },
        gap: 2,
        mt: 4,
        pt: showBorder ? 3 : 0,
        ...(showBorder && {
          borderTop: 1,
          borderColor: "divider",
        }),
      }}>
      {/* In RTL, show Next button first, then Previous */}
      {isRtl ? (
        <>
          {NextButton}
          {PreviousButton}
        </>
      ) : (
        <>
          {PreviousButton}
          {NextButton}
        </>
      )}
    </Box>
  );
};
