import { Outlet, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const RootContainer: React.FC = () => {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();

    if (!initialized) {
        return <div>Loading...</div>
    }

    const _goHome = () => {
        navigate('/');
    }

    return (
        <div className="container">
            <h1 className="cursor-pointer" onClick={_goHome} >
                SN
            </h1>
            <div>
                {!keycloak.authenticated && (
                    <button onClick={() => keycloak.login()}>Login</button>
                )}
                {keycloak.authenticated && (
                    <div>
                        <p>{keycloak.tokenParsed?.email}</p>
                        <button onClick={() => keycloak.logout()}>Logout</button>
                    </div>
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
