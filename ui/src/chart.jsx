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
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Valeur au début",
        data: [],
        backgroundColor: "rgba(35, 135, 182, 0.6)",
        borderColor: "rgb(35, 135, 182)",
        borderWidth: 1
      },
      {
        label: "Valeur à la fin",
        data: [],
        backgroundColor: "rgba(182, 35, 35, 0.6)",
        borderColor: "rgb(182, 35, 35)",
        borderWidth: 1
      }
    ]
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch possessions
    axios.get('http://localhost:3000/api/possessions')
      .then((response) => {
        setPossessions(response.data);
      })
      .catch((error) => {
        setError("Erreur lors du chargement des possessions.");
        console.error(error);
      });

    // Fetch people
    axios.get('http://localhost:3000/api/personnes')
      .then((response) => {
        setPeople(response.data);
      })
      .catch((error) => {
        setError("Erreur lors du chargement des personnes.");
        console.error(error);
      });
  }, []);

  function handleValidation() {
    if (selectedPerson && dateDebut && dateFin) {
      const filteredPossessions = possessions.filter(p => 
        p.possesseur.nom === selectedPerson &&
        new Date(p.dateDebut) >= new Date(dateDebut) &&
        new Date(p.dateDebut) <= new Date(dateFin)
      );
      processPossessions(filteredPossessions);
    }
  }

  function processPossessions(data) {
    const valueDebut = data
      .filter(possession => new Date(possession.dateDebut).toISOString().split('T')[0] === new Date(dateDebut).toISOString().split('T')[0])
      .reduce((acc, possession) => acc + (possession.valeur || 0), 0);

    const valueFin = data
      .filter(possession => new Date(possession.dateDebut).toISOString().split('T')[0] === new Date(dateFin).toISOString().split('T')[0])
      .reduce((acc, possession) => acc + (possession.valeur || 0), 0);

    setChartData({
      labels: ['Date Début', 'Date Fin'],
      datasets: [
        {
          label: "Valeur au début",
          data: [valueDebut],
          backgroundColor: "rgba(35, 135, 182, 0.6)",
          borderColor: "rgb(35, 135, 182)",
          borderWidth: 1
        },
        {
          label: "Valeur à la fin",
          data: [valueFin],
          backgroundColor: "rgba(182, 35, 35, 0.6)",
          borderColor: "rgb(182, 35, 35)",
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
          text: 'Dates'
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
                <input
                  type="date"
                  id="dateDebut"
                  className="form-control"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="dateFin" className="form-label">Date fin</label>
                <input
                  type="date"
                  id="dateFin"
                  className="form-control"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                />
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
              {error && <p className="text-danger mt-3">{error}</p>}
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
