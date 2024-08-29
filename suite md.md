# Projet Patrimoine

## Deadline : Avant le 30/08/2024 à 08:00 GMT+3

### Backend (NodeJS/Express)
- Créer un dossier *backend* à la racine.
- *Endpoints à mettre en place :*
  - */possession* : 
    - *GET* : Récupérer la liste des possessions.
    - *POST* : Créer une possession avec les paramètres : [libelle, valeur, dateDebut, taux].
    - *PUT* : Mettre à jour une possession par libelle avec les paramètres : [libelle, dateFin].
    - *POST /close* : Clôturer une possession en définissant la dateFin à la date actuelle.
  - */patrimoine/:date* : Récupérer la valeur du patrimoine à une date donnée.
  - */patrimoine/range* : Récupérer la valeur du patrimoine sur une plage de dates avec les paramètres : [dateDebut, dateFin, jour, type].

### UI (React JS)
- *Header :*
  - Menu pour accéder aux pages Patrimoine et Possessions.
  
- *Page Patrimoine (/patrimoine) :*
  - *Graphique :*
    - Sélecteurs de date (dateDebut, dateFin) et choix de jour.
    - Bouton pour valider et récupérer la valeur du patrimoine.
    - Affichage d'un graphique linéaire (Chart.js).
  - *Récupération de la valeur du patrimoine :*
    - Sélecteur de date.
    - Bouton pour valider et récupérer la valeur à la date sélectionnée.

- *Page Liste des Possessions (/possession) :*
  - Bouton pour créer une nouvelle possession (redirige vers la page de création).
  - Tableau affichant les possessions avec les colonnes : Libelle, Valeur, Date Début, Date Fin, Taux, Valeur actuelle + Actions.
    - Actions : Éditer (redirige vers la page d'édition) et Clôturer (API pour fermer la possession).

- *Page de Création de Possession (/possession/create) :*
  - Champs à remplir : Libelle, Valeur, date début, taux.

- *Page de Mise à Jour de Possession (/possession/:libelle/update) :*
  - Champs à remplir : Libelle, date fin.