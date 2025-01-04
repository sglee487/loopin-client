import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './src/application/store/configureStore';
import ApplicationRoutes from './src/presentation/routes/ApplicationRoutes';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ApplicationRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
