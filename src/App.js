import React from 'react';
import { Router } from 'react-router-dom';
import hisoty from './services/history';

import Routes from './routes';

function App() {
  return (
    <Router history={hisoty}>
      <Routes />
    </Router>
  )
}

export default App;
