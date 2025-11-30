# 🚀 Deployment Instruktioner - Ask Max (Light)

## ✅ Projektet är nu redo för Vercel deployment!

---

## 📋 Steg 1: Ladda ner projektet lokalt

1. **Ladda ner** alla filer från Figma Make
2. Spara dem i en mapp på din dator (t.ex. `ask-max-light`)

---

## 🗑️ Steg 2: Ta bort Supabase-mappen (VIKTIGT!)

**Du måste manuellt ta bort `/supabase` mappen:**

1. Öppna projektmappen i **Finder**
2. Hitta mappen som heter **`supabase`**
3. Dra den till **Papperskorgen**
4. Töm papperskorgen

**Varför?** Supabase Edge Functions innehåller Deno-kod med JSR-imports som inte är kompatibel med npm/Vercel. Vi ska deploya Edge Functions separat till Supabase senare.

---

## 📤 Steg 3: Pusha till GitHub

### Alternativ A: GitHub Desktop (Enklast!)

1. Öppna **GitHub Desktop**
2. Klicka **File → Add Local Repository**
3. Välj din projektmapp
4. Klicka **Create Repository** (om det inte redan är ett repo)
5. Skriv commit message: `Initial commit - ready for Vercel`
6. Klicka **Commit to main**
7. Klicka **Publish repository** (eller **Push origin** om redan publicerad)

### Alternativ B: VS Code

1. Öppna projektet i **VS Code**
2. Klicka på **Source Control** ikonen (vänster sidebar)
3. Klicka **Initialize Repository** (om inte redan gjort)
4. Skriv commit message: `Initial commit - ready for Vercel`
5. Klicka **✓ Commit**
6. Klicka **Publish Branch** eller **Push**

---

## ⚙️ Steg 4: Konfigurera Vercel

1. Gå till [vercel.com/dashboard](https://vercel.com/dashboard)
2. Klicka på ditt **"ask-max"** projekt
3. Gå till **Settings → General**
4. Under **"Build & Development Settings"**:
   - Hitta **"Install Command"**
   - Klicka **Override** (toggle till **PÅ**)
   - Skriv: `npm install --legacy-peer-deps`
   - Klicka **Save**

---

## 🔄 Steg 5: Redeploy

1. Gå till **Deployments** tab
2. Klicka på den senaste deployment
3. Klicka på **⋯ (tre prickar)** → **"Redeploy"**
4. Välj **"Use existing Build Cache: NO"** ✅
5. Klicka **"Redeploy"**

---

## 🎉 Klart!

Din frontend ska nu deploya framgångsrikt till Vercel! 

Edge Functions finns kvar lokalt i din `/supabase` mapp och kan deploytas separat till Supabase med Supabase CLI när du är redo.

---

## 📝 Nästa steg (senare):

När du vill deploya Edge Functions till Supabase:
1. Installera Supabase CLI
2. Kör `supabase functions deploy` från projektmappen
3. Edge Functions deployar då separat till Supabase (inte via Vercel)
