import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  ApplicationState,
  FormStep,
  PersonalInfo,
  FamilyFinancial,
  SituationDescriptions,
} from "../types/form";

// Context State
interface ApplicationContextState extends ApplicationState {
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateFamilyFinancial: (data: Partial<FamilyFinancial>) => void;
  updateSituationDescriptions: (data: Partial<SituationDescriptions>) => void;
  setCurrentStep: (step: FormStep) => void;
  setSubmitting: (submitting: boolean) => void;
  setReferenceNumber: (referenceNumber: string) => void;
  saveProgress: () => void;
  loadProgress: () => void;
  resetApplication: () => void;
}

// Action Types
type ApplicationAction =
  | { type: "UPDATE_PERSONAL_INFO"; payload: Partial<PersonalInfo> }
  | { type: "UPDATE_FAMILY_FINANCIAL"; payload: Partial<FamilyFinancial> }
  | {
      type: "UPDATE_SITUATION_DESCRIPTIONS";
      payload: Partial<SituationDescriptions>;
    }
  | { type: "SET_CURRENT_STEP"; payload: FormStep }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_REFERENCE_NUMBER"; payload: string }
  | { type: "LOAD_STATE"; payload: ApplicationState }
  | { type: "RESET_APPLICATION" }
  | { type: "UPDATE_LAST_SAVED" };

// Initial State
const initialState: ApplicationState = {
  currentStep: "personal",
  personalInfo: {},
  familyFinancial: {},
  situationDescriptions: {},
  isSubmitting: false,
  lastSaved: null,
};

// Local Storage Key
const STORAGE_KEY = "social-support-application";

// Reducer
function applicationReducer(
  state: ApplicationState,
  action: ApplicationAction
): ApplicationState {
  switch (action.type) {
    case "UPDATE_PERSONAL_INFO":
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload },
      };

    case "UPDATE_FAMILY_FINANCIAL":
      return {
        ...state,
        familyFinancial: { ...state.familyFinancial, ...action.payload },
      };

    case "UPDATE_SITUATION_DESCRIPTIONS":
      return {
        ...state,
        situationDescriptions: {
          ...state.situationDescriptions,
          ...action.payload,
        },
      };

    case "SET_CURRENT_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };

    case "SET_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case "SET_REFERENCE_NUMBER":
      return {
        ...state,
        referenceNumber: action.payload,
      };

    case "LOAD_STATE":
      return action.payload;

    case "RESET_APPLICATION":
      return { ...initialState };

    case "UPDATE_LAST_SAVED":
      return {
        ...state,
        lastSaved: new Date(),
      };

    default:
      return state;
  }
}

// Context
const ApplicationContext = createContext<ApplicationContextState | null>(null);

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
  };

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
};

// Hook to use the context
export const useApplication = (): ApplicationContextState => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      "useApplication must be used within an ApplicationProvider"
    );
  }
  return context;
};
