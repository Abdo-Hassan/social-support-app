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
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { familyFinancialSchema, FamilyFinancial } from '../../types/form';
import { useApplication } from '../../contexts/ApplicationContext';

export const FamilyFinancialStep: React.FC = () => {
  const { t } = useTranslation();
  const { familyFinancial, updateFamilyFinancial, setCurrentStep } = useApplication();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FamilyFinancial>({
    resolver: zodResolver(familyFinancialSchema),
    defaultValues: familyFinancial as FamilyFinancial,
    mode: 'onChange',
  });

  // Auto-save on form changes
  const watchedValues = watch();
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFamilyFinancial(watchedValues);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedValues, updateFamilyFinancial]);

  const onSubmit = (data: FamilyFinancial) => {
    updateFamilyFinancial(data);
    setCurrentStep('situation');
  };

  const handlePrevious = () => {
    setCurrentStep('personal');
  };

  const maritalOptions = [
    { value: 'single', label: t('family.maritalOptions.single') },
    { value: 'married', label: t('family.maritalOptions.married') },
    { value: 'divorced', label: t('family.maritalOptions.divorced') },
    { value: 'widowed', label: t('family.maritalOptions.widowed') },
    { value: 'separated', label: t('family.maritalOptions.separated') },
  ];

  const employmentOptions = [
    { value: 'employed', label: t('family.employmentOptions.employed') },
    { value: 'partTime', label: t('family.employmentOptions.partTime') },
    { value: 'unemployed', label: t('family.employmentOptions.unemployed') },
    { value: 'retired', label: t('family.employmentOptions.retired') },
    { value: 'student', label: t('family.employmentOptions.student') },
    { value: 'disabled', label: t('family.employmentOptions.disabled') },
  ];

  const housingOptions = [
    { value: 'own', label: t('family.housingOptions.own') },
    { value: 'rent', label: t('family.housingOptions.rent') },
    { value: 'family', label: t('family.housingOptions.family') },
    { value: 'homeless', label: t('family.housingOptions.homeless') },
    { value: 'temporary', label: t('family.housingOptions.temporary') },
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
              {t('family.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('family.subtitle')}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Marital Status */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={
                        <>
                          {t('family.maritalStatus')} <span style={{ color: theme.palette.error.main }}>*</span>
                        </>
                      }
                      error={!!errors.maritalStatus}
                      helperText={errors.maritalStatus?.message ? t(errors.maritalStatus.message) : ''}
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value="">
                        <em>Select marital status</em>
                      </MenuItem>
                      {maritalOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              {/* Number of Dependents */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="dependents"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label={
                        <>
                          {t('family.dependents')} <span style={{ color: theme.palette.error.main }}>*</span>
                        </>
                      }
                      placeholder="0"
                      error={!!errors.dependents}
                      helperText={errors.dependents?.message ? t(errors.dependents.message) : 'Include children and other dependents'}
                      fullWidth
                      variant="outlined"
                      inputProps={{ min: 0, max: 20 }}
                    />
                  )}
                />
              </Grid>

              {/* Employment Status */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="employmentStatus"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={
                        <>
                          {t('family.employmentStatus')} <span style={{ color: theme.palette.error.main }}>*</span>
                        </>
                      }
                      error={!!errors.employmentStatus}
                      helperText={errors.employmentStatus?.message ? t(errors.employmentStatus.message) : ''}
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value="">
                        <em>Select employment status</em>
                      </MenuItem>
                      {employmentOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              {/* Monthly Income */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="monthlyIncome"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label={
                        <>
                          {t('family.monthlyIncome')} <span style={{ color: theme.palette.error.main }}>*</span>
                        </>
                      }
                      placeholder="0"
                      error={!!errors.monthlyIncome}
                      helperText={errors.monthlyIncome?.message ? t(errors.monthlyIncome.message) : 'Total household monthly income before taxes'}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      inputProps={{ min: 0, step: 1 }}
                    />
                  )}
                />
              </Grid>

              {/* Housing Status */}
              <Grid item xs={12}>
                <Controller
                  name="housingStatus"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={
                        <>
                          {t('family.housingStatus')} <span style={{ color: theme.palette.error.main }}>*</span>
                        </>
                      }
                      error={!!errors.housingStatus}
                      helperText={errors.housingStatus?.message ? t(errors.housingStatus.message) : 'Your current living situation'}
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value="">
                        <em>Select housing status</em>
                      </MenuItem>
                      {housingOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>

            {/* Navigation */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                gap: 2,
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevious}
                startIcon={<ArrowBack />}
                size="large"
                sx={{
                  minWidth: { xs: '100%', sm: 150 },
                  py: 1.5,
                }}
              >
                {t('form.previous')}
              </Button>
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
        </CardContent>
      </Card>
    </Box>
  );
};