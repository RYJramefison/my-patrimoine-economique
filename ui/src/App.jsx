// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './menu';
import Add from './add';  // Assurez-vous d'avoir le composant Add
import PatrimoineList from './patrimoineList';  // Assurez-vous d'avoir le composant PatrimoineList
import EditPossession from './editPossession';  // Assurez-vous d'avoir le composant EditPossession

export default function App() {
  return (
    <Router>
      <Menu />  {/* Affiche le menu de navigation */}
      
      <Routes>
        <Route path="/" element={<PatrimoineList />} />  {/* Page d'accueil */}
        <Route path="/add" element={<Add />} />  {/* Route pour ajouter une possession */}
        <Route path="/patrimoine" element={<PatrimoineList />} />  {/* Route pour voir le patrimoine */}
        <Route path="/editPossession/:libelle" element={<EditPossession />} />  {/* Route pour éditer une possession */}
      </Routes>
    </Router>
  );
}
