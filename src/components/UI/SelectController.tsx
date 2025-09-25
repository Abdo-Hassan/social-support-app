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
              direction: isRtl ? "rtl" : "ltr",
              "& .MuiOutlinedInput-input": {
                padding: "12px 16px",
                textAlign: isRtl ? "right" : "left",
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
              // Fix select dropdown icon positioning for RTL
              "& .MuiSelect-icon": {
                right: isRtl ? "auto" : 14,
                left: isRtl ? 14 : "auto",
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "0.9rem",
              fontWeight: 400,
              color: "text.secondary",
              // Fix label positioning for RTL
              right: isRtl ? 14 : "auto",
              left: isRtl ? "auto" : 14,
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
            // Fix select dropdown content positioning for RTL
            "& .MuiSelect-select": {
              textAlign: isRtl ? "right" : "left",
              paddingRight: isRtl ? 14 : 32,
              paddingLeft: isRtl ? 32 : 14,
            },
            // Fix MUI date/time picker icons in select fields
            "& .MuiInputAdornment-root": {
              "& .MuiSvgIcon-root": {
                transform: isRtl ? "scaleX(-1)" : "none",
              },
            },
            // Fix any calendar or time icons specifically
            "& .MuiSvgIcon-root[data-testid*='Calendar']": {
              transform: isRtl ? "scaleX(-1)" : "none",
            },
            "& .MuiSvgIcon-root[data-testid*='Clock']": {
              transform: isRtl ? "scaleX(-1)" : "none",
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
          helperText={
            error?.message ? (
              <span role="alert">{t(error.message)}</span>
            ) : (
              helperText || ""
            )
          }
          fullWidth={fullWidth}
          variant="outlined"
          SelectProps={{
            MenuProps: {
              anchorOrigin: {
                vertical: "bottom",
                horizontal: isRtl ? "right" : "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: isRtl ? "right" : "left",
              },
            },
          }}>
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
