@echo off
echo ========================================
echo   Akuntasi Mitra - Development Server
echo ========================================
echo.

REM Set DATABASE_URL
set DATABASE_URL=postgresql://postgres:admin@localhost:5432/db_akuntansi

echo [INFO] Starting development servers...
echo [INFO] Server will run on: http://localhost:3001
echo [INFO] Client will run on: http://localhost:3000
echo.

REM Run development
npm run dev

pause
