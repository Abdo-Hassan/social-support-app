import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import mock setup to activate API mocking
import "./services/mock";

createRoot(document.getElementById("root")!).render(<App />);
