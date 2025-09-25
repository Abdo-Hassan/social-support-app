import { createContext } from "react";
import {
  ApplicationState,
  FormStep,
  PersonalInfo,
  FamilyFinancial,
  SituationDescriptions,
} from "../types/form";

// Context State
export interface ApplicationContextState extends ApplicationState {
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
export const initialState: ApplicationState = {
  currentStep: "personal",
  personalInfo: {},
  familyFinancial: {},
  situationDescriptions: {},
  isSubmitting: false,
  lastSaved: null,
};

// Reducer
export function applicationReducer(
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
export const ApplicationContext = createContext<ApplicationContextState | null>(
  null
);
