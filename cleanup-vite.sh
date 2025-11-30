#!/bin/bash
# Cleanup script för att ta bort Vite-filer efter Figma Make export

echo "🧹 Rensar bort Vite-filer..."

# Ta bort Vite-filer
rm -f index.html
rm -f main.tsx
rm -f vite.config.ts
rm -rf src/

echo "✅ Klart! Vite-filer borttagna."
echo "📦 Nästa steg: git add . && git commit -m 'Update from Figma Make' && git push"
