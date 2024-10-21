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
import Watch from "./components/Watch";
import Root from "./App";
import YoutubeListItem from "./components/YoutubeListItem";
import { invoke } from "@tauri-apps/api/core";
import keycloak from "./services/Keycloak";

import "./App.css";
import "@picocss/pico/css/pico.min.css";
import VideoList from "./components/VideoList";

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
      },
    ],
  },
]);

const Main = () => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      onEvent={onKeycloakEvent}
    >
      <RouterProvider router={router} />
    </ReactKeycloakProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Main />
  // </React.StrictMode>
);
