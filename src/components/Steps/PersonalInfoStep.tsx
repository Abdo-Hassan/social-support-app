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
    { value: "male", label: t("personal:genderOptions.male") },
    { value: "female", label: t("personal:genderOptions.female") },
    { value: "other", label: t("personal:genderOptions.other") },
    {
      value: "prefer-not-to-say",
      label: t("personal:genderOptions.prefer-not-to-say"),
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, md: 0 }, py: 0 }}>
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
              {t("personal:title")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: "0.95rem" }}>
              {t("personal:subtitle")}
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
                    label={t("personal:name")}
                    placeholder={t("personal:namePlaceholder")}
                    helperText={t("personal:nameHelper")}
                    error={errors.name}
                    required
                  />
                </Grid>

                {/* National ID */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="nationalId"
                    control={control}
                    label={t("personal:nationalId")}
                    placeholder={t("personal:nationalIdPlaceholder")}
                    helperText={t("personal:nationalIdHelper")}
                    error={errors.nationalId}
                    required
                  />
                </Grid>

                {/* Date of Birth */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <DateField
                    name="dateOfBirth"
                    control={control}
                    label={t("personal:dateOfBirth")}
                    helperText={t("personal:dateOfBirthHelper")}
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
                    label={t("personal:gender")}
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
                    label={t("personal:address")}
                    placeholder={t("personal:addressPlaceholder")}
                    error={errors.address}
                    required
                  />
                </Grid>

                {/* City, State, Country */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormField
                    name="city"
                    control={control}
                    label={t("personal:city")}
                    error={errors.city}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormField
                    name="state"
                    control={control}
                    label={t("personal:state")}
                    error={errors.state}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormField
                    name="country"
                    control={control}
                    label={t("personal:country")}
                    error={errors.country}
                    required
                  />
                </Grid>

                {/* Phone and Email */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="phone"
                    control={control}
                    label={t("personal:phone")}
                    placeholder={t("personal:phonePlaceholder")}
                    helperText={t("personal:phoneHelper")}
                    error={errors.phone}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="email"
                    control={control}
                    label={t("personal:email")}
                    type="email"
                    placeholder={t("personal:emailPlaceholder")}
                    helperText={t("personal:emailHelper")}
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
