# 🏆 2026 FIFA World Cup Knockout Stage Tracker

An interactive React dashboard for tracking the 2026 FIFA World Cup group stage results, 3rd place standings, and knockout round qualification — with live scenario simulation powered by betting odds.

Built during the 2026 World Cup group stage (June 25, 2026).

---

## Features

- **All 48 Teams View** — Every team across all 12 groups with live status: Confirmed Through, Likely Through, On the Bubble, Likely Out, or Confirmed Eliminated. Filterable by status category.
- **3rd Place Race Simulator** — Interactive W/D/L scenario picker for all 12 third-place teams. Rankings update in real time based on projected points and goal difference.
- **Betting Odds Integration** — Win/draw/loss probabilities derived from bet365 matchday 3 odds shown per match. Defaults set to most likely outcome.
- **Scotland Tracker** — Persistent status pill tracking Scotland's rank and knockout chances throughout.
- **Light Theme UI** — Clean, readable white/slate design. 75% width centered layout.

---

## Tech Stack

- React (functional components + hooks)
- No external dependencies — pure inline styles
- Data hardcoded from live match results and bet365 odds

---

## File

| File | Description |
|------|-------------|
| `third-place-tracker.jsx` | Main React component — all data, logic, and UI in one file |

---

## Data Sources

- Match results: FIFA.com, Yahoo Sports, CBS Sports
- Betting odds: bet365 (matchday 3, June 25 2026)
- 3rd place qualification rules: FIFA official regulations

---

## How to Run

```bash
# If using a React sandbox (e.g. CodeSandbox, StackBlitz)
# Just paste third-place-tracker.jsx as App.jsx and run

# If using Vite locally
npm create vite@latest wc-tracker -- --template react
cd wc-tracker
# Replace src/App.jsx with third-place-tracker.jsx content
npm install
npm run dev
```

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md)

---

## Notes

- GD changes per scenario are estimated (W ≈ +1, D = 0, L ≈ –2) since exact scorelines are unknown
- Data last updated: **June 25, 2026** after Groups A, B, C completed
- Ecuador vs Germany and Curaçao vs Ivory Coast results pending at time of last update
