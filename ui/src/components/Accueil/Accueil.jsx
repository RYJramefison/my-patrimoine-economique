import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Accueil.css';

export default function Accueil() {
    return (
        <div className="d-flex justify-content-center align-items-center accueil-container">
            <div className="text-center animated-container">
                <h1 className="mb-4 animated-title">Gestionnaire de Patrimoine Économique</h1>
                <p className="lead animated-description">
                    Gérez facilement votre patrimoine financier, suivez vos possessions et planifiez votre avenir économique.
                </p>
                <p className="mb-5 lead animated-description">
                    Accédez à vos informations rapidement et de manière sécurisée.
                </p>
                <div className="d-flex justify-content-center">
                    <Link to="/patrimoineList" className="btn btn-primary btn-lg mx-3 animated-button">
                        Voir le Patrimoine
                    </Link>
                    <Link to="/add" className="btn btn-outline-secondary btn-lg mx-3 animated-button">
                        Consuler la Possession
                    </Link>
                </div>
            </div>
        </div>
    );
}
