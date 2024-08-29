import express from 'express';
import { loadData, saveData } from './utils.js';
import Patrimoine from '../models/Patrimoine.js';
import Possession from '../models/possessions/Possession.js';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const initializeData = () => {
    const jsonData = loadData();
    const patrimoines = {};

    jsonData.forEach((entry) => {
        if (entry.model === 'Patrimoine') {
            const possesseurNom = entry.data.possesseur.nom;
            const possessions = entry.data.possessions.map((p) => {
                const possession = new Possession(
                    possesseurNom,
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

app.get('/', (req, res) => {
    res.json(patrimoines);
});

app.get('/api/patrimoines', (req, res) => {
    res.json(patrimoines);
});

app.get('/api/possessions/:libelle', (req, res) => {
    const { libelle } = req.params;
    for (const [key, patrimoine] of Object.entries(patrimoines)) {
        const possession = patrimoine.possessions.find(p => p.libelle === libelle);
        if (possession) {
            return res.json(possession);
        }
    }
    res.status(404).send('Possession not found');
});

app.post('/api/possessions', (req, res) => {
    const { nom, libelle, valeur, dateDebut, dateFin, taux } = req.body;
    try {
        if (!nom || !libelle || !valeur || !dateDebut || !taux) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        console.log('Received data:', req.body); // Log les données reçues

        const dateDebutObj = new Date(dateDebut);
        const dateFinObj = dateFin ? new Date(dateFin) : null;

        const newPossession = new Possession(
            nom,
            libelle,
            valeur,
            dateDebutObj,
            dateFinObj,
            taux
        );

        if (!patrimoines[nom]) {
            patrimoines[nom] = new Patrimoine(nom, []);
        }

        patrimoines[nom].addPossession(newPossession);

        // Mise à jour du fichier data.json
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

        saveData(updatedData);

        res.status(201).json(newPossession);
    } catch (error) {
        console.error('Error adding possession:', error.message);
        res.status(500).json({ error: 'Error adding possession' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    open(`http://localhost:${PORT}`);
});
