// https://bakery-it.tistory.com/56
import Keycloak from "keycloak-js";

const KEYCLOAK_BASE_URL = import.meta.env.VITE_OAUTH_URL;
const KEYCLOAK_REALM = import.meta.env.VITE_OAUTH_REALM;
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID;

// 위에 설정한 realm, client_id, url 로 keycloak instance 를 생성한다.
const keycloak = new Keycloak({
    url: KEYCLOAK_BASE_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID,
});

// initOption 지정
export const keycloakConfig = {
    onLoad: "check-sso",
    checkLoginIframe: false,
};

// keycloak Event 를 보기 위한 함수 정의
// keycloak provider 의 onEvent 에 넣어준다.
export const handleKeycloakEvent = async (event: any, error: any) => {
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
