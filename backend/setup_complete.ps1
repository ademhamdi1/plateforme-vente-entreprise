# Script PowerShell pour configuration complète du projet avec PostgreSQL
# Usage: .\setup_complete.ps1

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       CONFIGURATION COMPLÈTE DU PROJET                        ║" -ForegroundColor Cyan
Write-Host "║       Django + PostgreSQL                                     ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Variables
$ErrorActionPreference = "Continue"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackendPath = $PSScriptRoot
$VenvPath = Join-Path $BackendPath "venv"
$ActivateScript = Join-Path $VenvPath "Scripts\Activate.ps1"

# Fonction pour afficher les étapes
function Write-Step {
    param($StepNumber, $Message)
    Write-Host ""
    Write-Host "┌─────────────────────────────────────────────────────────────┐" -ForegroundColor Yellow
    Write-Host "│  ÉTAPE $StepNumber : $Message" -ForegroundColor Yellow
    Write-Host "└─────────────────────────────────────────────────────────────┘" -ForegroundColor Yellow
    Write-Host ""
}

# Fonction pour afficher succès
function Write-Success {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

# Fonction pour afficher erreur
function Write-Error-Message {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Fonction pour afficher info
function Write-Info {
    param($Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# ÉTAPE 1 : Vérifier Python
Write-Step "1" "Vérification de Python"

try {
    $pythonVersion = python --version 2>&1
    Write-Success "Python est installé : $pythonVersion"
} catch {
    Write-Error-Message "Python n'est pas installé ou n'est pas dans le PATH"
    Write-Host "Téléchargez Python depuis : https://www.python.org/downloads/"
    exit 1
}

# ÉTAPE 2 : Vérifier PostgreSQL
Write-Step "2" "Vérification de PostgreSQL"

try {
    $psqlVersion = psql --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "PostgreSQL est installé : $psqlVersion"
    } else {
        throw "PostgreSQL non trouvé"
    }
} catch {
    Write-Error-Message "PostgreSQL n'est pas installé ou n'est pas dans le PATH"
    Write-Info "Téléchargez PostgreSQL depuis : https://www.postgresql.org/download/"
    Write-Info "Vous pouvez continuer sans PostgreSQL, mais il faudra le configurer plus tard."
    $continue = Read-Host "Continuer sans PostgreSQL ? (O/N)"
    if ($continue -ne "O" -and $continue -ne "o") {
        exit 1
    }
}

# ÉTAPE 3 : Créer environnement virtuel
Write-Step "3" "Création de l'environnement virtuel"

if (Test-Path $VenvPath) {
    Write-Info "Environnement virtuel existe déjà"
} else {
    Write-Info "Création de l'environnement virtuel..."
    python -m venv $VenvPath
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Environnement virtuel créé"
    } else {
        Write-Error-Message "Échec de la création de l'environnement virtuel"
        exit 1
    }
}

# ÉTAPE 4 : Activer environnement virtuel et installer dépendances
Write-Step "4" "Installation des dépendances"

if (Test-Path $ActivateScript) {
    Write-Info "Activation de l'environnement virtuel..."
    & $ActivateScript
    
    Write-Info "Installation des packages Python..."
    pip install -r (Join-Path $BackendPath "requirements.txt")
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dépendances installées"
    } else {
        Write-Error-Message "Échec de l'installation des dépendances"
        exit 1
    }
} else {
    Write-Error-Message "Script d'activation introuvable"
    exit 1
}

# ÉTAPE 5 : Vérifier fichier .env
Write-Step "5" "Vérification du fichier .env"

$envFile = Join-Path $BackendPath ".env"
$envExampleFile = Join-Path $BackendPath ".env.example"

if (Test-Path $envFile) {
    Write-Success "Fichier .env existe"
    $content = Get-Content $envFile -Raw
    
    if ($content -match "DB_PASSWORD=postgres" -or $content -notmatch "DB_PASSWORD=.+") {
        Write-Host ""
        Write-Host "⚠️  ATTENTION : Le mot de passe PostgreSQL doit être configuré !" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Voulez-vous configurer le mot de passe maintenant ? (O/N)" -ForegroundColor Yellow
        $configPassword = Read-Host
        
        if ($configPassword -eq "O" -or $configPassword -eq "o") {
            Write-Host "Entrez votre mot de passe PostgreSQL : " -NoNewline
            $password = Read-Host -AsSecureString
            $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
            
            $content = $content -replace "DB_PASSWORD=.*", "DB_PASSWORD=$passwordPlain"
            $content | Set-Content $envFile
            Write-Success "Mot de passe configuré dans .env"
        } else {
            Write-Info "N'oubliez pas de modifier DB_PASSWORD dans backend/.env"
        }
    } else {
        Write-Success "Configuration PostgreSQL détectée dans .env"
    }
} else {
    if (Test-Path $envExampleFile) {
        Write-Info "Création du fichier .env depuis .env.example..."
        Copy-Item $envExampleFile $envFile
        Write-Success "Fichier .env créé"
        Write-Info "⚠️  Modifiez backend/.env avec votre mot de passe PostgreSQL"
    } else {
        Write-Error-Message "Aucun fichier .env ou .env.example trouvé"
    }
}

# ÉTAPE 6 : Créer la base de données PostgreSQL
Write-Step "6" "Création de la base de données PostgreSQL"

if (Get-Command psql -ErrorAction SilentlyContinue) {
    Write-Host "Voulez-vous créer la base de données 'entreprises_db' ? (O/N)" -ForegroundColor Yellow
    $createDB = Read-Host
    
    if ($createDB -eq "O" -or $createDB -eq "o") {
        Write-Info "Création de la base de données..."
        Write-Host "Entrez le mot de passe PostgreSQL quand demandé..." -ForegroundColor Cyan
        
        psql -U postgres -c "CREATE DATABASE entreprises_db;"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Base de données 'entreprises_db' créée"
        } else {
            Write-Info "La base existe peut-être déjà ou il y a eu une erreur"
            Write-Info "Vous pouvez continuer si la base existe déjà"
        }
    }
} else {
    Write-Info "PostgreSQL non disponible, sautant la création de la base"
}

