import AxiosMockAdapter from "axios-mock-adapter";
import api from "./api";

// Create mock adapter with 1.5 second delay
const mock = new AxiosMockAdapter(api, { delayResponse: 1500 });

// Mock the application submit endpoint
mock.onPost("/application/submit").reply((config) => {
  console.log("Mock API: Processing application submission...");
  console.log("Request data:", JSON.parse(config.data));

  // Check if we should force a specific response (for testing)
  const forceSuccess = localStorage.getItem("mock-force-success");
  const forceError = localStorage.getItem("mock-force-error");

  let isSuccess;
  if (forceSuccess === "true") {
    isSuccess = true;
    console.log("Mock API: Forcing success response");
  } else if (forceError === "true") {
    isSuccess = false;
    console.log("Mock API: Forcing error response");
  } else {
    // 80% success, 20% failure
    isSuccess = Math.random() > 0.2;
    console.log(
      `Mock API: Random response - ${isSuccess ? "success" : "error"}`
    );
  }

  if (isSuccess) {
    // Success response
    const timestamp = Date.now();
    return [
      200,
      {
        code: 200,
        message: "Application submitted successfully",
        referenceNumber: `REF-${timestamp}`,
      },
    ];
  } else {
    // Failure response
    return [
      500,
      {
        code: 500,
        message: "Server error. Please try again.",
      },
    ];
  }
});

export default mock;

// Helper functions for testing (available in console)
declare global {
  interface Window {
    mockAPI: {
      forceSuccess: () => void;
      forceError: () => void;
      randomMode: () => void;
      testSubmit: () => void;
    };
  }
}

// Add helper functions to window for easy testing
if (typeof window !== "undefined") {
  window.mockAPI = {
    forceSuccess: () => {
      localStorage.setItem("mock-force-success", "true");
      localStorage.removeItem("mock-force-error");
      console.log("Mock API set to force success responses");
    },
    forceError: () => {
      localStorage.setItem("mock-force-error", "true");
      localStorage.removeItem("mock-force-success");
      console.log("Mock API set to force error responses");
    },
    randomMode: () => {
      localStorage.removeItem("mock-force-success");
      localStorage.removeItem("mock-force-error");
      console.log("Mock API set to random mode (80% success, 20% error)");
    },
    testSubmit: () => {
      console.log("Mock API test submit functionality");
      const testData = {
        personalInfo: { name: "Test User" },
        familyFinancial: { monthlyIncome: 1000 },
        situationDescriptions: { financialSituation: "Test situation" },
      };

      // Use the api instance to test the mock
      import("./api").then(({ default: api }) => {
        api
          .post("/application/submit", testData)
          .then((response) =>
            console.log("Test submit success:", response.data)
          )
          .catch((error) =>
            console.log(
              "Test submit error:",
              error.response?.data || error.message
            )
          );
      });
    },
  };
}
