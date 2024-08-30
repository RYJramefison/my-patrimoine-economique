import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Routes, Route } from 'react-router-dom'; 
import AddPossessionForm from './add'; 
import PatrimoineList from './patrimoineList'; 
import Chart from './chart';
import './Menu.css';

export default function Menu() {
    const [showMessage, setShowMessage] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container">
            {showMessage && (
                <div className="opening-message">
                    <h2 className="animated-text">Bienvenue sur le Gestionnaire de Patrimoine Économique</h2>
                </div>
            )}

            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 navbar-custom">
                <a className="navbar-brand" href="#">Patrimoine Économique</a>
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
                        <li className="nav-item">
                            <Link className="nav-link" to="/chart">chart</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            
            <div className="card shadow-lg">
                <div className="card-body">
                    <Routes>
                        <Route path="/add" element={<AddPossessionForm />} />
                        <Route path="/patrimoineList" element={<PatrimoineList />} />
                        <Route path="/chart" element={<Chart />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
