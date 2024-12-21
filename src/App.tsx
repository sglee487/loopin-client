import { Provider } from 'react-redux';
import { store } from './src/application/store/configureStore';
import HelloWorldComponent from './src/presentation/components/HelloWorldComponent';

function App() {
  return (
    <Provider store={store}>
      <HelloWorldComponent />
    </Provider>
  );
}

export default App;
