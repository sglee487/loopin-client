import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import AppRouter from "@/router";
import { ThemeProvider } from "@/hooks/useTheme";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
