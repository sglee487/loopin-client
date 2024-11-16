// https://bakery-it.tistory.com/56
import Keycloak from "keycloak-js";
import { fetchAndSetCurrentPlays } from "../features/playsSlice";
import { store } from "../app/store";

const KEYCLOAK_URL = import.meta.env.VITE_OAUTH_URL;
const KEYCLOAK_REALM_NAME = import.meta.env.VITE_OAUTH_REALM;
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID;

// 위에 설정한 realm, client_id, url 로 keycloak instance 를 생성한다.
const keycloak = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM_NAME,
  clientId: KEYCLOAK_CLIENT_ID,
});

// initOption 지정
export const initOptions = {
  onLoad: "check-sso",
  checkLoginIframe: false,
};

// keycloak Event 를 보기 위한 함수 정의
// keycloak provider 의 onEvent 에 넣어준다.
export const onKeycloakEvent = async (event: any, error: any) => {
  console.log("keycloak event ", event, error);
  switch (event) {
    case "onAuthSuccess":
      console.log("onAuthSuccess");

      const token = keycloak.token; // Keycloak 토큰 가져오기
      if (token) {
        try {
          const result = await store.dispatch(fetchAndSetCurrentPlays(token)); // 완료될 때까지 기다림
          console.log("Fetched current plays:", result);

          // 이후 작업
          console.log("Next action starts now!");
        } catch (err) {
          console.error("Failed to fetch current plays:", err);
        }
      } else {
        console.error("Token is not available");
      }
      break;
    case "onAuthLogout":
      keycloak.logout();
      break;
    case "onAuthRefreshError":
      keycloak.logout();
      break;
    case "onAuthRefreshSuccess":
      console.log("auth token:  " + keycloak.token);
      console.log("refresh token:  " + keycloak.refreshToken);
      break;
    default:
      break;
  }
};

export default keycloak;
