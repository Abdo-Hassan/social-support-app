import React from "react";
import { Controller, Control, FieldError, FieldValues } from "react-hook-form";
import { TextField, InputAdornment, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

interface InputControllerProps<T = Record<string, unknown>> {
  name: string;
  control: Control<T>;
  label: string;
  error?: FieldError;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
  type?: "text" | "number" | "email" | "tel";
  startAdornment?: string;
  endAdornment?: string;
  inputProps?: Record<string, unknown>;
}

export const InputController: React.FC<InputControllerProps> = ({
  name,
  control,
  label,
  error,
  helperText,
  placeholder,
  required = false,
  fullWidth = true,
  type = "text",
  startAdornment,
  endAdornment,
  inputProps,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const InputProps: Record<string, unknown> = {};

  if (startAdornment) {
    InputProps.startAdornment = (
      <InputAdornment position="start">{startAdornment}</InputAdornment>
    );
  }

  if (endAdornment) {
    InputProps.endAdornment = (
      <InputAdornment position="end">{endAdornment}</InputAdornment>
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          type={type}
          label={
            <>
              {label}
              {required && (
                <span style={{ color: theme.palette.error.main }}> *</span>
              )}
            </>
          }
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message ? t(error.message) : helperText}
          fullWidth={fullWidth}
          variant="outlined"
          InputProps={
            Object.keys(InputProps).length > 0 ? InputProps : undefined
          }
          inputProps={inputProps}
        />
      )}
    />
  );
};
