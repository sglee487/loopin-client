import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";

const PrivateRoute = ({
  component: Component,
}: {
  component: React.ComponentType;
}) => {
  const { keycloak, initialized } = useKeycloak();
  // const context = useContext(UserContext);

  useEffect(() => {
    if (initialized) {
      if (!keycloak.authenticated) {
        keycloak.login();
      }
    }
  }, [initialized]);

  if (!initialized) {
    return <p>Loading...</p>;
  }

  if (!keycloak.authenticated) {
    return <p>Authenticating...</p>;
  }

  return <Component />;
};

export default PrivateRoute;
