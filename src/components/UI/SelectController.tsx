import React from "react";
import {
  Controller,
  Control,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { TextField, MenuItem, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectControllerProps<
  T extends FieldValues = Record<string, unknown>
> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  error?: FieldError;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export const SelectController = <
  T extends FieldValues = Record<string, unknown>
>({
  name,
  control,
  label,
  options,
  error,
  helperText,
  placeholder,
  required = false,
  fullWidth = true,
}: SelectControllerProps<T>) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          select
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              backgroundColor: "background.default",
              fontSize: "0.9rem",
              "& .MuiOutlinedInput-input": {
                padding: "12px 16px 12px",
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
          error={!!error}
          helperText={error?.message ? t(error.message) : helperText}
          fullWidth={fullWidth}
          variant="outlined">
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};
