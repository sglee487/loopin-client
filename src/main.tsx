import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { initOptions, onKeycloakEvent } from "./services/Keycloak";
import Watch from "./components/Watch";
import VideoList from "./components/VideoList";
import YoutubeListItem from "./components/YoutubeListItem";
import { invoke } from "@tauri-apps/api/core";
import keycloak from "./services/Keycloak";

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
          <Route path="/" element={<VideoList />} />
          <Route path="/watch/:uuid" element={<Watch />} />
          <Route path="/playlist/:playListId" element={<YoutubeListItem />} />
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
