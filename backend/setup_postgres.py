"""
Script pour vérifier et configurer PostgreSQL pour le projet
"""
import os
import sys
import subprocess
from pathlib import Path

def print_step(message):
    """Affiche un message de progression"""
    print(f"\n{'='*60}")
    print(f"  {message}")
    print(f"{'='*60}\n")

def check_postgres_installed():
    """Vérifie si PostgreSQL est installé"""
    print_step("Vérification de l'installation PostgreSQL")
    
    try:
        result = subprocess.run(
            ['psql', '--version'],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print(f"✓ PostgreSQL est installé : {result.stdout.strip()}")
            return True
        else:
            print("✗ PostgreSQL n'est pas installé ou n'est pas dans le PATH")
            return False
    except FileNotFoundError:
        print("✗ PostgreSQL n'est pas installé ou n'est pas dans le PATH")
        print("\nInstallez PostgreSQL depuis : https://www.postgresql.org/download/")
        return False

def check_env_file():
    """Vérifie si le fichier .env existe et contient les variables PostgreSQL"""
    print_step("Vérification du fichier .env")
    
    env_path = Path(__file__).parent / '.env'
    
    if not env_path.exists():
        print("✗ Le fichier .env n'existe pas")
        print("\nCréation du fichier .env...")
        create_env_file()
        return True
    
    with open(env_path, 'r') as f:
        content = f.read()
    
    required_vars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT']
    missing_vars = [var for var in required_vars if var not in content]
    
    if missing_vars:
        print(f"✗ Variables manquantes dans .env : {', '.join(missing_vars)}")
        print("\nAjout des variables manquantes...")
        add_missing_env_vars(missing_vars)
    else:
        print("✓ Le fichier .env contient toutes les variables PostgreSQL nécessaires")
    
    return True

def create_env_file():
    """Crée un fichier .env avec les variables PostgreSQL"""
    env_content = """SECRET_KEY=django-insecure-dev-key-change-in-production-12345
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL Database Configuration
DB_NAME=entreprises_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
"""
    
    env_path = Path(__file__).parent / '.env'
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print(f"✓ Fichier .env créé : {env_path}")
    print("\n⚠️  N'oubliez pas de modifier DB_PASSWORD avec votre mot de passe PostgreSQL!")

def add_missing_env_vars(missing_vars):
    """Ajoute les variables manquantes au fichier .env"""
    env_path = Path(__file__).parent / '.env'
    
    defaults = {
        'DB_NAME': 'entreprises_db',
        'DB_USER': 'postgres',
        'DB_PASSWORD': 'postgres',
        'DB_HOST': 'localhost',
        'DB_PORT': '5432'
    }
    
    with open(env_path, 'a') as f:
        f.write("\n# PostgreSQL Database Configuration\n")
        for var in missing_vars:
            f.write(f"{var}={defaults.get(var, '')}\n")
    
    print(f"✓ Variables ajoutées au fichier .env")

def test_postgres_connection():
    """Teste la connexion à PostgreSQL"""
    print_step("Test de connexion à PostgreSQL")
    
    from decouple import config
    
    db_user = config('DB_USER', default='postgres')
    db_name = config('DB_NAME', default='entreprises_db')
    db_host = config('DB_HOST', default='localhost')
    db_port = config('DB_PORT', default='5432')
    
    print(f"Tentative de connexion avec :")
    print(f"  - Utilisateur : {db_user}")
    print(f"  - Hôte : {db_host}:{db_port}")
    print(f"  - Base de données : {db_name}")
    
    try:
        import psycopg2
        
        # Test de connexion au serveur PostgreSQL (sans base de données spécifique)
        conn = psycopg2.connect(
            user=db_user,
            password=config('DB_PASSWORD', default=''),
            host=db_host,
            port=db_port,
            database='postgres'  # Base par défaut
        )
        print("\n✓ Connexion au serveur PostgreSQL réussie!")
        conn.close()
        
        # Test de connexion à la base de données spécifique
        try:
            conn = psycopg2.connect(
                user=db_user,
                password=config('DB_PASSWORD', default=''),
                host=db_host,
                port=db_port,
                database=db_name
            )
            print(f"✓ Base de données '{db_name}' existe et est accessible!")
            conn.close()
            return True
        except psycopg2.OperationalError as e:
            if "does not exist" in str(e):
                print(f"\n✗ La base de données '{db_name}' n'existe pas")
                print("\nPour la créer, exécutez :")
                print(f"  psql -U {db_user} -c \"CREATE DATABASE {db_name};\"")
                print("\nOu utilisez pgAdmin pour créer la base de données.")
                return False
            else:
                raise
                
    except ImportError:
        print("\n✗ psycopg2 n'est pas installé")
        print("\nInstallez-le avec : pip install -r requirements.txt")
        return False
    except Exception as e:
        print(f"\n✗ Erreur de connexion : {e}")
        print("\nVérifiez :")
        print("  1. Que PostgreSQL est démarré")
        print("  2. Que le mot de passe dans .env est correct")
        print("  3. Que l'utilisateur PostgreSQL existe")
        return False

def check_psycopg2():
    """Vérifie si psycopg2 est installé"""
    print_step("Vérification de psycopg2 (driver PostgreSQL)")
    
    try:
        import psycopg2
        print(f"✓ psycopg2 est installé : version {psycopg2.__version__}")
        return True
    except ImportError:
        print("✗ psycopg2 n'est pas installé")
        print("\nInstallez-le avec : pip install psycopg2-binary")
        print("Ou : pip install -r requirements.txt")
        return False

def print_summary():
    """Affiche un résumé des prochaines étapes"""
    print_step("Prochaines étapes")
    
    print("1. Si la base de données n'existe pas, créez-la :")
    print("   psql -U postgres -c \"CREATE DATABASE entreprises_db;\"")
    print("")
    print("2. Effectuez les migrations Django :")
    print("   python manage.py makemigrations")
    print("   python manage.py migrate")
    print("")
    print("3. Créez un superuser :")
    print("   python manage.py createsuperuser")
    print("")
    print("4. Lancez le serveur :")
    print("   python manage.py runserver")
    print("")
    print("Pour plus d'informations, consultez : MIGRATION_SQLITE_TO_POSTGRES.md")

def main():
    """Fonction principale"""
    print("\n" + "="*60)
    print("  CONFIGURATION POSTGRESQL POUR LE PROJET")
    print("="*60)
    
    # Vérifications
    postgres_ok = check_postgres_installed()
    env_ok = check_env_file()
    psycopg2_ok = check_psycopg2()
    
    # Si tout est OK, tester la connexion
    if postgres_ok and psycopg2_ok:
        connection_ok = test_postgres_connection()
    else:
        connection_ok = False
    
    # Résumé
    print("\n" + "="*60)
    print("  RÉSUMÉ")
    print("="*60 + "\n")
    print(f"PostgreSQL installé : {'✓' if postgres_ok else '✗'}")
    print(f"Fichier .env configuré : {'✓' if env_ok else '✗'}")
    print(f"psycopg2 installé : {'✓' if psycopg2_ok else '✗'}")
    print(f"Connexion PostgreSQL : {'✓' if connection_ok else '✗'}")
    
    if postgres_ok and env_ok and psycopg2_ok and connection_ok:
        print("\n✓ Tout est prêt ! Vous pouvez lancer les migrations Django.")
    else:
        print("\n⚠️  Certaines étapes doivent être complétées.")
    
    print_summary()

if __name__ == '__main__':
    main()
