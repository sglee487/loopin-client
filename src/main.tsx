import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { initOptions, onKeycloakEvent } from "./services/Keycloak";
import Watch from "./components/Watch";
import Root from "./App";
import YoutubeListItem from "./components/YoutubeListItem";
import { invoke } from "@tauri-apps/api/core";
import keycloak from "./services/Keycloak";

import "@picocss/pico/css/pico.min.css";

export const getFromRust = async (name: string) => {
  try {
    return await invoke("get_env", { name });
  } catch (e) {
    console.error("getFromRust", e);
  }
  return "";
};

const Main = () => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      onEvent={onKeycloakEvent}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route path="/watch/:uuid" element={<Watch />} />
            <Route path="/playlist/:playListId" element={<YoutubeListItem />} />
          </Route>
        </Routes>
      </Router>
    </ReactKeycloakProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Main />
  // </React.StrictMode>
);
