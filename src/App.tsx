import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import Keycloak from "keycloak-js";

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  function goHome() {}

  return (
    <div className="container">
      <div className="w-fit cursor-pointer text-red-500" onClick={goHome}>
        snservice
      </div>
      {keycloak.tokenParsed?.email}
      <div onClick={keycloakView}>keycloakView</div>
      {keycloak.authenticated ? (
        <div>
          <div onClick={() => keycloak.logout()}>keycloakLogout</div>
          <div onClick={() => keycloak.updateToken()}>refresh token</div>
        </div>
      ) : (
        <div>
          <div onClick={() => keycloak.login()}>keycloakLogin</div>
        </div>
      )}
      <div>
        <ChevronLeftIcon
          className="inline-block h-6 w-6 cursor-pointer"
          onClick={goBack}
        />
        <ChevronRightIcon
          className="inline-block h-6 w-6 cursor-pointer"
          onClick={goForward}
        />
      </div>
    </div>
  );
}

export default App;
