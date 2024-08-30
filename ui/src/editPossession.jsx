import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPossession = () => {
  const { libelle } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    libelle: '',
    valeur: '',
    dateDebut: '',
    dateFin: '',
    taux: '',
    valeurConstante: '',
    jour: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/possessions/${libelle}`)
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de la possession:', error);
        setError('Erreur lors de la récupération de la possession.');
      });
  }, [libelle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/possessions/${libelle}`, formData)
      .then(response => {
        console.log('Possession mise à jour:', response.data);
        navigate('/'); 
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour de la possession:', error);
        setError('Erreur lors de la mise à jour de la possession.');
      });
  };

  return (
    <div className="container mt-4">
      <h2>Modifier la Possession</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
      </form>
    </div>
  );
};

export default EditPossession;
