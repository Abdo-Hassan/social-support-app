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
  ApplicationState,
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
  const isLoadingRef = useRef(false);

  // Save current state to localStorage
  const saveToLocalStorage = (stateToSave?: ApplicationState) => {
    if (isLoadingRef.current) return;

    try {
      const dataToSave = {
        ...(stateToSave || state),
        lastSaved: new Date(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log("Application progress saved to localStorage");
    } catch (error) {
      console.warn("Failed to save application progress:", error);
    }
  };

  // Define loadProgress function
  const loadProgress = () => {
    try {
      isLoadingRef.current = true;

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
    } finally {
      // Allow saving again after a brief delay
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 100);
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Actions - Update data without saving
  const updatePersonalInfo = (data: Partial<PersonalInfo>) => {
    console.log("Updating personal info:", data);
    dispatch({ type: "UPDATE_PERSONAL_INFO", payload: data });
    dispatch({ type: "UPDATE_LAST_SAVED" });
  };

  const updateFamilyFinancial = (data: Partial<FamilyFinancial>) => {
    console.log("Updating family financial info:", data);
    dispatch({ type: "UPDATE_FAMILY_FINANCIAL", payload: data });
    dispatch({ type: "UPDATE_LAST_SAVED" });
  };

  const updateSituationDescriptions = (
    data: Partial<SituationDescriptions>
  ) => {
    console.log("Updating situation descriptions:", data);
    dispatch({ type: "UPDATE_SITUATION_DESCRIPTIONS", payload: data });
    dispatch({ type: "UPDATE_LAST_SAVED" });
  };

  // Actions - Save and proceed to next step
  const completePersonalInfoStep = (
    data: PersonalInfo,
    saveOnChange?: boolean
  ) => {
    const updatedState = {
      ...state,
      personalInfo: { ...state.personalInfo, ...data },
      currentStep: !saveOnChange ? ("family" as FormStep) : state.currentStep,
      lastSaved: new Date(),
    };

    updatePersonalInfo(data);
    if (!saveOnChange) {
      setCurrentStep("family");
    }
    saveToLocalStorage(updatedState);
  };

  const completeFamilyFinancialStep = (data: FamilyFinancial) => {
    const updatedState = {
      ...state,
      familyFinancial: { ...state.familyFinancial, ...data },
      currentStep: "situation" as FormStep,
      lastSaved: new Date(),
    };

    updateFamilyFinancial(data);
    setCurrentStep("situation");
    saveToLocalStorage(updatedState);
  };

  const completeSituationDescriptionsStep = (data: SituationDescriptions) => {
    const updatedState = {
      ...state,
      situationDescriptions: { ...state.situationDescriptions, ...data },
      lastSaved: new Date(),
    };

    updateSituationDescriptions(data);
    saveToLocalStorage(updatedState);
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
    saveToLocalStorage();
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
    completePersonalInfoStep,
    completeFamilyFinancialStep,
    completeSituationDescriptionsStep,
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
