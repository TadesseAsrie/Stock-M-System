import React from "react";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./hooks/useToast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
