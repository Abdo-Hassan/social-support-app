import React from "react";
import { Box } from "@mui/material";
import { Header } from "../components/Layout/Header";
import { SuccessStep } from "../components/Steps/SuccessStep";

export const ApplicationResultPage: React.FC = () => {
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
          py: { xs: 2, md: 2 },
        }}>
        <SuccessStep />
      </Box>
    </Box>
  );
};
