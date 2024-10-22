
import React from 'react';
import ReactDOM from 'react-dom';
import './App.css'; // Eventuell styling som gäller globalt
import Frontpage from './frontpage';

ReactDOM.render(
  <React.StrictMode>
    <Frontpage />
  </React.StrictMode>,
  document.getElementById('root')
);