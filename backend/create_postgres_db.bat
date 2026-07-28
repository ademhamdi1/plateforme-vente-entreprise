@echo off
REM Script pour créer la base de données PostgreSQL pour le projet

echo ========================================
echo   CREATION DE LA BASE DE DONNEES
echo ========================================
echo.

echo Creation de la base de donnees 'entreprises_db'...
echo.

REM Demande le mot de passe de l'utilisateur postgres
psql -U postgres -c "CREATE DATABASE entreprises_db;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCES !
    echo ========================================
    echo.
    echo La base de donnees 'entreprises_db' a ete creee avec succes.
    echo.
    echo Prochaines etapes :
    echo   1. python manage.py makemigrations
    echo   2. python manage.py migrate
    echo   3. python manage.py createsuperuser
    echo   4. python manage.py runserver
    echo.
) else (
    echo.
    echo ========================================
    echo   ERREUR
    echo ========================================
    echo.
    echo La creation de la base de donnees a echoue.
    echo.
    echo Verifiez que :
    echo   - PostgreSQL est installe
    echo   - Le service PostgreSQL est demarre
    echo   - Le mot de passe est correct
    echo.
)

pause
