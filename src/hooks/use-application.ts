import { useContext } from "react";
import {
  ApplicationContext,
  ApplicationContextState,
} from "../contexts/ApplicationContext";

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
