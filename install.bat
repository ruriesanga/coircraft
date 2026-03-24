@echo off
echo =============================================
echo    CoirCraft PH - Auto Installer (Windows)
echo    Group 7
echo =============================================
echo.

echo [1/4] Installing Laravel backend...
cd backend
call composer install --no-interaction --prefer-dist
copy .env.example .env 2>nul
php artisan key:generate
cd ..
echo Backend done.

echo [2/4] Installing Node service...
cd node-service
call npm install
copy .env.example .env 2>nul
cd ..

echo [3/4] Installing Buyer frontend...
cd frontend-buyer
call npm install
copy .env.example .env 2>nul
cd ..

echo [4/4] Installing Seller frontend...
cd frontend-seller
call npm install
copy .env.example .env 2>nul
cd ..

echo.
echo =============================================
echo    Installation complete!
echo =============================================
echo.
echo Next steps:
echo 1. Create MySQL DB:  CREATE DATABASE coircraft;
echo 2. Edit backend\.env with your DB credentials
echo 3. Run: cd backend ^&^& php artisan migrate --seed
echo 4. Start each service in a new terminal window.
