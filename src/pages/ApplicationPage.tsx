import React from "react";
import { Box } from "@mui/material";
import { Header } from "../components/Layout/Header";
import { ProgressBar } from "../components/Layout/ProgressBar";
import { useApplication } from "../hooks/use-application";
import { PersonalInfoStep } from "../components/Steps/PersonalInfoStep";
import { FamilyFinancialStep } from "../components/Steps/FamilyFinancialStep";
import { SituationDescriptionsStep } from "../components/Steps/SituationDescriptionsStep";

export const ApplicationPage: React.FC = () => {
  const { currentStep } = useApplication();

  const renderStep = () => {
    switch (currentStep) {
      case "personal":
        return <PersonalInfoStep />;
      case "family":
        return <FamilyFinancialStep />;
      case "situation":
        return <SituationDescriptionsStep />;
      default:
        return <PersonalInfoStep />;
    }
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
      <ProgressBar />
      <Box
        component="main"
        role="main"
        sx={{
          flex: 1,
          py: { xs: 2, md: 2 },
        }}>
        {renderStep()}
      </Box>
    </Box>
  );
};
