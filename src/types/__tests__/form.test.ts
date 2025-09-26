import {
  personalInfoSchema,
  familyFinancialSchema,
  situationDescriptionsSchema,
} from "../form";

describe("Form Validation Schemas", () => {
  describe("personalInfoSchema", () => {
    const validPersonalInfo = {
      name: "John Doe",
      nationalId: "1234567890",
      dateOfBirth: "1990-01-01T00:00:00.000Z",
      gender: "male" as const,
      address: "123 Main St, City",
      city: "New York",
      state: "NY",
      country: "USA",
      phone: "+1234567890",
      email: "john@example.com",
    };

    it("should validate correct personal info", () => {
      expect(() => personalInfoSchema.parse(validPersonalInfo)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const invalid = { ...validPersonalInfo, email: "invalid-email" };
      expect(() => personalInfoSchema.parse(invalid)).toThrow();
    });

    it("should reject short name", () => {
      const invalid = { ...validPersonalInfo, name: "A" };
      expect(() => personalInfoSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid phone number", () => {
      const invalid = { ...validPersonalInfo, phone: "not-a-phone" };
      expect(() => personalInfoSchema.parse(invalid)).toThrow();
    });

    it("should reject future date of birth", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const invalid = {
        ...validPersonalInfo,
        dateOfBirth: futureDate.toISOString(),
      };
      expect(() => personalInfoSchema.parse(invalid)).toThrow();
    });
  });

  describe("familyFinancialSchema", () => {
    const validFamilyFinancial = {
      maritalStatus: "single" as const,
      dependents: 0,
      employmentStatus: "employed" as const,
      monthlyIncome: "3000",
      housingStatus: "rent" as const,
    };

    it("should validate correct family financial info", () => {
      expect(() =>
        familyFinancialSchema.parse(validFamilyFinancial)
      ).not.toThrow();
    });

    it("should reject negative dependents", () => {
      const invalid = { ...validFamilyFinancial, dependents: -1 };
      expect(() => familyFinancialSchema.parse(invalid)).toThrow();
    });

    it("should reject zero monthly income", () => {
      const invalid = { ...validFamilyFinancial, monthlyIncome: "0" };
      expect(() => familyFinancialSchema.parse(invalid)).toThrow();
    });

    it("should reject monthly income with leading zeros", () => {
      const invalid = { ...validFamilyFinancial, monthlyIncome: "01111" };
      expect(() => familyFinancialSchema.parse(invalid)).toThrow();
    });

    it("should reject monthly income starting with zero", () => {
      const invalid = { ...validFamilyFinancial, monthlyIncome: "0123" };
      expect(() => familyFinancialSchema.parse(invalid)).toThrow();
    });
  });

  describe("situationDescriptionsSchema", () => {
    const validSituationDescriptions = {
      financialSituation: "A".repeat(50), // Minimum 50 characters
      employmentCircumstances: "B".repeat(50),
      reasonForApplying: "C".repeat(50),
    };

    it("should validate correct situation descriptions", () => {
      expect(() =>
        situationDescriptionsSchema.parse(validSituationDescriptions)
      ).not.toThrow();
    });

    it("should reject short financial situation", () => {
      const invalid = {
        ...validSituationDescriptions,
        financialSituation: "Too short",
      };
      expect(() => situationDescriptionsSchema.parse(invalid)).toThrow();
    });

    it("should reject too long description", () => {
      const invalid = {
        ...validSituationDescriptions,
        financialSituation: "A".repeat(2001), // Max 2000 characters
      };
      expect(() => situationDescriptionsSchema.parse(invalid)).toThrow();
    });
  });
});
