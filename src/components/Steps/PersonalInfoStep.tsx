import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ar, enUS } from "date-fns/locale";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DateField } from "../UI/DateField";
import { FormField } from "../UI/FormField";
import { NavigationButtons } from "../UI/NavigationButtons";
import { useApplication } from "../../hooks/use-application";
import { PersonalInfo, personalInfoSchema } from "../../types/form";

export const PersonalInfoStep: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { personalInfo, updatePersonalInfo, setCurrentStep } = useApplication();
  const isArabic = i18n.language === "ar";

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo as PersonalInfo,
    mode: "onChange",
  });

  // Auto-save on form changes
  const watchedValues = watch();
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      updatePersonalInfo(watchedValues);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedValues, updatePersonalInfo]);

  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
    setCurrentStep("family");
  };

  const genderOptions = [
    { value: "male", label: t("personal.genderOptions.male") },
    { value: "female", label: t("personal.genderOptions.female") },
    { value: "other", label: t("personal.genderOptions.other") },
    {
      value: "prefer-not-to-say",
      label: t("personal.genderOptions.prefer-not-to-say"),
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, md: 3 }, py: 0 }}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 1,
                fontSize: { xs: "1.5rem", md: "1.5rem" },
              }}>
              Personal Information
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: "0.95rem" }}>
              Please provide your basic personal details
            </Typography>
          </Box>

          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={isArabic ? ar : enUS}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2.5}>
                {/* Full Name */}
                <Grid size={{ xs: 12 }}>
                  <FormField
                    name="name"
                    control={control}
                    label="Full Name"
                    placeholder="Enter your full legal name"
                    helperText="Enter your name as it appears on official documents"
                    error={errors.name}
                    required
                  />
                </Grid>

                {/* National ID */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="nationalId"
                    control={control}
                    label="National ID"
                    placeholder="123456789"
                    helperText="Enter your government-issued National ID number"
                    error={errors.nationalId}
                    required
                  />
                </Grid>

                {/* Date of Birth */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <DateField
                    name="dateOfBirth"
                    control={control}
                    label="Date of Birth"
                    helperText="You must be 18 years or older to apply"
                    error={errors.dateOfBirth}
                    format={isArabic ? "dd/MM/yyyy" : "MM/dd/yyyy"}
                    required
                  />
                </Grid>

                {/* Gender */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="gender"
                    control={control}
                    label="Gender"
                    type="select"
                    options={genderOptions}
                    error={errors.gender}
                    required
                  />
                </Grid>

                {/* Street Address */}
                <Grid size={{ xs: 12 }}>
                  <FormField
                    name="address"
                    control={control}
                    label="Street Address"
                    placeholder="Street address, apartment, suite, etc."
                    error={errors.address}
                    required
                  />
                </Grid>

                {/* City, State, Country */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormField
                    name="city"
                    control={control}
                    label="City"
                    error={errors.city}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormField
                    name="state"
                    control={control}
                    label="State/Province"
                    error={errors.state}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormField
                    name="country"
                    control={control}
                    label="Country"
                    error={errors.country}
                    required
                  />
                </Grid>

                {/* Phone and Email */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="phone"
                    control={control}
                    label="Phone Number"
                    placeholder="+1 234 567 8900"
                    helperText="Include country code if international"
                    error={errors.phone}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="email"
                    control={control}
                    label="Email Address"
                    type="email"
                    placeholder="example@email.com"
                    helperText="We'll use this to contact you about your application"
                    error={errors.email}
                    required
                  />
                </Grid>
              </Grid>

              {/* Navigation */}
              <NavigationButtons
                onNext={handleSubmit(onSubmit)}
                nextText={t("form.next")}
                nextType="submit"
                isNextDisabled={!isValid}
                showBorder={false}
              />
            </Box>
          </LocalizationProvider>
        </CardContent>
      </Card>
    </Box>
  );
};
