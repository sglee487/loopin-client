import Keycloak from "keycloak-js";
import { AuthConfig } from "@infrastructure/config/auth.config";

// Keycloak instance configuration
const keycloak = new Keycloak({
    url: AuthConfig.KEYCLOAK_BASE_URL,
    realm: AuthConfig.KEYCLOAK_REALM,
    clientId: AuthConfig.KEYCLOAK_CLIENT_ID,
});

// Keycloak initialization options
export const keycloakConfig = {
    onLoad: "check-sso",
    checkLoginIframe: false,
};

// Keycloak event handler
export const handleKeycloakEvent = async (event: string, error: any) => {
    switch (event) {
        case "onAuthSuccess":
            break;
        case "onAuthLogout":
            keycloak.logout();
            break;
        case "onAuthRefreshError":
            keycloak.logout();
            break;
        case "onAuthRefreshSuccess":
            break;
        default:
            break;
    }
};

export default keycloak; 