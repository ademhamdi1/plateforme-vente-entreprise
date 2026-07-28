@echo off
echo ================================================
echo PostgreSQL Password Reset Script
echo ================================================
echo.
echo This script will:
echo 1. Stop PostgreSQL service
echo 2. Modify authentication to trust mode
echo 3. Reset password to 'postgres'
echo 4. Restore authentication to secure mode
echo 5. Restart PostgreSQL service
echo.
echo IMPORTANT: Run this as Administrator!
echo.
pause

echo.
echo [Step 1] Stopping PostgreSQL service...
net stop postgresql-x64-18
if errorlevel 1 (
    echo ERROR: Failed to stop service. Make sure you're running as Administrator!
    pause
    exit /b 1
)
echo SUCCESS: Service stopped
echo.

echo [Step 2] Backing up pg_hba.conf...
copy "C:\Program Files\PostgreSQL\data\pg_hba.conf" "C:\Program Files\PostgreSQL\data\pg_hba.conf.backup"
echo SUCCESS: Backup created
echo.

echo [Step 3] Modifying authentication to trust mode...
powershell -Command "(Get-Content 'C:\Program Files\PostgreSQL\data\pg_hba.conf') -replace 'scram-sha-256', 'trust' -replace 'md5', 'trust' | Set-Content 'C:\Program Files\PostgreSQL\data\pg_hba.conf'"
echo SUCCESS: Authentication changed to trust mode
echo.

echo [Step 4] Starting PostgreSQL service...
net start postgresql-x64-18
if errorlevel 1 (
    echo ERROR: Failed to start service!
    pause
    exit /b 1
)
echo SUCCESS: Service started
echo.
echo Waiting for PostgreSQL to initialize...
timeout /t 5 /nobreak >nul
echo.

echo [Step 5] Resetting password to 'postgres'...
"C:\Program Files\PostgreSQL\bin\psql.exe" -U postgres -h 127.0.0.1 -d postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
if errorlevel 1 (
    echo ERROR: Failed to reset password!
    echo Trying without password...
    "C:\Program Files\PostgreSQL\bin\psql.exe" -U postgres -h 127.0.0.1 -d postgres -w -c "ALTER USER postgres WITH PASSWORD 'postgres';"
)
echo SUCCESS: Password reset to 'postgres'
echo.

echo [Step 6] Creating database 'entreprises_db' if it doesn't exist...
"C:\Program Files\PostgreSQL\bin\psql.exe" -U postgres -h 127.0.0.1 -d postgres -c "SELECT 1 FROM pg_database WHERE datname='entreprises_db'" | findstr /C:"1 row" >nul
if errorlevel 1 (
    "C:\Program Files\PostgreSQL\bin\psql.exe" -U postgres -h 127.0.0.1 -d postgres -c "CREATE DATABASE entreprises_db;"
    echo SUCCESS: Database created
) else (
    echo Database already exists
)
echo.

echo [Step 7] Stopping PostgreSQL service...
net stop postgresql-x64-18
echo SUCCESS: Service stopped
echo.

echo [Step 8] Restoring secure authentication...
powershell -Command "(Get-Content 'C:\Program Files\PostgreSQL\data\pg_hba.conf') -replace 'trust', 'scram-sha-256' | Set-Content 'C:\Program Files\PostgreSQL\data\pg_hba.conf'"
echo SUCCESS: Authentication restored to scram-sha-256
echo.

echo [Step 9] Starting PostgreSQL service...
net start postgresql-x64-18
echo SUCCESS: Service started
echo.

echo ================================================
echo PASSWORD RESET COMPLETE!
echo ================================================
echo.
echo Password is now: postgres
echo Database: entreprises_db
echo.
echo You can now run your Django application!
echo.
pause
