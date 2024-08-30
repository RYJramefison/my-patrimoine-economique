import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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
    <div>
      <h2>Modifier la Possession</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="libelle" value={formData.libelle} onChange={handleChange} required />
        <input type="number" name="valeur" value={formData.valeur} onChange={handleChange} required />
        <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} required />
        <input type="date" name="dateFin" value={formData.dateFin || ''} onChange={handleChange} />
        <input type="number" name="taux" value={formData.taux} onChange={handleChange} required />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default EditPossession;
