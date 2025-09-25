import React from "react";
import {
  Controller,
  Control,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { TextField, InputAdornment, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

interface InputControllerProps<
  T extends FieldValues = Record<string, unknown>
> {
  name: Path<T>;
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

export const InputController = <
  T extends FieldValues = Record<string, unknown>
>({
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
}: InputControllerProps<T>) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === "ar";
  const fieldId = `input-${String(name)}`;
  const errorId = `error-${String(name)}`;

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
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              backgroundColor: "background.default",
              fontSize: "0.9rem",
              direction: isRtl ? "rtl" : "ltr",
              "& .MuiOutlinedInput-input": {
                padding: "12px 5px 12px",
                textAlign: isRtl ? "right" : "left",
                "&::placeholder": {
                  textAlign: isRtl ? "right" : "left",
                  direction: isRtl ? "rtl" : "ltr",
                },
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
          }}
          {...field}
          id={fieldId}
          type={type}
          label={
            <>
              {label}
              {required && (
                <span
                  style={{ color: theme.palette.error.main, margin: "0 4px" }}>
                  *
                </span>
              )}
            </>
          }
          placeholder={placeholder}
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
          fullWidth={fullWidth}
          variant="outlined"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          InputProps={
            Object.keys(InputProps).length > 0 ? InputProps : undefined
          }
          inputProps={inputProps}
        />
      )}
    />
  );
};
