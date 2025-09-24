import { z } from "zod";

// Enum definitions for form options
export const GenderOptions = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
  PREFER_NOT_TO_SAY: "prefer-not-to-say",
} as const;

export const MaritalStatusOptions = {
  SINGLE: "single",
  MARRIED: "married",
  DIVORCED: "divorced",
  WIDOWED: "widowed",
  SEPARATED: "separated",
} as const;

export const EmploymentStatusOptions = {
  EMPLOYED: "employed",
  PART_TIME: "partTime",
  UNEMPLOYED: "unemployed",
  RETIRED: "retired",
  STUDENT: "student",
  DISABLED: "disabled",
} as const;

export const HousingStatusOptions = {
  OWN: "own",
  RENT: "rent",
  FAMILY: "family",
  HOMELESS: "homeless",
  TEMPORARY: "temporary",
} as const;

// Step 1 Schema - Personal Information
export const personalInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "validation.minLength")
    .max(100, "validation.maxLength"),

  nationalId: z
    .string()
    .trim()
    .min(6, "validation.minLength")
    .max(20, "validation.maxLength")
    .regex(/^[0-9A-Za-z-]+$/, "validation.nationalId"),

  dateOfBirth: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate < today;
    }, "validation.pastDate")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, "validation.adult"),

  gender: z.enum([
    GenderOptions.MALE,
    GenderOptions.FEMALE,
    GenderOptions.OTHER,
    GenderOptions.PREFER_NOT_TO_SAY,
  ]),

  address: z
    .string()
    .trim()
    .min(5, "validation.minLength")
    .max(200, "validation.maxLength"),

  city: z
    .string()
    .trim()
    .min(2, "validation.minLength")
    .max(50, "validation.maxLength"),

  state: z
    .string()
    .trim()
    .min(2, "validation.minLength")
    .max(50, "validation.maxLength"),

  country: z
    .string()
    .trim()
    .min(2, "validation.minLength")
    .max(50, "validation.maxLength"),

  phone: z
    .string()
    .trim()
    .regex(/^[+]?[1-9][\d]{0,15}$/, "validation.phone"),

  email: z
    .string()
    .trim()
    .email("validation.email")
    .max(255, "validation.maxLength"),
});

// Step 2 Schema - Family & Financial Information
export const familyFinancialSchema = z.object({
  maritalStatus: z.enum([
    MaritalStatusOptions.SINGLE,
    MaritalStatusOptions.MARRIED,
    MaritalStatusOptions.DIVORCED,
    MaritalStatusOptions.WIDOWED,
    MaritalStatusOptions.SEPARATED,
  ]),

  dependents: z.coerce
    .number()
    .int()
    .min(0, "validation.positive")
    .max(20, "validation.maxLength"),

  employmentStatus: z.enum([
    EmploymentStatusOptions.EMPLOYED,
    EmploymentStatusOptions.PART_TIME,
    EmploymentStatusOptions.UNEMPLOYED,
    EmploymentStatusOptions.RETIRED,
    EmploymentStatusOptions.STUDENT,
    EmploymentStatusOptions.DISABLED,
  ]),

  monthlyIncome: z.coerce
    .number()
    .min(0, "validation.positive")
    .max(1000000, "validation.maxLength"),

  housingStatus: z.enum([
    HousingStatusOptions.OWN,
    HousingStatusOptions.RENT,
    HousingStatusOptions.FAMILY,
    HousingStatusOptions.HOMELESS,
    HousingStatusOptions.TEMPORARY,
  ]),
});

// Step 3 Schema - Situation Descriptions
export const situationDescriptionsSchema = z.object({
  financialSituation: z
    .string()
    .trim()
    .min(50, "validation.minLength")
    .max(2000, "validation.maxLength"),

  employmentCircumstances: z
    .string()
    .trim()
    .min(50, "validation.minLength")
    .max(2000, "validation.maxLength"),

  reasonForApplying: z
    .string()
    .trim()
    .min(50, "validation.minLength")
    .max(2000, "validation.maxLength"),
});

// Complete Application Schema
export const completeApplicationSchema = z.object({
  personalInfo: personalInfoSchema,
  familyFinancial: familyFinancialSchema,
  situationDescriptions: situationDescriptionsSchema,
});

// TypeScript Types
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type FamilyFinancial = z.infer<typeof familyFinancialSchema>;
export type SituationDescriptions = z.infer<typeof situationDescriptionsSchema>;
export type CompleteApplication = z.infer<typeof completeApplicationSchema>;

// Form Step Types
export type FormStep = "personal" | "family" | "situation" | "success";

// Application State
export interface ApplicationState {
  currentStep: FormStep;
  personalInfo: Partial<PersonalInfo>;
  familyFinancial: Partial<FamilyFinancial>;
  situationDescriptions: Partial<SituationDescriptions>;
  isSubmitting: boolean;
  lastSaved: Date | null;
  referenceNumber?: string;
}

// AI Assistant Types
export interface AIAssistanceRequest {
  field: "financialSituation" | "employmentCircumstances" | "reasonForApplying";
  context: {
    employmentStatus?: string;
    monthlyIncome?: number;
    maritalStatus?: string;
    dependents?: number;
    existingText?: string;
  };
}

export interface AIAssistanceResponse {
  success: boolean;
  suggestion?: string;
  error?: string;
}

// Language and Direction Types
export type Language = "en" | "ar";
export type Direction = "ltr" | "rtl";
