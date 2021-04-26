import React from 'react';
import Router from './routes';
import './styles.css';
import AmplifyConfigure from './services/AmplifySetup';


function App() {
  AmplifyConfigure();

  return (
    <Router />
  );
}

export default App;
