@echo off
REM Cleanup script för att ta bort Vite-filer efter Figma Make export

echo 🧹 Rensar bort Vite-filer...

REM Ta bort Vite-filer
if exist index.html del index.html
if exist main.tsx del main.tsx
if exist vite.config.ts del vite.config.ts
if exist src rmdir /s /q src

echo ✅ Klart! Vite-filer borttagna.
echo 📦 Nästa steg: git add . && git commit -m "Update from Figma Make" && git push
pause
