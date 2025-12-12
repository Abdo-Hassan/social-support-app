import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useApplication } from "../../hooks/use-application";
import { FamilyFinancial, familyFinancialSchema } from "../../types/form";
import { InputController } from "../UI/InputController";
import { NavigationButtons } from "../UI/NavigationButtons";
import { SelectController } from "../UI/SelectController";

export const FamilyFinancialStep: React.FC = () => {
  const { t } = useTranslation();
  const { familyFinancial, completeFamilyFinancialStep, setCurrentStep } =
    useApplication();
  const theme = useTheme();

  // Convert transformed values back to their schema-expected types
  const normalizedDefaultValues = React.useMemo(() => {
    return {
      ...familyFinancial,
      // monthlyIncome schema expects string, but context may have number after transform
      monthlyIncome:
        familyFinancial.monthlyIncome !== undefined
          ? String(familyFinancial.monthlyIncome)
          : undefined,
    } as unknown as Partial<FamilyFinancial>;
  }, [familyFinancial]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FamilyFinancial>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(familyFinancialSchema) as any,
    defaultValues: normalizedDefaultValues,
    mode: "onChange",
  });

  const onSubmit = (data: FamilyFinancial) => {
    completeFamilyFinancialStep(data);
  };

  const handlePrevious = () => {
    setCurrentStep("personal");
  };

  const maritalOptions = [
    { value: "single", label: t("family:maritalOptions.single") },
    { value: "married", label: t("family:maritalOptions.married") },
    { value: "divorced", label: t("family:maritalOptions.divorced") },
    { value: "widowed", label: t("family:maritalOptions.widowed") },
    { value: "separated", label: t("family:maritalOptions.separated") },
  ];

  const employmentOptions = [
    { value: "employed", label: t("family:employmentOptions.employed") },
    { value: "partTime", label: t("family:employmentOptions.partTime") },
    { value: "unemployed", label: t("family:employmentOptions.unemployed") },
    { value: "retired", label: t("family:employmentOptions.retired") },
    { value: "student", label: t("family:employmentOptions.student") },
    { value: "disabled", label: t("family:employmentOptions.disabled") },
  ];

  const housingOptions = [
    { value: "own", label: t("family:housingOptions.own") },
    { value: "rent", label: t("family:housingOptions.rent") },
    { value: "family", label: t("family:housingOptions.family") },
    { value: "homeless", label: t("family:housingOptions.homeless") },
    { value: "temporary", label: t("family:housingOptions.temporary") },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 0 } }}>
      <Card elevation={2}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 1,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
              }}>
              {t("family:title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("family:subtitle")}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Marital Status */}
              <Grid size={{ xs: 12, md: 6 }}>
                <SelectController<FamilyFinancial>
                  name="maritalStatus"
                  control={control}
                  label={t("family:maritalStatus")}
                  options={maritalOptions}
                  error={errors.maritalStatus}
                  required
                />
              </Grid>

              {/* Number of Dependents */}
              <Grid size={{ xs: 12, md: 6 }}>
                <InputController<FamilyFinancial>
                  name="dependents"
                  control={control}
                  label={t("family:dependents")}
                  type="number"
                  placeholder="0"
                  error={errors.dependents}
                  helperText={t("family:helperText.dependents")}
                  inputProps={{ min: 0, max: 20 }}
                  required
                />
              </Grid>

              {/* Employment Status */}
              <Grid size={{ xs: 12, md: 6 }}>
                <SelectController<FamilyFinancial>
                  name="employmentStatus"
                  control={control}
                  label={t("family:employmentStatus")}
                  options={employmentOptions}
                  error={errors.employmentStatus}
                  required
                />
              </Grid>

              {/* Monthly Income */}
              <Grid size={{ xs: 12, md: 6 }}>
                <InputController<FamilyFinancial>
                  name="monthlyIncome"
                  control={control}
                  label={t("family:monthlyIncome")}
                  type="number"
                  placeholder="0"
                  error={errors.monthlyIncome}
                  helperText={t("family:helperText.monthlyIncome")}
                  startAdornment="$"
                  inputProps={{ min: 0, step: 1 }}
                  required
                />
              </Grid>

              {/* Housing Status */}
              <Grid size={{ xs: 12 }}>
                <SelectController<FamilyFinancial>
                  name="housingStatus"
                  control={control}
                  label={t("family:housingStatus")}
                  options={housingOptions}
                  error={errors.housingStatus}
                  helperText={t("family:helperText.housingStatus")}
                  required
                />
              </Grid>
            </Grid>

            {/* Navigation */}
            <NavigationButtons
              onPrevious={handlePrevious}
              onNext={handleSubmit(onSubmit)}
              nextText={t("form.next")}
              nextType="submit"
              showBorder={false}
              isNextDisabled={!isValid}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
