import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { Header } from "../components/Layout/Header";
import { EmptyState } from "../components/UI/EmptyState";

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}>
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 2, md: 4 },
        }}>
        <EmptyState
          title={t("common:errors.pageNotFound", "404 - Page Not Found")}
          subtitle={t(
            "common:errors.pageNotFoundDescription",
            "The page you are looking for doesn't exist or has been moved."
          )}
          buttonText={t("common:actions.goHome", "Go to Home")}
          onButtonClick={handleGoHome}
          buttonIcon={<HomeIcon />}
          imageAlt="Page not found"
          maxWidth={600}
        />
      </Box>
    </Box>
  );
};
