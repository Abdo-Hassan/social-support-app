import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { Control, Controller, FieldError, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormStep, PersonalInfo } from "../../types/form";
import { useApplication } from "@/hooks/use-application";

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
  onChange?: (name: string, value: string) => void;
  value?: string;
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
  onChange,
  value,
}: FormFieldProps<T>) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const fieldId = `field-${String(name)}`;
  const errorId = `error-${String(name)}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <TextField
            {...field}
            id={fieldId}
            value={value || field.value || ""}
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
            placeholder={placeholder}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(name, e.target.value);
            }}
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
            slotProps={{
              select:
                type === "select"
                  ? {
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
                    }
                  : undefined,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                backgroundColor: "background.default",
                fontSize: "0.9rem",
                direction: isRtl ? "rtl" : "ltr",
                "& .MuiOutlinedInput-input": {
                  padding: "12px 16px",
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
                right: isRtl ? 30 : "auto",
                left: isRtl ? "auto" : 0,
                top: 3,
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
              // Fix select dropdown menu positioning for RTL
              "& .MuiSelect-select": {
                textAlign: isRtl ? "right" : "left",
                paddingRight: isRtl ? 14 : 32,
                paddingLeft: isRtl ? 32 : 14,
              },
            }}>
            {type === "select" &&
              options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
        );
      }}
    />
  );
};
