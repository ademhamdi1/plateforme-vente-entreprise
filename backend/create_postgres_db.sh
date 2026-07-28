#!/bin/bash
# Script pour créer la base de données PostgreSQL pour le projet

echo "========================================"
echo "  CRÉATION DE LA BASE DE DONNÉES"
echo "========================================"
echo ""

echo "Création de la base de données 'entreprises_db'..."
echo ""

# Création de la base de données
psql -U postgres -c "CREATE DATABASE entreprises_db;"

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  SUCCÈS !"
    echo "========================================"
    echo ""
    echo "La base de données 'entreprises_db' a été créée avec succès."
    echo ""
    echo "Prochaines étapes :"
    echo "  1. python manage.py makemigrations"
    echo "  2. python manage.py migrate"
    echo "  3. python manage.py createsuperuser"
    echo "  4. python manage.py runserver"
    echo ""
else
    echo ""
    echo "========================================"
    echo "  ERREUR"
    echo "========================================"
    echo ""
    echo "La création de la base de données a échoué."
    echo ""
    echo "Vérifiez que :"
    echo "  - PostgreSQL est installé"
    echo "  - Le service PostgreSQL est démarré"
    echo "  - Le mot de passe est correct"
    echo ""
fi
