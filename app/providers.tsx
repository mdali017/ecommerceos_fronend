"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { persistor, store } from "./redux/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
