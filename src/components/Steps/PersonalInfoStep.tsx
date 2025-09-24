import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS, ar } from 'date-fns/locale';
import { personalInfoSchema, PersonalInfo } from '../../types/form';
import { useApplication } from '../../contexts/ApplicationContext';

export const PersonalInfoStep: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { personalInfo, updatePersonalInfo, setCurrentStep } = useApplication();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isArabic = i18n.language === 'ar';

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo as PersonalInfo,
    mode: 'onChange',
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
    setCurrentStep('family');
  };

  const genderOptions = [
    { value: 'male', label: t('personal.genderOptions.male') },
    { value: 'female', label: t('personal.genderOptions.female') },
    { value: 'other', label: t('personal.genderOptions.other') },
    { value: 'prefer-not-to-say', label: t('personal.genderOptions.prefer-not-to-say') },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Card elevation={2}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              {t('personal.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('personal.subtitle')}
            </Typography>
          </Box>

          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={isArabic ? ar : enUS}
          >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Full Name */}
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <>
                            {t('personal.name')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </>
                        }
                        placeholder="Enter your full legal name"
                        helperText={
                          errors.name?.message
                            ? t(errors.name.message)
                            : 'Enter your name as it appears on official documents'
                        }
                        error={!!errors.name}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                {/* National ID */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="nationalId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <>
                            {t('personal.nationalId')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </>
                        }
                        placeholder="123456789"
                        helperText={
                          errors.nationalId?.message
                            ? t(errors.nationalId.message)
                            : 'Enter your government-issued National ID number'
                        }
                        error={!!errors.nationalId}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                {/* Date of Birth */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label={
                          <>
                            {t('personal.dateOfBirth')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </>
                        }
                        format={isArabic ? 'dd/MM/yyyy' : 'MM/dd/yyyy'}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: 'outlined',
                            helperText: errors.dateOfBirth?.message
                              ? t(errors.dateOfBirth.message)
                              : 'You must be 18 years or older to apply',
                            error: !!errors.dateOfBirth,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Gender */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label={
                          <>
                            {t('personal.gender')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </>
                        }
                        error={!!errors.gender}
                        helperText={errors.gender?.message ? t(errors.gender.message) : ''}
                        fullWidth
                        variant="outlined"
                      >
                        <MenuItem value="">
                          <em>Select gender</em>
                        </MenuItem>
                        {genderOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Street Address */}
                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <>
                            {t('personal.address')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </>
                        }
                        placeholder="Street address, apartment, suite, etc."
                        error={!!errors.address}
                        helperText={errors.address?.message ? t(errors.address.message) : ''}
                        fullWidth
                        variant="outlined"
                        multiline
                        maxRows={3}
                      />
                    )}
                  />
                </Grid>

                {/* City, State, Country */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <>
                            {t('personal.city')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </>
                        }
                        error={!!errors.city}
                        helperText={errors.city?.message ? t(errors.city.message) : ''}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <>
                            {t('personal.state')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </>
                        }
                        error={!!errors.state}
                        helperText={errors.state?.message ? t(errors.state.message) : ''}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <>
                            {t('personal.country')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </>
                        }
                        error={!!errors.country}
                        helperText={errors.country?.message ? t(errors.country.message) : ''}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                {/* Phone and Email */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <>
                            {t('personal.phone')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </>
                        }
                        placeholder="+1 234 567 8900"
                        helperText={
                          errors.phone?.message
                            ? t(errors.phone.message)
                            : 'Include country code if international'
                        }
                        error={!!errors.phone}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="email"
                        label={
                          <>
                            {t('personal.email')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </>
                        }
                        placeholder="example@email.com"
                        helperText={
                          errors.email?.message
                            ? t(errors.email.message)
                            : "We'll use this to contact you about your application"
                        }
                        error={!!errors.email}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Navigation */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 4,
                  pt: 3,
                  borderTop: 1,
                  borderColor: 'divider',
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isValid}
                  size="large"
                  sx={{
                    minWidth: { xs: '100%', sm: 150 },
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  {t('form.next')}
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
        </CardContent>
      </Card>
    </Box>
  );
};