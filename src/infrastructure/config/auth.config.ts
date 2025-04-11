export const AuthConfig = {
    KEYCLOAK_BASE_URL: import.meta.env.VITE_OAUTH_URL,
    KEYCLOAK_REALM: import.meta.env.VITE_OAUTH_REALM,
    KEYCLOAK_CLIENT_ID: import.meta.env.VITE_OAUTH_CLIENT_ID,
} as const; 