import React, { useReducer, useEffect, useRef, ReactNode } from "react";
import {
  ApplicationContext,
  ApplicationContextState,
  applicationReducer,
  initialState,
} from "./ApplicationContext";
import {
  PersonalInfo,
  FamilyFinancial,
  SituationDescriptions,
  FormStep,
} from "../types/form";

// Local Storage Keys
const STORAGE_KEY = "social-support-application";
const RESULT_STORAGE_KEY = "social-support-application-result";

// Provider Component
interface ApplicationProviderProps {
  children: ReactNode;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(applicationReducer, initialState);
  const shouldSaveRef = useRef(false);

  // Define loadProgress function
  const loadProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Ensure the loaded state has a valid structure
        if (parsedState && typeof parsedState === "object") {
          dispatch({
            type: "LOAD_STATE",
            payload: {
              ...initialState,
              ...parsedState,
              lastSaved: parsedState.lastSaved
                ? new Date(parsedState.lastSaved)
                : null,
            },
          });
        }
      }
    } catch (error) {
      console.warn("Failed to load application progress:", error);
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Auto-save to localStorage when state changes and we should save
  useEffect(() => {
    if (shouldSaveRef.current && state.lastSaved !== null) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        shouldSaveRef.current = false;
      } catch (error) {
        console.warn("Failed to save application progress:", error);
      }
    }
  }, [state]);

  // Actions
  const updatePersonalInfo = (data: Partial<PersonalInfo>) => {
    // Only update if there's actual change
    const hasChanges = Object.keys(data).some(
      (key) =>
        state.personalInfo[key as keyof PersonalInfo] !==
        data[key as keyof PersonalInfo]
    );

    if (hasChanges) {
      shouldSaveRef.current = true;
      dispatch({ type: "UPDATE_PERSONAL_INFO", payload: data });
      dispatch({ type: "UPDATE_LAST_SAVED" });
    }
  };

  const updateFamilyFinancial = (data: Partial<FamilyFinancial>) => {
    // Only update if there's actual change
    const hasChanges = Object.keys(data).some(
      (key) =>
        state.familyFinancial[key as keyof FamilyFinancial] !==
        data[key as keyof FamilyFinancial]
    );

    if (hasChanges) {
      shouldSaveRef.current = true;
      dispatch({ type: "UPDATE_FAMILY_FINANCIAL", payload: data });
      dispatch({ type: "UPDATE_LAST_SAVED" });
    }
  };

  const updateSituationDescriptions = (
    data: Partial<SituationDescriptions>
  ) => {
    // Only update if there's actual change
    const hasChanges = Object.keys(data).some(
      (key) =>
        state.situationDescriptions[key as keyof SituationDescriptions] !==
        data[key as keyof SituationDescriptions]
    );

    if (hasChanges) {
      shouldSaveRef.current = true;
      dispatch({ type: "UPDATE_SITUATION_DESCRIPTIONS", payload: data });
      dispatch({ type: "UPDATE_LAST_SAVED" });
    }
  };

  const setCurrentStep = (step: FormStep) => {
    dispatch({ type: "SET_CURRENT_STEP", payload: step });
  };

  const setSubmitting = (submitting: boolean) => {
    dispatch({ type: "SET_SUBMITTING", payload: submitting });
  };

  const setReferenceNumber = (referenceNumber: string) => {
    dispatch({ type: "SET_REFERENCE_NUMBER", payload: referenceNumber });
  };

  // Save application result to localStorage (for /application-result page)
  const saveApplicationResult = (referenceNumber: string) => {
    try {
      const resultData = {
        referenceNumber,
        submissionDate: new Date().toISOString(),
        personalInfo: state.personalInfo,
        familyFinancial: state.familyFinancial,
        situationDescriptions: state.situationDescriptions,
      };
      localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(resultData));
    } catch (error) {
      console.warn("Failed to save application result:", error);
    }
  };

  // Load application result from localStorage
  const loadApplicationResult = () => {
    try {
      const saved = localStorage.getItem(RESULT_STORAGE_KEY);
      if (saved) {
        const parsedResult = JSON.parse(saved);
        return parsedResult;
      }
    } catch (error) {
      console.warn("Failed to load application result:", error);
    }
    return null;
  };

  const saveProgress = () => {
    shouldSaveRef.current = true;
    dispatch({ type: "UPDATE_LAST_SAVED" });
  };

  const resetApplication = () => {
    dispatch({ type: "RESET_APPLICATION" });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear application progress:", error);
    }
  };

  const contextValue: ApplicationContextState = {
    ...state,
    updatePersonalInfo,
    updateFamilyFinancial,
    updateSituationDescriptions,
    setCurrentStep,
    setSubmitting,
    setReferenceNumber,
    saveProgress,
    loadProgress,
    resetApplication,
    saveApplicationResult,
    loadApplicationResult,
  };

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
};
