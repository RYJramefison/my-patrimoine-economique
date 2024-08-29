import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import Patrimoine from '../models/Patrimoine.js';
import Possession from '../models/possessions/Possession.js';

// Configuration du chemin du fichier de données
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/data.json');

// Fonction pour charger les données
const loadData = () => {
  try {
    console.log(`Chargement des données depuis ${dataFilePath}`);
    const data = fs.readFileSync(dataFilePath, 'utf8');
    console.log('Données chargées:', data);
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error.message);
    return [];
  }
};

// Fonction pour sauvegarder les données
const saveData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données:', error.message);
  }
};

// Initialisation des données
const initializeData = () => {
  const jsonData = loadData();
  const patrimoines = {};

  jsonData.forEach((entry) => {
    if (entry.model === 'Patrimoine') {
      const possesseurNom = entry.data.possesseur.nom;
      const possessions = entry.data.possessions.map((p) => {
        const possession = new Possession(
          p.possesseur.nom,
          p.libelle,
          p.valeur,
          new Date(p.dateDebut),
          p.dateFin ? new Date(p.dateFin) : null,
          p.tauxAmortissement
        );

        if (p.valeurConstante !== undefined) {
          possession.valeurConstante = p.valeurConstante;
        }
        if (p.jour !== undefined) {
          possession.jour = p.jour;
        }

        return possession;
      });

      patrimoines[possesseurNom] = new Patrimoine(possesseurNom, possessions);
    }
  });

  return patrimoines;
};

const patrimoines = initializeData();

const app = express();
app.use(express.json());
app.use(cors());

// Route pour obtenir tous les patrimoines
app.get('/api/patrimoines', (req, res) => {
  res.json(patrimoines);
});

// Route pour obtenir une possession par libelle
app.get('/api/possessions/:libelle', (req, res) => {
  const { libelle } = req.params;
  for (const [key, patrimoine] of Object.entries(patrimoines)) {
    const possession = patrimoine.possessions.find(p => p.libelle === libelle);
    if (possession) {
      return res.json(possession);
    }
  }
  res.status(404).send('Possession non trouvée');
});

// Route pour ajouter une possession
app.post('/api/possessions', (req, res) => {
  const { nom, libelle, valeur, dateDebut, dateFin, taux, valeurConstante, jour } = req.body;
  
  try {
    if (!nom || !libelle || !valeur || !dateDebut || !taux) {
      return res.status(400).json({ error: 'Tous les champs requis doivent être remplis' });
    }

    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = dateFin ? new Date(dateFin) : null;

    const newPossession = new Possession(
      nom,
      libelle,
      parseFloat(valeur),
      dateDebutObj,
      dateFinObj,
      parseFloat(taux)
    );

    if (valeurConstante !== undefined) {
      newPossession.valeurConstante = parseFloat(valeurConstante);
    }
    if (jour !== undefined) {
      newPossession.jour = parseInt(jour, 10);
    }

    if (!patrimoines[nom]) {
      // Ajoute le possesseur et initialise ses possessions
      patrimoines[nom] = new Patrimoine(nom, []);
    }

    patrimoines[nom].addPossession(newPossession);

    const updatedData = [];
    for (const [key, patrimoine] of Object.entries(patrimoines)) {
      updatedData.push({
        model: 'Patrimoine',
        data: {
          possesseur: { nom: key },
          possessions: patrimoine.possessions.map(p => ({
            possesseur: { nom: p.possesseur },
            libelle: p.libelle,
            valeur: p.valeur,
            dateDebut: p.dateDebut.toISOString(),
            dateFin: p.dateFin ? p.dateFin.toISOString() : null,
            tauxAmortissement: p.tauxAmortissement,
            valeurConstante: p.valeurConstante,
            jour: p.jour
          }))
        }
      });
    }

    // Ajout de la personne si elle n'existe pas
    const existingPersons = loadData().filter(d => d.model === 'Personne').map(d => d.data.nom);
    if (!existingPersons.includes(nom)) {
      updatedData.push({
        model: 'Personne',
        data: { nom: nom }
      });
    }

    saveData(updatedData);

    res.status(201).json(newPossession);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la possession:', error.message);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la possession' });
  }
});

// Route pour supprimer une possession par libelle
app.delete('/api/possessions/:libelle', (req, res) => {
  const { libelle } = req.params;
  let possessionFound = false;

  // Parcourir chaque patrimoine pour trouver et supprimer la possession
  for (const [key, patrimoine] of Object.entries(patrimoines)) {
    const index = patrimoine.possessions.findIndex(p => p.libelle === libelle);
    if (index !== -1) {
      patrimoine.possessions.splice(index, 1);  // Supprimer la possession trouvée
      possessionFound = true;
      break;  // Possession trouvée, on peut quitter la boucle
    }
  }

  if (!possessionFound) {
    return res.status(404).send('Possession non trouvée');
  }

  // Mettre à jour les données sauvegardées
  const updatedData = [];
  for (const [key, patrimoine] of Object.entries(patrimoines)) {
    updatedData.push({
      model: 'Patrimoine',
      data: {
        possesseur: { nom: key },
        possessions: patrimoine.possessions.map(p => ({
          possesseur: { nom: p.possesseur },
          libelle: p.libelle,
          valeur: p.valeur,
          dateDebut: p.dateDebut.toISOString(),
          dateFin: p.dateFin ? p.dateFin.toISOString() : null,
          tauxAmortissement: p.tauxAmortissement,
          valeurConstante: p.valeurConstante,
          jour: p.jour
        }))
      }
    });
  }

  // Inclure les personnes existantes dans les données mises à jour
  const existingPersons = loadData().filter(d => d.model === 'Personne').map(d => d.data.nom);
  existingPersons.forEach(personName => {
    if (!updatedData.some(data => data.model === 'Personne' && data.data.nom === personName)) {
      updatedData.push({
        model: 'Personne',
        data: { nom: personName }
      });
    }
  });

  saveData(updatedData);

  res.status(200).send('Possession supprimée avec succès');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en fonctionnement sur le port ${PORT}`);
});
