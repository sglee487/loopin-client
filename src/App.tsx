/**
 * Main Application Component
 * 
 * This component serves as the root of the application and sets up:
 * 1. Redux store with persistence
 * 2. Keycloak authentication provider
 * 3. React Router for navigation
 * 
 * The application follows a layered architecture:
 * - Presentation: UI components and routing
 * - Application: Business logic and state management
 * - Infrastructure: External services (Keycloak, API)
 * - Domain: Core business entities
 */

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from '@application/store/configureStore';
import ApplicationRoutes from '@presentation/routes/ApplicationRoutes';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { keycloakConfig, handleKeycloakEvent } from "@infrastructure/auth/keycloakService";

function App() {
  return (
    // Redux Provider for state management
    <Provider store={store}>
      {/* PersistGate ensures Redux state is rehydrated before rendering */}
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {/* Keycloak Provider for authentication */}
        <ReactKeycloakProvider
          authClient={keycloak}
          initOptions={keycloakConfig}
          onEvent={handleKeycloakEvent}>
          {/* React Router for navigation */}
          <BrowserRouter>
            <ApplicationRoutes />
          </BrowserRouter>
        </ReactKeycloakProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
