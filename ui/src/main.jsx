import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import Menu from './menu';  // Assurez-vous que l'importation est correcte
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>  
      <Menu />
    </Router>
  </React.StrictMode>,
);
