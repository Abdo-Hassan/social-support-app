import AxiosMockAdapter from "axios-mock-adapter";
import api from "./api";

// Create mock adapter with 1.5 second delay
const mock = new AxiosMockAdapter(api, { delayResponse: 1500 });

// Mock the application submit endpoint
mock.onPost("/api/application/submit").reply((config) => {
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
