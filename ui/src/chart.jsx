import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function BarChartComponent() {
    const [possessions, setPossessions] = useState([]);
    const [people, setPeople] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState("");
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Valeurs calculées",
                data: [],
                backgroundColor: "rgba(35, 135, 182, 0.2)",
                borderColor: "rgb(35, 135, 182)",
                borderWidth: 1
            }
        ]
    });

    useEffect(() => {
        // Charger les possessions
        axios.get('http://localhost:3000/api/possessions')
            .then((response) => {
                const possessionsData = response.data;
                setPossessions(possessionsData);
            })
            .catch((error) => {
                console.error(error);
            });

        // Charger les personnes
        axios.get('http://localhost:3000/api/personnes')
            .then((response) => {
                const peopleData = response.data;
                setPeople(peopleData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    function handleValidation() {
        if (selectedPerson) {
            const filteredPossessions = possessions.filter(p => p.possesseur.nom === selectedPerson);
            processPossessions(filteredPossessions);
        }
    }

    function processPossessions(data) {
        const labels = [];
        const values = [];

        data.forEach((possession) => {
            const { dateDebut, valeur } = possession;
            if (dateDebut && valeur != null) { // Vérifier que les données sont valides
                const date = new Date(dateDebut);
                const day = `${date.getDate()}/${date.getMonth() + 1}`; // Format: DD/MM
                labels.push(day);
                values.push(valeur);
            }
        });

        setChartData({
            labels,
            datasets: [
                {
                    label: "Valeurs calculées",
                    data: values,
                    backgroundColor: "rgba(35, 135, 182, 0.2)",
                    borderColor: "rgb(35, 135, 182)",
                    borderWidth: 1
                }
            ]
        });
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `Valeur: ${tooltipItem.raw}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Jour'
                },
                grid: {
                    display: false
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Valeur'
                },
                beginAtZero: true,
                grid: {
                    color: '#e3e3e3'
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutBounce'
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="card-title">Paramètres de filtre</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="dateDebut" className="form-label">Date début</label>
                                <input type="date" id="dateDebut" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="dateFin" className="form-label">Date fin</label>
                                <input type="date" id="dateFin" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="personSelect" className="form-label">Sélectionner une personne</label>
                                <select 
                                    id="personSelect"
                                    className="form-select"
                                    value={selectedPerson} 
                                    onChange={(e) => setSelectedPerson(e.target.value)}
                                >
                                    <option value="">Choisir...</option>
                                    {people.map((person, index) => (
                                        <option key={index} value={person.nom}>{person.nom}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="btn btn-primary" onClick={handleValidation}>Valider</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Graphique de patrimoine</h5>
                        </div>
                        <div className="card-body">
                            <Bar options={options} data={chartData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BarChartComponent;
