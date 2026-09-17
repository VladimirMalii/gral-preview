@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === Actualizeaza drafturile publicate (dupa ce Claude a regenerat fisierele din livrare/) ===
copy /y "D:\Gral Website\Gral-Hematologie\livrare\hematologie-gral-caloian.html" hematologie\index.html >nul
copy /y "D:\Gral Website\Paliatie\livrare\ingrijiri-paliative-gral.html" paliatie\index.html >nul
copy /y "D:\Gral Website\ONCOFORT\Pagina cancere\decizie\web\livrare\cancerul-colorectal-oncofort.html" colorectal\index.html >nul
python noindex.py
git add -A
git -c user.name="Gral Website" -c user.email="noreply@gralmedical.ro" commit -m "Actualizare drafturi %date% %time%"
git push
echo.
echo Gata: in 1-2 minute versiunea noua e pe https://vladimirmalii.github.io/gral-preview/
pause
