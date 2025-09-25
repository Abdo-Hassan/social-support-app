import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";
import noApplication from "../../../public/assets/noApplication.svg";

interface EmptyStateProps {
  /**
   * Main title to display
   */
  title: string;
  /**
   * Optional subtitle text
   */
  subtitle?: string;
  /**
   * Optional custom image URL or path
   */
  image?: string;
  /**
   * Alt text for the image
   */
  imageAlt?: string;
  /**
   * Width for the image
   */
  imageWidth?: number;
  /**
   * Height for the image
   */
  imageHeight?: number;
  /**
   * Button text (if not provided, no button will be rendered)
   */
  buttonText?: string;
  /**
   * Button click handler
   */
  onButtonClick?: () => void;
  /**
   * Button icon component
   */
  buttonIcon?: React.ReactElement<SvgIconComponent>;
  /**
   * Button variant
   */
  buttonVariant?: "contained" | "outlined" | "text";
  /**
   * Maximum width of the container
   */
  maxWidth?: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  image = noApplication,
  imageAlt = "Empty state",
  imageWidth = 300,
  imageHeight = 300,
  buttonText,
  onButtonClick,
  buttonIcon,
  buttonVariant = "contained",
  maxWidth = 700,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: maxWidth,
        mx: "auto",
        my: 3,
        p: { xs: 2, md: 0 },
      }}>
      {/* Title */}
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        {title}
      </Typography>

      {/* Subtitle */}
      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, textAlign: "center", lineHeight: 1.6 }}>
          {subtitle}
        </Typography>
      )}

      {/* Image */}
      <img
        src={image}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
        style={{ marginBottom: buttonText ? 24 : 0 }}
      />

      {/* Button */}
      {buttonText && onButtonClick && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant={buttonVariant}
            onClick={onButtonClick}
            startIcon={buttonIcon}
            size="large"
            sx={{
              minWidth: { xs: "100%", sm: 220 },
              py: 1.5,
              fontWeight: 600,
            }}>
            {buttonText}
          </Button>
        </Box>
      )}
    </Box>
  );
};
