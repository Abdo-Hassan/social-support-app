import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  familyFinancialSchema, 
  FamilyFinancial, 
  MaritalStatusOptions,
  EmploymentStatusOptions,
  HousingStatusOptions
} from '../../types/form';
import { useApplication } from '../../contexts/ApplicationContext';

export const FamilyFinancialStep: React.FC = () => {
  const { t } = useTranslation();
  const { familyFinancial, updateFamilyFinancial, setCurrentStep } = useApplication();

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid }, 
    watch 
  } = useForm<FamilyFinancial>({
    resolver: zodResolver(familyFinancialSchema),
    defaultValues: familyFinancial as FamilyFinancial,
    mode: 'onChange'
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="form-section">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t('family.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('family.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Marital Status */}
          <div className="form-field">
            <label htmlFor="maritalStatus" className="form-label">
              {t('family.maritalStatus')} <span className="text-error">*</span>
            </label>
            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="maritalStatus"
                  className="form-input"
                  aria-describedby={errors.maritalStatus ? 'maritalStatus-error' : undefined}
                  aria-invalid={!!errors.maritalStatus}
                >
                  <option value="">Select marital status</option>
                  <option value={MaritalStatusOptions.SINGLE}>
                    {t('family.maritalOptions.single')}
                  </option>
                  <option value={MaritalStatusOptions.MARRIED}>
                    {t('family.maritalOptions.married')}
                  </option>
                  <option value={MaritalStatusOptions.DIVORCED}>
                    {t('family.maritalOptions.divorced')}
                  </option>
                  <option value={MaritalStatusOptions.WIDOWED}>
                    {t('family.maritalOptions.widowed')}
                  </option>
                  <option value={MaritalStatusOptions.SEPARATED}>
                    {t('family.maritalOptions.separated')}
                  </option>
                </select>
              )}
            />
            {errors.maritalStatus && (
              <p id="maritalStatus-error" className="form-error" role="alert">
                {t(errors.maritalStatus.message as string)}
              </p>
            )}
          </div>

          {/* Number of Dependents */}
          <div className="form-field">
            <label htmlFor="dependents" className="form-label">
              {t('family.dependents')} <span className="text-error">*</span>
            </label>
            <Controller
              name="dependents"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  id="dependents"
                  type="number"
                  min="0"
                  max="20"
                  className="form-input"
                  placeholder="0"
                  aria-describedby={errors.dependents ? 'dependents-error' : 'dependents-help'}
                  aria-invalid={!!errors.dependents}
                />
              )}
            />
            {errors.dependents && (
              <p id="dependents-error" className="form-error" role="alert">
                {t(errors.dependents.message as string)}
              </p>
            )}
            <p id="dependents-help" className="form-helper">
              Include children under 18 and other family members you support financially
            </p>
          </div>

          {/* Employment Status */}
          <div className="form-field">
            <label htmlFor="employmentStatus" className="form-label">
              {t('family.employmentStatus')} <span className="text-error">*</span>
            </label>
            <Controller
              name="employmentStatus"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="employmentStatus"
                  className="form-input"
                  aria-describedby={errors.employmentStatus ? 'employmentStatus-error' : undefined}
                  aria-invalid={!!errors.employmentStatus}
                >
                  <option value="">Select employment status</option>
                  <option value={EmploymentStatusOptions.EMPLOYED}>
                    {t('family.employmentOptions.employed')}
                  </option>
                  <option value={EmploymentStatusOptions.PART_TIME}>
                    {t('family.employmentOptions.partTime')}
                  </option>
                  <option value={EmploymentStatusOptions.UNEMPLOYED}>
                    {t('family.employmentOptions.unemployed')}
                  </option>
                  <option value={EmploymentStatusOptions.RETIRED}>
                    {t('family.employmentOptions.retired')}
                  </option>
                  <option value={EmploymentStatusOptions.STUDENT}>
                    {t('family.employmentOptions.student')}
                  </option>
                  <option value={EmploymentStatusOptions.DISABLED}>
                    {t('family.employmentOptions.disabled')}
                  </option>
                </select>
              )}
            />
            {errors.employmentStatus && (
              <p id="employmentStatus-error" className="form-error" role="alert">
                {t(errors.employmentStatus.message as string)}
              </p>
            )}
          </div>

          {/* Monthly Income */}
          <div className="form-field">
            <label htmlFor="monthlyIncome" className="form-label">
              {t('family.monthlyIncome')} <span className="text-error">*</span>
            </label>
            <Controller
              name="monthlyIncome"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    id="monthlyIncome"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input pl-8 ltr-only"
                    placeholder="0.00"
                    aria-describedby={errors.monthlyIncome ? 'monthlyIncome-error' : 'monthlyIncome-help'}
                    aria-invalid={!!errors.monthlyIncome}
                  />
                </div>
              )}
            />
            {errors.monthlyIncome && (
              <p id="monthlyIncome-error" className="form-error" role="alert">
                {t(errors.monthlyIncome.message as string)}
              </p>
            )}
            <p id="monthlyIncome-help" className="form-helper">
              Include all sources of income (salary, benefits, support, etc.)
            </p>
          </div>

          {/* Housing Status */}
          <div className="form-field">
            <label htmlFor="housingStatus" className="form-label">
              {t('family.housingStatus')} <span className="text-error">*</span>
            </label>
            <Controller
              name="housingStatus"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="housingStatus"
                  className="form-input"
                  aria-describedby={errors.housingStatus ? 'housingStatus-error' : undefined}
                  aria-invalid={!!errors.housingStatus}
                >
                  <option value="">Select housing status</option>
                  <option value={HousingStatusOptions.OWN}>
                    {t('family.housingOptions.own')}
                  </option>
                  <option value={HousingStatusOptions.RENT}>
                    {t('family.housingOptions.rent')}
                  </option>
                  <option value={HousingStatusOptions.FAMILY}>
                    {t('family.housingOptions.family')}
                  </option>
                  <option value={HousingStatusOptions.HOMELESS}>
                    {t('family.housingOptions.homeless')}
                  </option>
                  <option value={HousingStatusOptions.TEMPORARY}>
                    {t('family.housingOptions.temporary')}
                  </option>
                </select>
              )}
            />
            {errors.housingStatus && (
              <p id="housingStatus-error" className="form-error" role="alert">
                {t(errors.housingStatus.message as string)}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handlePrevious}
              className="btn-outline"
            >
              {t('form.previous')}
            </button>
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