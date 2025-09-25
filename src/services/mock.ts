import AxiosMockAdapter from "axios-mock-adapter";
import api from "./api";

// Create mock adapter with 1.5 second delay
const mock = new AxiosMockAdapter(api, { delayResponse: 1500 });

// Mock the application submit endpoint
mock.onPost("/application/submit").reply((config) => {
  console.log("Mock API: Processing application submission...");

  // 80% success, 20% failure
  const isSuccess = Math.random() > 0.2;

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

// Export mock instance in case we need to modify it later
export default mock;