# ÉTAPE 7 : Vérifier la configuration PostgreSQL
Write-Step "7" "Vérification de la configuration PostgreSQL"

$setupScript = Join-Path $BackendPath "setup_postgres.py"
if (Test-Path $setupScript) {
    Write-Info "Exécution du script de vérification..."
    python $setupScript
} else {
    Write-Info "Script setup_postgres.py non trouvé, sautant la vérification"
}

# ÉTAPE 8 : Effectuer les migrations
Write-Step "8" "Migrations Django"

Write-Host "Voulez-vous effectuer les migrations maintenant ? (O/N)" -ForegroundColor Yellow
$doMigrations = Read-Host

if ($doMigrations -eq "O" -or $doMigrations -eq "o") {
    Write-Info "Création des migrations..."
    python (Join-Path $BackendPath "manage.py") makemigrations
    
    Write-Info "Application des migrations..."
    python (Join-Path $BackendPath "manage.py") migrate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Migrations appliquées"
    } else {
        Write-Error-Message "Erreur lors des migrations"
        Write-Info "Vérifiez la configuration PostgreSQL"
    }
}

# ÉTAPE 9 : Créer un superuser
Write-Step "9" "Création du superuser"

Write-Host "Voulez-vous créer un superuser Django ? (O/N)" -ForegroundColor Yellow
$createSuperuser = Read-Host

if ($createSuperuser -eq "O" -or $createSuperuser -eq "o") {
    Write-Info "Création du superuser..."
    python (Join-Path $BackendPath "manage.py") createsuperuser
}

# RÉSUMÉ
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    CONFIGURATION TERMINÉE !                   ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "Prochaines étapes :" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Vérifier backend/.env (mot de passe PostgreSQL)" -ForegroundColor White
Write-Host "2. Lancer le serveur :" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   venv\Scripts\activate" -ForegroundColor Gray
Write-Host "   python manage.py runserver" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Accéder à l'application :" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor Gray
Write-Host "   Admin:    http://localhost:8000/admin" -ForegroundColor Gray
Write-Host "   API:      http://localhost:8000/api" -ForegroundColor Gray
Write-Host "   Swagger:  http://localhost:8000/swagger" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 Documentation :" -ForegroundColor Cyan
Write-Host "   POSTGRES_RESUME.md - Résumé" -ForegroundColor Gray
Write-Host "   QUICK_START_POSTGRES.md - Guide rapide" -ForegroundColor Gray
Write-Host "   AIDE_MEMOIRE_POSTGRES.txt - Aide-mémoire" -ForegroundColor Gray
Write-Host ""

Write-Host "Appuyez sur une touche pour terminer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
