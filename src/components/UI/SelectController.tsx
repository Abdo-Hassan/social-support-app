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
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          select
          label={
            <>
              {label}
              {required && (
                <span style={{ color: theme.palette.error.main }}> *</span>
              )}
            </>
          }
          error={!!error}
          helperText={error?.message ? t(error.message) : helperText}
          fullWidth={fullWidth}
          variant="outlined">
          <MenuItem value="">
            <em>{placeholder || t("form.selectOption")}</em>
          </MenuItem>
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
