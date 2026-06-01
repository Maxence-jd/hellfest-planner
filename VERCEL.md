# Déploiement sur Vercel

## Option simple avec GitHub

```powershell
git init
git add .
git commit -m "Initial Hellfest Planner V4"
```

Crée un repo GitHub, puis :

```powershell
git remote add origin https://github.com/TON_COMPTE/hellfest-planner-v4.git
git branch -M main
git push -u origin main
```

Ensuite :
1. Va sur Vercel
2. Add New Project
3. Choisis le repo
4. Laisse Vercel détecter Vite
5. Deploy

## Option Vercel CLI

```powershell
npm i -g vercel
vercel
```

Puis pour la prod :

```powershell
vercel --prod
```
