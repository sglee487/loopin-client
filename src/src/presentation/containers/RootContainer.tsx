import { Outlet } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const RootContainer: React.FC = () => {
    const { keycloak, initialized } = useKeycloak();
    return (
        <div className="container">
            <h1>
                SN
            </h1>
            <div>
                {!keycloak.authenticated && (
                    <button onClick={() => keycloak.login()}>Login</button>
                )}
                {keycloak.authenticated && (
                    <button onClick={() => keycloak.logout()}>Logout</button>
                )}
            </div>
            <Outlet />
            <footer>
                sn
            </footer>
        </div>
    )
}

export default RootContainer;
