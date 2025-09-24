import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { ArrowBack, Send as SendIcon } from "@mui/icons-material";
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
  const { t } = useTranslation();

  const defaultPreviousText = previousText || t("form.previous");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: onPrevious ? "space-between" : "flex-end",
        flexDirection: { xs: "column-reverse", sm: "row" },
        gap: 2,
        mt: 4,
        pt: showBorder ? 3 : 0,
        ...(showBorder && {
          borderTop: 1,
          borderColor: "divider",
        }),
      }}>
      {/* Previous Button */}
      {onPrevious && (
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
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
      )}

      {/* Next/Submit Button */}
      <Button
        type={nextType}
        variant="contained"
        disabled={isNextDisabled || isLoading}
        onClick={nextType === "button" ? onNext : undefined}
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : nextIcon
        }
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
    </Box>
  );
};
