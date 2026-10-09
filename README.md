# NeuSquad prototype

Clickable concept prototype for the Tata Neu student-engagement case. React 18, no backend.

## Run locally
```
npm install
npm run dev
```
Open the local URL Vite prints.

## What is inside
- `src/App.jsx`: page layout, "Play the week" controller, live "Under the hood" panel
- `src/Phone.jsx`: phone frame, tab bar, push banners, toasts, bottom sheets
- `src/Screens.jsx`: Neu home, invite, split, quest, goal jar, scorecard, lock screen, sheets
- `src/store.js`: state, reducer, balance ledger
- `src/demo.js`: the scripted Monday to Sunday beats, generated from each persona
- `src/personas.js`: the two personas (Rohan Verma, NIT Hamirpur; Ananya Iyer, SRCC Delhi), their squads, expenses, quests, jars and week scripts
- `src/Portrait.jsx`: illustrated SVG portraits (swap in photos by adding a `photo` field if you like)
- `build/build.mjs`: makes one self-contained HTML page (`npm run build:single`)

Concept prototype for a case competition. Not affiliated with Tata Digital. No real payments.
