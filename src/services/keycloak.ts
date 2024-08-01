import Keycloak from "keycloak-js";

import axios from "axios";
import qs from "qs";

const options = {
  url: import.meta.env.VITE_OAUTH_URL,
  realm: import.meta.env.VITE_OAUTH_REALM,
  clientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
};

const keycloak = new Keycloak(options);
let store: any = null;

// https://medium.com/@erinlim555/keycloak-authentication-with-vue3-pinia-cebae814b9db
/**
 * Initializes Keycloak, then run callback. This will prompt you to login.
 *
 * @param onAuthenticatedCallback
 */
async function init() {
  try {
    const result = await keycloak.init({
      onLoad: "check-sso",
    });

    if (result) {
      await store.saveOauth(keycloak);
    }
  } catch (error) {
    console.error("Keycloak init failed");
    console.error(error);
  }
}

/**
 * Initializes store with Keycloak user data
 *
 */
async function initStore(storeInstance: any) {
  try {
    store = storeInstance;
  } catch (error) {
    console.error("Keycloak init failed");
    console.error(error);
  }
}

/**
 * Logout user
 */
function logout(redirectUri: string) {
  // keycloak.logout({ redirectUri: redirectUri });
  keycloak.logout();
}

/**
 * Refreshes token
 */
async function refreshToken() {
  try {
    await keycloak.updateToken(480);
    return keycloak;
  } catch (error) {
    console.error("Failed to refresh token");
    console.error(error);
  }
}

async function refreshTokenWithEndpoint(refToken: string) {
  try {
    let data = qs.stringify({
      grant_type: "refresh_token",
      client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URL,
      refresh_token: refToken,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_OAUTH_URL}/realms/${import.meta.env.VITE_OAUTH_REALM}/protocol/openid-connect/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    const response = await axios.request(config);
    return response.data["access_token"];
  } catch (error) {
    console.error("Failed to refresh token");
    console.error(error);
    throw error;
  }
}

const KeycloakService = {
  CallInit: init,
  CallInitStore: initStore,
  CallLogin: keycloak.login,
  CallLogout: logout,
  CallTokenRefresh: refreshToken,
  refreshUserTokenWithEndpoint: refreshTokenWithEndpoint,
};

export default KeycloakService;
