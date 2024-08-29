import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Routes, Route } from 'react-router-dom'; 
import AddPossessionForm from './add'; 
import PatrimoineList from './patrimoineList'; 

// Ajouter des styles personnalisés
import './Menu.css';

export default function Menu() {
    return (
        <div className="container">
            {/* Navbar avec bordure et espacement du texte */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 navbar-custom">
                <a className="navbar-brand" href="#">Patrimoine Economique</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/add">Ajouter une possession</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/patrimoineList">Patrimoine</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            
            {/* Section principale avec padding et bordure */}
            <div className="card shadow-lg">
                <div className="card-body">
                    <Routes>
                        <Route path="/add" element={<AddPossessionForm />} />
                        <Route path="/patrimoineList" element={<PatrimoineList />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
