import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute(
      "dir",
      newLang === "ar" ? "rtl" : "ltr"
    );
    document.documentElement.setAttribute("lang", newLang);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
      }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", py: 2, minHeight: 56 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "white",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1.5,
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}>
              SSP
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  lineHeight: 1.2,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}>
                Social Support Portal
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  display: { xs: "none", sm: "block" },
                  fontSize: "0.8rem",
                  mt: 0.25,
                }}>
                Government Financial Assistance Application
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="outlined"
              onClick={toggleLanguage}
              size="small"
              sx={{
                borderColor: "grey.300",
                color: "text.primary",
                borderRadius: 1.5,
                px: 2.5,
                py: 0.75,
                fontSize: "0.8rem",
                fontWeight: 500,
                textTransform: "none",
                minHeight: 32,
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "primary.50",
                  color: "primary.main",
                },
              }}>
              {i18n.language === "en" ? "العربية" : "English"}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
