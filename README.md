# AgriGestion - Application de Gestion du Rendement Agricole

AgriGestion est une application web complète conçue pour aider les agriculteurs en Afrique à suivre et à optimiser leur rendement agricole. Elle permet de gérer les cultures, les récoltes, les dépenses, et offre une vue d'ensemble des performances financières grâce à un tableau de bord interactif.

## Fonctionnalités

*   **Gestion des Utilisateurs** : Inscription, connexion, gestion de profil.
*   **Gestion des Cultures** : Enregistrement des cultures, dates de plantation, superficies, coûts initiaux.
*   **Gestion des Récoltes** : Suivi des récoltes, quantités, qualités, prix de vente, revenus et bénéfices.
*   **Gestion des Dépenses** : Enregistrement des dépenses par catégorie, association aux cultures.
*   **Tableau de Bord Interactif** : Vue d'ensemble des statistiques clés, graphiques d'évolution des revenus/dépenses, répartition des dépenses.
*   **Historique des Activités** : Chronologie complète des opérations agricoles avec filtres et export CSV.
*   **Conseils Agricoles** : Affichage de conseils personnalisés (simulés pour cette version).

## Technologies Utilisées

### Backend (API REST)

*   **Python 3.11**
*   **Django** : Framework web pour le développement rapide et sécurisé.
*   **Django REST Framework (DRF)** : Pour la création d'API RESTful.
*   **SQLite** : Base de données par défaut (peut être configurée pour PostgreSQL en production).
*   **djangorestframework-simplejwt** : Pour l'authentification JWT.
*   **django-cors-headers** : Pour gérer les requêtes Cross-Origin Resource Sharing (CORS).

### Frontend (Application Web)

*   **ReactJS** : Bibliothèque JavaScript pour la construction d'interfaces utilisateur interactives.
*   **Vite** : Outil de build rapide pour les projets frontend.
*   **Tailwind CSS** : Framework CSS utilitaire pour un stylisme rapide et réactif.
*   **shadcn/ui** : Composants UI réutilisables basés sur Tailwind CSS.
*   **Lucide Icons** : Bibliothèque d'icônes.
*   **Recharts** : Bibliothèque de graphiques pour React.
*   **Axios** : Client HTTP pour les requêtes API.
*   **React Router DOM** : Pour la gestion du routage côté client.

## Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :

*   **Python 3.11** ou supérieur
*   **Node.js** (version 18 ou supérieure) et **pnpm** (gestionnaire de paquets Node.js)

## Instructions d'Installation et d'Exécution

Suivez ces étapes pour configurer et exécuter l'application AgriGestion localement.

### 1. Cloner le dépôt (si applicable)

Si ce projet est hébergé sur un dépôt Git, commencez par le cloner :

```bash
git clone <URL_DU_DEPOT>
cd AgriGestion
```

Dans le contexte de cet environnement de sandbox, les fichiers sont déjà présents dans le répertoire `/home/ubuntu/agri-management-app`.

### 2. Configuration du Backend (Django REST Framework)

Naviguez vers le répertoire du backend et configurez l'environnement Python.

```bash
cd /home/ubuntu/agri-management-app/agri_backend

# Créer et activer un environnement virtuel (recommandé)
python3.11 -m venv venv
source venv/bin/activate

# Installer les dépendances Python
pip install -r requirements.txt
# Si requirements.txt n'existe pas, installez-les manuellement:
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Appliquer les migrations de la base de données
python3.11 manage.py makemigrations
python3.11 manage.py migrate

# Créer un superutilisateur (pour accéder à l'interface d'administration Django)
python3.11 manage.py createsuperuser
# Suivez les invites pour créer un nom d'utilisateur, une adresse e-mail et un mot de passe.

# Démarrer le serveur de développement Django
python3.11 manage.py runserver
```

Le serveur backend sera accessible à `http://localhost:8000`. L'API sera disponible sous `http://localhost:8000/api/`.

### 3. Configuration du Frontend (ReactJS)

Ouvrez un **nouveau terminal** et naviguez vers le répertoire du frontend.

```bash
cd /home/ubuntu/agri-management-app/agri-frontend

# Installer les dépendances Node.js avec pnpm
pnpm install

# Démarrer le serveur de développement React
pnpm run dev
```

Le serveur de développement React sera accessible à `http://localhost:5173` (ou un autre port disponible). L'application se rechargera automatiquement à chaque modification de fichier.

### 4. Accéder à l'Application

Ouvrez votre navigateur web et accédez à l'adresse du frontend (généralement `http://localhost:5173`).

Vous pouvez vous inscrire en tant que nouvel utilisateur ou utiliser le superutilisateur créé pour vous connecter.

## Structure du Projet

```
agri-management-app/
├── agri_backend/             # Dossier du backend Django
│   ├── agri_backend/         # Configuration du projet Django
│   ├── agri_app/             # Application Django pour la logique métier
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── manage.py
│   └── requirements.txt      # Dépendances Python
├── agri-frontend/            # Dossier du frontend React
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Actifs statiques (images, etc.)
│   │   ├── components/       # Composants React de l'application
│   │   │   ├── ui/           # Composants shadcn/ui
│   │   │   ├── CultureForm.jsx
│   │   │   ├── Cultures.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DepenseForm.jsx
│   │   │   ├── Depenses.jsx
│   │   │   ├── Graphiques.jsx
│   │   │   ├── Historique.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profil.jsx
│   │   │   ├── RecolteForm.jsx
│   │   │   ├── Recoltes.jsx
│   │   │   └── Register.jsx
│   │   ├── services/         # Services API
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── vite.config.js
└── README.md                 # Ce fichier
```

## Déploiement

Pour le déploiement en production, il est recommandé d'utiliser un serveur web comme Nginx ou Apache pour servir les fichiers statiques du frontend et de configurer Gunicorn ou uWSGI pour servir l'application Django. La base de données SQLite devrait être remplacée par une base de données plus robuste comme PostgreSQL.

## Auteur

**Marino ATOHOUN (RinoGeek)**

© 2025
