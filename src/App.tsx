import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from '@application/store/configureStore';
import ApplicationRoutes from '@presentation/routes/ApplicationRoutes';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { keycloakConfig, handleKeycloakEvent } from "@infrastructure/api/services/keycloakService";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ReactKeycloakProvider
          authClient={keycloak}
          initOptions={keycloakConfig}
          onEvent={handleKeycloakEvent}>
          <BrowserRouter>
            <ApplicationRoutes />
          </BrowserRouter>
        </ReactKeycloakProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
