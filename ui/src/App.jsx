// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './menu';
import Add from './add';  // Assurez-vous d'avoir le composant Add
import Patrimoine from './patrimoineList';  // Assurez-vous d'avoir le composant Patrimoine

export default function App() {
  return (
    <Router>
      <Menu />  {/* Affiche le menu de navigation */}
      
      <Routes>
        <Route path="/" element={<Patrimoine />} />  {/* Page d'accueil */}
        <Route path="/add" element={<Add />} />  {/* Route pour ajouter une possession */}
        <Route path="/patrimoine" element={<Patrimoine />} />  {/* Route pour voir le patrimoine */}
      </Routes>
    </Router>
  );
}
