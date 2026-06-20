# 📚 Study Session Visualizer

A beautiful React dashboard for tracking, analyzing, and improving your study sessions.

## ✨ Features

- **Dashboard** — Stat cards, stacked bar chart, pie chart, and trend line
- **Subject Stats** — Per-subject hours, productivity, and radar chart
- **Session History** — Timeline view with filtering, sorting, and expandable cards
- **Weekly Report** — Goal progress, insights, and personalized recommendations
- **Add Session Modal** — Log subject, duration, productivity %, date, time, and notes

## 🛠 Tech Stack

- React 18
- Recharts (BarChart, LineChart, PieChart, RadarChart)
- Lucide React (icons)
- date-fns (date utilities)

## 🚀 Getting Started Locally

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized `build/` folder ready to deploy.

## 🌐 Deployment

This project is deployment-ready for:
- **Vercel** — Import the GitHub repo, framework preset "Create React App", deploy.
- **Netlify** — Build command: `npm run build`, Publish directory: `build`.
- **GitHub Pages** — Add `"homepage"` field to `package.json` and use `gh-pages` package.

## 📁 Project Structure

```
src/
├── hooks/
│   └── useStudyData.js     # All state + derived calculations
├── components/
│   ├── Dashboard.js         # Main analytics view
│   ├── SubjectStats.js      # Subject breakdown
│   ├── SessionHistory.js    # Timeline + filter
│   ├── WeeklyReport.js      # Report + insights
│   ├── AddSessionModal.js   # Log new session
│   └── StatCard.js          # Reusable stat card
├── App.js                   # Layout + navigation
├── index.js
└── index.css                # Design tokens
```
