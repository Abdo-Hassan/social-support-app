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
  type?:
    | "text"
    | "number"
    | "email"
    | "tel"
    | "date"
    | "time"
    | "datetime-local";
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

  // Fix adornment positioning for RTL
  if (startAdornment) {
    if (isRtl) {
      InputProps.endAdornment = (
        <InputAdornment position="end">{startAdornment}</InputAdornment>
      );
    } else {
      InputProps.startAdornment = (
        <InputAdornment position="start">{startAdornment}</InputAdornment>
      );
    }
  }

  if (endAdornment) {
    if (isRtl) {
      InputProps.startAdornment = (
        <InputAdornment position="start">{endAdornment}</InputAdornment>
      );
    } else {
      InputProps.endAdornment = (
        <InputAdornment position="end">{endAdornment}</InputAdornment>
      );
    }
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
              // Fix label positioning for RTL
              right: isRtl ? 30 : "auto",
              left: isRtl ? "auto" : 0,
              transformOrigin: isRtl ? "top right" : "top left",
              "&.Mui-focused": {
                color: "primary.main",
              },
              "&.MuiInputLabel-shrink": {
                transform: isRtl
                  ? "translate(14px, -9px) scale(0.75)"
                  : "translate(14px, -9px) scale(0.75)",
              },
            },
            "& .MuiFormHelperText-root": {
              fontSize: "0.775rem",
              mt: 0.5,
              textAlign: isRtl ? "right" : "left",
              direction: isRtl ? "rtl" : "ltr",
            },
            // Fix native date picker icon alignment for RTL
            "& input[type=date]::-webkit-calendar-picker-indicator": {
              position: "absolute",
              right: isRtl ? "auto" : 12,
              left: isRtl ? 12 : "auto",
              transform: isRtl ? "scaleX(-1)" : "none",
              cursor: "pointer",
            },
            "& input[type=time]::-webkit-calendar-picker-indicator": {
              position: "absolute",
              right: isRtl ? "auto" : 12,
              left: isRtl ? 12 : "auto",
              transform: isRtl ? "scaleX(-1)" : "none",
              cursor: "pointer",
            },
            "& input[type=datetime-local]::-webkit-calendar-picker-indicator": {
              position: "absolute",
              right: isRtl ? "auto" : 12,
              left: isRtl ? 12 : "auto",
              transform: isRtl ? "scaleX(-1)" : "none",
              cursor: "pointer",
            },
            // Fix MUI date picker icon alignment
            "& .MuiInputAdornment-root": {
              "& .MuiSvgIcon-root": {
                transform: isRtl ? "scaleX(-1)" : "none",
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
                  style={{
                    color: theme.palette.error.main,
                    margin: isRtl ? "0 4px 0 0" : "0 0 0 4px",
                  }}>
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
