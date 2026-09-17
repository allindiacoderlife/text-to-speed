# Voxera - Neural Text-to-Speech Studio

A full-stack AI Text-to-Speech web application built with **React (Vite)** and **Node.js/Express** powered by **100% free open-source neural TTS (`msedge-tts`)** with zero API keys, subscriptions, or credit card requirements.

---

## 🚀 Deploy to Vercel (Frontend + Backend in One Click)

This repository is pre-configured with `vercel.json` and a root `api/index.js` serverless function to deploy both the React client and Express API to a single Vercel project with zero manual configuration.

### Option 1: Deploy via GitHub (Recommended)
1. Push this project to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Voxera Text-to-Speech Studio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com/) and click **Add New... > Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
   - **API Routes**: Automatically handled by `api/index.js` via `vercel.json`
5. Click **Deploy**. Your app and serverless API will be live instantly!

---

### Option 2: Deploy via Vercel CLI
From the root directory:
```bash
npx vercel
```
Follow the prompts (accept default settings), and your deployment will be live in seconds.

For production deployment:
```bash
npx vercel --prod
```

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Run Both Frontend & Backend Simultaneously
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 📁 Project Architecture

```
text-to-speed/
├── api/
│   └── index.js             # Vercel Serverless Function entrypoint
├── client/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Studio components
│   │   ├── services/api.js  # API client
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── server/                  # Node.js + Express Backend
│   ├── controllers/         # TTS controller (in-memory buffering + file generation)
│   ├── routes/              # Express API routes
│   ├── utils/               # Audio cleanup helper
│   ├── server.js            # Express server
│   └── package.json
├── package.json             # Root orchestration & Vercel deployment dependencies
└── vercel.json              # Vercel configuration & API routing
```
