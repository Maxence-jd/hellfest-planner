# Hellfest Planner V8.1

Projet React/Vite/PWA mobile-first pour organiser le Hellfest 2026.

## Ce qui est inclus

- Architecture React + Vite + TypeScript
- PWA installable
- Service worker
- Données Hellfest 2026 intégrées : 184 événements
- Sauvegarde locale
- Agenda
- Mon Hellfest
- Priorités P1 → P5, avec P1 = immanquable
- Critères
- Commentaires
- Conflits intelligents
- Timeline temps réel
- Ligne “MAINTENANT”
- Auto-scroll vers maintenant
- Concert en cours
- Prochain concert
- Notifications 30 min / 10 min / début
- Export/import JSON + CSV

## Lancer en local

```powershell
cd hellfest-planner-v4
npm install
npm run dev
```

Puis ouvrir l’URL affichée, souvent :

```text
http://localhost:5173/
```

## Build production

```powershell
npm run build
npm run preview
```

## Installer sur téléphone

Une fois déployé en HTTPS :
- iPhone : Safari > Partager > Sur l’écran d’accueil
- Android : Chrome > Installer l’application

## Déploiement Vercel

1. Crée un compte sur Vercel
2. Crée un dépôt GitHub avec ce projet
3. Import project dans Vercel
4. Framework : Vite
5. Build command : `npm run build`
6. Output directory : `dist`



## V5 additions

- Onglet Carte
- Carte simplifiée des scènes
- Concert actuel + prochain concert sur la carte
- Trajet visuel entre scènes
- Temps de déplacement estimés
- Pauses intelligentes
- Météo Clisson via Open-Meteo
- Dashboard avancé : marche, changements de scène, pauses
- Assistant de conflits amélioré avec suggestions


## V6 additions

- Logo Hellfest officiel dans le header et l'accueil
- Footer : MAX DRT © 2026
- Assistant de journée amélioré
- Départ conseillé vers le prochain concert
- Recommandations météo
- Pauses intelligentes V2 : pause brute - marche = pause réelle
- Carte améliorée avec conseils météo
- Sans cloud
- Sans mode groupe


## V7 additions

- Suppression de l’onglet Carte
- Nouvel onglet Notes
- Filtres des notes par recherche, priorité, statut et critère
- Édition rapide des notes depuis la page Notes
- Timeline corrigée : colonnes par scène, plus de chevauchement entre concerts simultanés


## V8.1 minimal fix

Base : V7.

Changements uniquement :
- une seule étiquette horaire sur la ligne “Maintenant”
- plus de gros badges répétés dans chaque colonne
- la popup passe au-dessus de la ligne
- planning V7 conservé tel quel
