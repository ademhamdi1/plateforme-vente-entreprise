# Comment Lancer le Projet

Guide complet pour démarrer le backend Django et le frontend React.

---

## Prérequis

- Python 3.8+
- Node.js 14+
- npm ou yarn
- Git
- **PostgreSQL 12+** (installé et en cours d'exécution)

---

## 0. CONFIGURATION POSTGRESQL

### Étape 1 : Installer PostgreSQL

Téléchargez et installez PostgreSQL depuis : https://www.postgresql.org/download/

### Étape 2 : Créer la base de données

**Option 1 : Avec pgAdmin (interface graphique)**
1. Ouvrez pgAdmin
2. Connectez-vous au serveur PostgreSQL
3. Clic droit sur "Databases" → "Create" → "Database"
4. Nom : `entreprises_db`
5. Owner : `postgres`

**Option 2 : Avec psql (ligne de commande)**
```bash
psql -U postgres
CREATE DATABASE entreprises_db;
\q
```

### Étape 3 : Vérifier la connexion

```bash
psql -U postgres -d entreprises_db
```

Si la connexion fonctionne, vous êtes prêt !

---

## 1. BACKEND DJANGO

### Étape 1 : Ouvrir le terminal dans le dossier backend

```cmd
cd backend
```

### Étape 2 : Activer l'environnement virtuel

**Windows (CMD) :**
```cmd
venv\Scripts\activate
```

**Windows (PowerShell) :**
```powershell
venv\Scripts\Activate.ps1
```

**Linux/Mac :**
```bash
source venv/bin/activate
```

### Étape 3 : Installer les dépendances (première fois seulement)

```cmd
pip install -r requirements.txt
```

**Note :** Cette commande installe maintenant `psycopg2-binary`, le driver PostgreSQL pour Django.

### Étape 4 : Configurer les variables d'environnement

Modifiez le fichier `backend/.env` si nécessaire :
```env
DB_NAME=entreprises_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgres
DB_HOST=localhost
DB_PORT=5432
```

### Étape 5 : Faire les migrations (première fois seulement)

```cmd
python manage.py makemigrations
python manage.py migrate
```

### Étape 6 : Créer un superuser (première fois seulement)

```cmd
python manage.py createsuperuser
```

Suivez les instructions :
- Username : admin (ou votre choix)
- Email : admin@example.com
- Password : ****
- Password (again) : ****

### Étape 7 : Lancer le serveur Django

```cmd
python manage.py runserver
```

**Résultat :**
- Backend disponible sur : `http://localhost:8000`
- Admin Django : `http://localhost:8000/admin`
- API : `http://localhost:8000/api`
- Swagger : `http://localhost:8000/swagger`

---

## 2. FRONTEND REACT

### Étape 1 : Ouvrir un NOUVEAU terminal

**IMPORTANT : Ne fermez PAS le terminal du backend !**

### Étape 2 : Aller dans le dossier frontend

```cmd
cd frontend
```

### Étape 3 : Installer les dépendances (première fois seulement)

```cmd
npm install
```

### Étape 4 : Lancer le serveur React

```cmd
npm start
```

**Résultat :**
- Frontend disponible sur : `http://localhost:3000`
- La page s'ouvre automatiquement dans votre navigateur

---

## Résumé : Commandes Rapides

### Pour lancer le backend :
```cmd
cd backend
venv\Scripts\activate
python manage.py runserver
```

### Pour lancer le frontend (dans un autre terminal) :
```cmd
cd frontend
npm start
```

---

## Vérifier que tout fonctionne

1. **Backend** : Allez sur `http://localhost:8000/admin`
   - Connectez-vous avec le superuser créé
   - Vous devriez voir l'interface admin Django

2. **Frontend** : Allez sur `http://localhost:3000`
   - Vous devriez voir la page d'accueil
   - Essayez de vous connecter ou de créer un compte

3. **API** : Allez sur `http://localhost:8000/swagger`
   - Documentation interactive de l'API

---

## Problèmes Courants

### Problème : "venv n'est pas reconnu"
**Solution :** Vous n'avez pas d'environnement virtuel. Créez-en un :
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Problème : "Port 8000 déjà utilisé"
**Solution :** Arrêtez le processus Django précédent ou utilisez un autre port :
```cmd
python manage.py runserver 8001
```

### Problème : "Port 3000 déjà utilisé"
**Solution :** React propose automatiquement le port 3001. Tapez `y` pour accepter.

### Problème : "Module not found"
**Solution Backend :**
```cmd
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

**Solution Frontend :**
```cmd
cd frontend
npm install
```

### Problème : "No module named 'apps'"
**Solution :** Vous n'êtes pas dans le bon dossier :
```cmd
cd backend
python manage.py runserver
```

### Problème : "FATAL: password authentication failed for user postgres"
**Solution :** Le mot de passe PostgreSQL est incorrect. Modifiez `backend/.env` :
```env
DB_PASSWORD=votre_mot_de_passe_postgres_correct
```

### Problème : "connection to server at localhost (::1), port 5432 failed"
**Solution :** PostgreSQL n'est pas démarré. Démarrez le service :
- **Windows :** Services → PostgreSQL → Démarrer
- **Linux/Mac :** `sudo service postgresql start`

### Problème : "database entreprises_db does not exist"
**Solution :** Créez la base de données :
```bash
psql -U postgres
CREATE DATABASE entreprises_db;
\q
```

---

## Arrêter les serveurs

### Arrêter le backend :
- Dans le terminal du backend : `Ctrl + C`

### Arrêter le frontend :
- Dans le terminal du frontend : `Ctrl + C`

---

## Commandes Utiles

### Backend

**Créer des migrations après modification des modèles :**
```cmd
python manage.py makemigrations
python manage.py migrate
```

**Créer un superuser :**
```cmd
python manage.py createsuperuser
```

**Collecter les fichiers statiques (production) :**
```cmd
python manage.py collectstatic
```

**Vider la base de données :**
```cmd
python manage.py flush
```

**Ouvrir le shell Django :**
```cmd
python manage.py shell
```

### Frontend

**Installer une nouvelle dépendance :**
```cmd
npm install nom-du-package
```

**Build pour production :**
```cmd
npm run build
```

**Nettoyer node_modules et réinstaller :**
```cmd
rmdir /s /q node_modules
npm install
```

---

## Structure des URLs

### Backend
- Admin : `http://localhost:8000/admin`
- API Base : `http://localhost:8000/api`
- Swagger : `http://localhost:8000/swagger`
- ReDoc : `http://localhost:8000/redoc`

### Frontend
- Accueil : `http://localhost:3000/`
- Entreprises : `http://localhost:3000/entreprises`
- Connexion : `http://localhost:3000/login`
- Inscription : `http://localhost:3000/register`
- Dashboard : `http://localhost:3000/dashboard`

---

## Comptes Utilisateurs Créés

### Admin (Django Admin)
```
URL      : http://localhost:8000/admin
Username : admin
Password : admin123
Email    : admin@entreprises.tn
Type     : Administrateur
```

### Acheteur 1
```
URL      : http://localhost:3000/login
Username : adem
Password : adem123
Email    : adem@gmail.com
Type     : Acheteur
```

### Acheteur 2
```
URL      : http://localhost:3000/login
Username : acheteur
Password : test123
Email    : acheteur@test.com
Type     : Acheteur
```

### Vendeur
```
URL      : http://localhost:3000/login
Username : vendeur
Password : vendeur123
Email    : vendeur@entreprises.tn
Type     : Vendeur
```

---

## Variables d'environnement

### Backend (.env dans /backend)
```env
SECRET_KEY=votre-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL Database
DB_NAME=entreprises_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432
```

### Frontend (.env dans /frontend)
```env
REACT_APP_API_URL=http://localhost:8000/api
```

---

## Premier lancement complet (depuis le début)

Si c'est votre première fois, suivez ces étapes dans l'ordre :

### Terminal 1 (Backend)
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Important :** Assurez-vous que PostgreSQL est installé et que la base de données `entreprises_db` existe avant de lancer ces commandes.

### Terminal 2 (Frontend)
```cmd
cd frontend
npm install
npm start
```

---

## Tester l'API

### Avec Swagger (recommandé)
1. Allez sur `http://localhost:8000/swagger`
2. Cliquez sur un endpoint (ex: `/api/entreprises/`)
3. Cliquez sur "Try it out"
4. Cliquez sur "Execute"

### Avec curl (CMD)
```cmd
curl http://localhost:8000/api/entreprises/
```

### Avec le navigateur
Ouvrez directement : `http://localhost:8000/api/entreprises/`

---

## Logs et Débogage

### Voir les logs Django
Les logs s'affichent directement dans le terminal où vous avez lancé `runserver`

### Voir les logs React
Les logs s'affichent dans le terminal où vous avez lancé `npm start`

### Console du navigateur
Ouvrez les DevTools : `F12` ou `Ctrl + Shift + I`

---

## Commandes en une ligne

### Lancer tout (2 terminaux nécessaires)

**Terminal 1 :**
```cmd
cd backend && venv\Scripts\activate && python manage.py runserver
```

**Terminal 2 :**
```cmd
cd frontend && npm start
```

---

**Date de création :** Juillet 2026  
**Système :** Windows  
**Shell :** CMD / PowerShell
