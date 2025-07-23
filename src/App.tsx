import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import AppRouter from "./router";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppRouter />
        </div>
      </Router>
    </Provider>
  );
}

// temp comment for test ci/cd
// temp comment for test ci/cd
// temp comment for test ci/cd
// temp comment for test ci/cd

export default App;
