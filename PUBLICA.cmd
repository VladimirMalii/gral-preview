@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo === Publica drafturile pe GitHub Pages (o singura data) ===
echo Contul GitHub autentificat pe acest calculator:
gh auth status 2>&1 | findstr /C:"Logged in"
echo.
echo 1. Creez repo-ul public VladimirMalii/gral-preview si urc fisierele...
gh repo create VladimirMalii/gral-preview --public --source=. --push --description "Drafturi de prezentare pagini GRAL Medical / OncoFort (noindex)"
if errorlevel 1 (
  echo   Repo-ul exista deja sau a picat crearea; incerc doar sa urc.
  git remote get-url origin >nul 2>&1 || git remote add origin https://github.com/VladimirMalii/gral-preview.git
  git push -u origin main
)
echo.
echo 2. Activez GitHub Pages (ramura main, radacina)...
gh api -X POST repos/VladimirMalii/gral-preview/pages -f "source[branch]=main" -f "source[path]=/" >nul 2>&1 || gh api -X PUT repos/VladimirMalii/gral-preview/pages -f "source[branch]=main" -f "source[path]=/" >nul 2>&1
echo.
echo 3. Gata. In 1-3 minute paginile apar la:
echo    https://vladimirmalii.github.io/gral-preview/                (lista cu cele 3)
echo    https://vladimirmalii.github.io/gral-preview/hematologie/
echo    https://vladimirmalii.github.io/gral-preview/paliatie/
echo    https://vladimirmalii.github.io/gral-preview/colorectal/
echo.
echo    Daca dupa 3 minute dau 404: https://github.com/VladimirMalii/gral-preview/settings/pages
echo    -^> Source: Deploy from a branch, Branch: main, Folder: / (root), Save.
echo.
pause
