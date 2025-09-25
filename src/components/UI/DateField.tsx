import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Control, Controller, FieldError, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface DateFieldProps<T = Record<string, unknown>> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  helperText?: string;
  error?: FieldError;
  required?: boolean;
  format?: string;
}

export const DateField = <T = Record<string, unknown>,>({
  name,
  control,
  label,
  helperText,
  error,
  required = false,
  format = "MM/dd/yyyy",
}: DateFieldProps<T>) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const fieldId = `date-${String(name)}`;
  const errorId = `error-${String(name)}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          {...field}
          value={
            field.value ? new Date(field.value as string | number | Date) : null
          }
          onChange={(date) => field.onChange(date?.toISOString())}
          label={
            <>
              {label}
              {required && (
                <span
                  style={{
                    color: "#d32f2f",
                    margin: isRtl ? "0 4px 0 0" : "0 0 0 4px",
                  }}>
                  *
                </span>
              )}
            </>
          }
          format={format}
          slotProps={{
            textField: {
              id: fieldId,
              fullWidth: true,
              variant: "outlined",
              size: "small",
              helperText: error?.message ? (
                <span id={errorId} role="alert">
                  {t(error.message)}
                </span>
              ) : (
                helperText || ""
              ),
              error: !!error,
              "aria-invalid": !!error,
              "aria-describedby": error ? errorId : undefined,
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.9rem",
                  "& fieldset": {
                    borderColor: "grey.300",
                  },
                  "&:hover fieldset": {
                    borderColor: "grey.400",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: "1.5px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.9rem",
                  fontWeight: 400,
                  color: "text.secondary",
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                },
                "& .MuiFormHelperText-root": {
                  fontSize: "0.775rem",
                  mt: 0.5,
                },
              },
            },
          }}
        />
      )}
    />
  );
};
