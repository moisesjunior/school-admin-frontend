import React from 'react';
import Router from './routes';
import './styles.css';
import AmplifyConfigure from './services/AmplifySetup';
import { createStore } from 'redux';
import rootReducer from './state/reducers';
import { Provider } from 'react-redux';


function App() {
  const store = createStore(rootReducer);

  AmplifyConfigure();

  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
