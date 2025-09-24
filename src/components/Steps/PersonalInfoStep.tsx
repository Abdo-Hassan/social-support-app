import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { personalInfoSchema, PersonalInfo, GenderOptions } from '../../types/form';
import { useApplication } from '../../contexts/ApplicationContext';

export const PersonalInfoStep: React.FC = () => {
  const { t } = useTranslation();
  const { personalInfo, updatePersonalInfo, setCurrentStep } = useApplication();

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid }, 
    watch 
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo as PersonalInfo,
    mode: 'onChange'
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="form-section">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t('personal.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('personal.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="form-field">
            <label htmlFor="name" className="form-label">
              {t('personal.name')} <span className="text-error">*</span>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your full legal name"
                  aria-describedby={errors.name ? 'name-error' : 'name-help'}
                  aria-invalid={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <p id="name-error" className="form-error" role="alert">
                {t(errors.name.message as string)}
              </p>
            )}
            <p id="name-help" className="form-helper">
              Enter your name as it appears on official documents
            </p>
          </div>

          {/* National ID */}
          <div className="form-field">
            <label htmlFor="nationalId" className="form-label">
              {t('personal.nationalId')} <span className="text-error">*</span>
            </label>
            <Controller
              name="nationalId"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="nationalId"
                  type="text"
                  className="form-input ltr-only"
                  placeholder="123456789"
                  aria-describedby={errors.nationalId ? 'nationalId-error' : 'nationalId-help'}
                  aria-invalid={!!errors.nationalId}
                />
              )}
            />
            {errors.nationalId && (
              <p id="nationalId-error" className="form-error" role="alert">
                {t(errors.nationalId.message as string)}
              </p>
            )}
            <p id="nationalId-help" className="form-helper">
              Enter your government-issued National ID number
            </p>
          </div>

          {/* Date of Birth */}
          <div className="form-field">
            <label htmlFor="dateOfBirth" className="form-label">
              {t('personal.dateOfBirth')} <span className="text-error">*</span>
            </label>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="dateOfBirth"
                  type="date"
                  className="form-input"
                  aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : 'dateOfBirth-help'}
                  aria-invalid={!!errors.dateOfBirth}
                />
              )}
            />
            {errors.dateOfBirth && (
              <p id="dateOfBirth-error" className="form-error" role="alert">
                {t(errors.dateOfBirth.message as string)}
              </p>
            )}
            <p id="dateOfBirth-help" className="form-helper">
              You must be 18 years or older to apply
            </p>
          </div>

          {/* Gender */}
          <div className="form-field">
            <label htmlFor="gender" className="form-label">
              {t('personal.gender')} <span className="text-error">*</span>
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="gender"
                  className="form-input"
                  aria-describedby={errors.gender ? 'gender-error' : undefined}
                  aria-invalid={!!errors.gender}
                >
                  <option value="">Select gender</option>
                  <option value={GenderOptions.MALE}>
                    {t('personal.genderOptions.male')}
                  </option>
                  <option value={GenderOptions.FEMALE}>
                    {t('personal.genderOptions.female')}
                  </option>
                  <option value={GenderOptions.OTHER}>
                    {t('personal.genderOptions.other')}
                  </option>
                  <option value={GenderOptions.PREFER_NOT_TO_SAY}>
                    {t('personal.genderOptions.prefer-not-to-say')}
                  </option>
                </select>
              )}
            />
            {errors.gender && (
              <p id="gender-error" className="form-error" role="alert">
                {t(errors.gender.message as string)}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="form-field">
            <label htmlFor="address" className="form-label">
              {t('personal.address')} <span className="text-error">*</span>
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="address"
                  type="text"
                  className="form-input"
                  placeholder="Street address, apartment, suite, etc."
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  aria-invalid={!!errors.address}
                />
              )}
            />
            {errors.address && (
              <p id="address-error" className="form-error" role="alert">
                {t(errors.address.message as string)}
              </p>
            )}
          </div>

          {/* City, State, Country Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-field">
              <label htmlFor="city" className="form-label">
                {t('personal.city')} <span className="text-error">*</span>
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="city"
                    type="text"
                    className="form-input"
                    aria-describedby={errors.city ? 'city-error' : undefined}
                    aria-invalid={!!errors.city}
                  />
                )}
              />
              {errors.city && (
                <p id="city-error" className="form-error" role="alert">
                  {t(errors.city.message as string)}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="state" className="form-label">
                {t('personal.state')} <span className="text-error">*</span>
              </label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="state"
                    type="text"
                    className="form-input"
                    aria-describedby={errors.state ? 'state-error' : undefined}
                    aria-invalid={!!errors.state}
                  />
                )}
              />
              {errors.state && (
                <p id="state-error" className="form-error" role="alert">
                  {t(errors.state.message as string)}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="country" className="form-label">
                {t('personal.country')} <span className="text-error">*</span>
              </label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="country"
                    type="text"
                    className="form-input"
                    aria-describedby={errors.country ? 'country-error' : undefined}
                    aria-invalid={!!errors.country}
                  />
                )}
              />
              {errors.country && (
                <p id="country-error" className="form-error" role="alert">
                  {t(errors.country.message as string)}
                </p>
              )}
            </div>
          </div>

          {/* Phone and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label htmlFor="phone" className="form-label">
                {t('personal.phone')} <span className="text-error">*</span>
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="phone"
                    type="tel"
                    className="form-input ltr-only"
                    placeholder="+1 234 567 8900"
                    aria-describedby={errors.phone ? 'phone-error' : 'phone-help'}
                    aria-invalid={!!errors.phone}
                  />
                )}
              />
              {errors.phone && (
                <p id="phone-error" className="form-error" role="alert">
                  {t(errors.phone.message as string)}
                </p>
              )}
              <p id="phone-help" className="form-helper">
                Include country code if international
              </p>
            </div>

            <div className="form-field">
              <label htmlFor="email" className="form-label">
                {t('personal.email')} <span className="text-error">*</span>
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    className="form-input ltr-only"
                    placeholder="example@email.com"
                    aria-describedby={errors.email ? 'email-error' : 'email-help'}
                    aria-invalid={!!errors.email}
                  />
                )}
              />
              {errors.email && (
                <p id="email-error" className="form-error" role="alert">
                  {t(errors.email.message as string)}
                </p>
              )}
              <p id="email-help" className="form-helper">
                We'll use this to contact you about your application
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={!isValid}
              className="btn-primary"
              aria-describedby={!isValid ? 'form-invalid' : undefined}
            >
              {t('form.next')}
            </button>
            {!isValid && (
              <p id="form-invalid" className="sr-only">
                Please complete all required fields before continuing
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};