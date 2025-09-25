import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { Control, Controller, FieldError, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps<T = Record<string, unknown>> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  helperText?: string;
  error?: FieldError;
  required?: boolean;
  type?: "text" | "email" | "select";
  options?: Option[];
  multiline?: boolean;
  maxRows?: number;
}

export const FormField = <T = Record<string, unknown>,>({
  name,
  control,
  label,
  placeholder,
  helperText,
  error,
  required = false,
  type = "text",
  options = [],
  multiline = false,
  maxRows,
}: FormFieldProps<T>) => {
  const { t } = useTranslation();
  const fieldId = `field-${String(name)}`;
  const errorId = `error-${String(name)}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          id={fieldId}
          label={
            <>
              {label}
              {required && (
                <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
              )}
            </>
          }
          placeholder={placeholder}
          type={type === "email" ? "email" : "text"}
          select={type === "select"}
          multiline={multiline}
          maxRows={maxRows}
          error={!!error}
          helperText={
            error?.message ? (
              <span id={errorId} role="alert">
                {t(error.message)}
              </span>
            ) : (
              helperText || ""
            )
          }
          fullWidth
          variant="outlined"
          size="small"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              backgroundColor: "background.default",
              fontSize: "0.9rem",
              "& .MuiOutlinedInput-input": {
                padding: "12px 16px",
              },
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
          }}>
          {type === "select" &&
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
};
