import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import { BrowserRouter, Route } from "react-router";
// import { Routes } from "react-router";
// import Login from "./pages/Login.tsx";
// import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { UnitProvider } from "./components/core/UnitProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UnitProvider>
      <App />
    </UnitProvider>
    <Toaster position="top-center" />
  </StrictMode>
);
