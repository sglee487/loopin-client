import { defineStore } from "pinia";
import keycloakService from "../services/keycloak";
import Keycloak from "keycloak-js";
import { jwtDecode } from "jwt-decode";

// Define user type
interface User {
  username?: string;
  token?: string;
  tokenExp?: number;
  refToken?: string;
  refTokenExp?: number;
}

// Define state type
interface State {
  authenticated: boolean;
  user: User;
}

export const useAuthStore = defineStore({
  id: "storeAuth",
  state: (): State => {
    return {
      authenticated: false,
      user: {},
    };
  },
  persist: true,
  getters: {},
  actions: {
    testAction() {
      console.log("testAction");
    },
    // Initialize Keycloak OAuth
    async saveOauth(keycloak: Keycloak, clearData = false) {
      if (clearData) {
        this.clearUserData();
      }

      this.authenticated = keycloak.authenticated || false;
      this.user.username = keycloak.idTokenParsed?.preferred_username;
      this.user.token = keycloak.token;
      this.user.refToken = keycloak.refreshToken;
    },

    async login() {
      try {
        keycloakService.CallLogin();
      } catch (error) {
        console.error(error);
      }
    },

    // Logout user
    async logout() {
      try {
        keycloakService.CallLogout(import.meta.env.VITE_APP_URL);
        this.clearUserData();
      } catch (error) {
        console.error(error);
      }
    },

    // // Refresh user's token
    // async refreshUserToken() {
    //   try {
    //     const keycloak: Keycloak | undefined =
    //       await keycloakService.CallTokenRefresh();
    //     if (keycloak) {
    //       console.log(this.authenticated);
    //       console.log(this.user);
    //       console.log(keycloak.authenticated);
    //       console.log(keycloak.token);
    //       console.log(keycloak.refreshToken);
    //       console.log(keycloak.idTokenParsed?.preferred_username);
    //       await this.saveOauth(keycloak, true);
    //     } else {
    //       console.error("Keycloak token refresh returned undefined.");
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    // Refresh user's token
    async refreshUserTokenWithEndpoint(includeRefreshToken = false) {
      if (!this.user.refToken) {
        console.error("No refresh token found.");
        return;
      }
      try {
        const accessToken: string =
          await keycloakService.refreshUserTokenWithEndpoint(
            this.user.refToken,
          );
        if (accessToken) {
          const decodedAccessToken = jwtDecode(accessToken);
          console.log(decodedAccessToken);
          this.user.token = accessToken;
          this.user.tokenExp = decodedAccessToken.exp;
          // not yet
          // if (includeRefreshToken) {
          //   console.log(decodedAccessToken);
          //   this.user.refToken = decodedAccessToken.refresh_token;
          //   this.user.refTokenExp = decodedAccessToken.refresh_expires_in;
          // }
        } else {
          console.error("Keycloak token refresh returned undefined.");
        }
      } catch (error) {
        console.error(error);
      }
    },
    // Clear user's store data
    clearUserData() {
      this.authenticated = false;
      this.user = {};
    },
  },
});
