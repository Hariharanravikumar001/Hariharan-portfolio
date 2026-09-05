@echo off
title Hariharan Portfolio Runner
echo ========================================================
echo Starting Hariharan Ravikumar Portfolio Platform...
echo ========================================================

echo [1/2] Starting Backend Server (Port 5000)...
start "Portfolio Backend Server" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 2 >nul

echo [2/2] Starting Frontend Vite Server (Port 5173)...
start "Portfolio Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo ========================================================
echo System is now running!
echo Public Portfolio: http://localhost:5173
echo Admin Console:    http://localhost:5173/admin
echo Admin Login:      admin / Admin@12345
echo ========================================================
