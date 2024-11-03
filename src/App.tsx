import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";

import { useKeycloak } from "@react-keycloak/web";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  function keycloakView() {
    console.log("keycloakView");
    // console.log(keycloak);
  }

  function goHome() {
    navigate("/");
  }

  function goBack() {
    navigate(-1);
  }

  function goForward() {
    navigate(1);
  }

  return (
    <div className="container-fluid">
      <h1 className="cursor-pointer" onClick={goHome}>
        snservice
      </h1>
      {keycloak.tokenParsed?.email}
      <div onClick={keycloakView}>keycloakView</div>
      {!keycloak.authenticated && (
        <button onClick={() => keycloak.login()}>Login</button>
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
      <Outlet />
    </div>
  );
}

export default App;
