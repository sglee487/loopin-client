import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from './src/application/store/configureStore';
import ApplicationRoutes from './src/presentation/routes/ApplicationRoutes';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { initOptions, onKeycloakEvent } from "./src/infrastructure/api/services/keycloakService";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ReactKeycloakProvider
          authClient={keycloak}
          initOptions={initOptions}
          onEvent={onKeycloakEvent}>
          <BrowserRouter>
            <ApplicationRoutes />
          </BrowserRouter>
        </ReactKeycloakProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
