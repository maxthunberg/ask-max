# 🚀 Deployment Guide för Ask Max (Light)

## Problem
Figma Make exporterar UI-komponenter med versionerade imports (t.ex. `@radix-ui/react-accordion@1.2.3`) som **inte fungerar** i vanlig Next.js/Vercel.

## ✅ Lösning: Automatisk Fix

Efter varje nedladdning från Figma Make:

### **Steg 1: Ladda ner och kopiera**
1. Ladda ner projektet från Figma Make
2. Kopiera **allt** till ditt lokala repo

### **Steg 2: Ta bort Vite-filer** (manuellt)
Radera dessa:
- ❌ `index.html`
- ❌ `main.tsx`
- ❌ `vite.config.ts`
- ❌ `/src/` (hela mappen)

### **Steg 3: Fixa imports**

#### **Windows:**
Dubbelklicka på: `fix-imports.bat`

#### **Mac/Linux:**
```bash
chmod +x fix-imports.sh
./fix-imports.sh
```

#### **Eller via npm:**
```bash
npm run fix-imports
```

### **Steg 4: Commit & Push**
```bash
git add .
git commit -m "Update from Figma Make with fixed imports"
git push
```

---

## 🎯 Vad scriptet gör

Går igenom alla filer i `/components/ui/` och tar bort versioner från imports:

**Innan:**
```typescript
import * as AccordionPrimitive from "@radix-ui/react-accordion@1.2.3";
import { ChevronDownIcon } from "lucide-react@0.487.0";
```

**Efter:**
```typescript
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
```

---

## 📋 Snabb checklista

Efter varje Figma Make-export:

```
☐ Ladda ner från Figma Make
☐ Kopiera till repo
☐ Ta bort: index.html, main.tsx, vite.config.ts, src/
☐ Kör: fix-imports.bat (Windows) eller fix-imports.sh (Mac/Linux)
☐ Commit & Push
☐ ✅ Vercel bygger automatiskt!
```

---

## 🆘 Om något går fel

1. **Kolla Vercel-loggen** - Den visar exakt vilka paket som saknas
2. **Kolla package.json** - Alla Radix UI och andra paket ska finnas där
3. **Kör scriptet igen** - `npm run fix-imports`
4. **Kontakta support** - Om problemet kvarstår

---

**Lycka till! 🎉**
