import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from './src/application/store/configureStore';
import ApplicationRoutes from './src/presentation/routes/ApplicationRoutes';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <BrowserRouter>
          <ApplicationRoutes />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
