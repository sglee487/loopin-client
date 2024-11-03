import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { initOptions, onKeycloakEvent } from "./services/Keycloak";
import Watch from "./routes/Watch";
import Root from "./App";
import YoutubeListItem, {
  loader as YoutubeListItemLoader,
} from "./routes/YoutubeListItem";
import { invoke } from "@tauri-apps/api/core";
import keycloak from "./services/Keycloak";
import VideoList from "./routes/VideoList";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";

import "./App.css";
import "@picocss/pico/css/pico.min.css";
import "@picocss/pico/scss/pico.colors.scss";
import "./picoCustom.css";
import { PersistGate } from "redux-persist/integration/react";

export const getFromRust = async (name: string) => {
  try {
    return await invoke("get_env", { name });
  } catch (e) {
    console.error("getFromRust", e);
  }
  return "";
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <VideoList />,
      },
      {
        path: "/watch/:uuid",
        element: <Watch />,
      },
      {
        path: "/playlist/:playListId",
        element: <YoutubeListItem />,
        loader: YoutubeListItemLoader,
      },
    ],
  },
]);

const Main = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReactKeycloakProvider
          authClient={keycloak}
          initOptions={initOptions}
          onEvent={onKeycloakEvent}
        >
          <RouterProvider router={router} />
        </ReactKeycloakProvider>
      </PersistGate>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Main />
  // </React.StrictMode>
);
