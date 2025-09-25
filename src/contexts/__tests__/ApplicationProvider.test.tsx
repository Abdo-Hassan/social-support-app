import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ApplicationProvider } from "../ApplicationProvider";
import { useApplication } from "../../hooks/use-application";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Test component that uses the context
const TestComponent = () => {
  const context = useApplication();
  if (!context) throw new Error("Context not found");

  const { personalInfo, updatePersonalInfo, currentStep } = context;

  return (
    <div>
      <div data-testid="current-step">{currentStep}</div>
      <div data-testid="personal-name">{personalInfo.name || "No name"}</div>
      <button
        data-testid="update-name"
        onClick={() => updatePersonalInfo({ name: "John Doe" })}>
        Update Name
      </button>
    </div>
  );
};

describe("ApplicationProvider", () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    console.log = jest.fn(); // Mock console.log to avoid noise in tests
    console.warn = jest.fn(); // Mock console.warn to avoid noise in tests
  });

  it("provides initial state correctly", () => {
    const { getByTestId } = render(
      <ApplicationProvider>
        <TestComponent />
      </ApplicationProvider>
    );

    expect(getByTestId("current-step")).toHaveTextContent("personal");
    expect(getByTestId("personal-name")).toHaveTextContent("No name");
  });

  it("updates personal info correctly", async () => {
    const { getByTestId } = render(
      <ApplicationProvider>
        <TestComponent />
      </ApplicationProvider>
    );

    // Wait for initial loading to complete (100ms timeout in ApplicationProvider)
    await new Promise((resolve) => setTimeout(resolve, 150));

    act(() => {
      getByTestId("update-name").click();
    });

    await waitFor(() => {
      expect(getByTestId("personal-name")).toHaveTextContent("John Doe");
    });
  });

  it("loads saved data from localStorage on mount", () => {
    const savedData = {
      currentStep: "family",
      personalInfo: { name: "Jane Smith" },
      familyFinancial: {},
      situationDescriptions: {},
      isSubmitting: false,
      lastSaved: "2023-09-25T14:47:26.910Z",
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData));

    const { getByTestId } = render(
      <ApplicationProvider>
        <TestComponent />
      </ApplicationProvider>
    );

    expect(getByTestId("current-step")).toHaveTextContent("family");
    expect(getByTestId("personal-name")).toHaveTextContent("Jane Smith");
  });

  it("handles localStorage errors gracefully", () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error("localStorage error");
    });

    // Should not throw an error
    expect(() => {
      render(
        <ApplicationProvider>
          <TestComponent />
        </ApplicationProvider>
      );
    }).not.toThrow();
  });
});
