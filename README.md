# Moodify — AI-Powered Sonic Platform & Creative Music Studio

![Moodify Platform Banner](https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80)

> **Moodify** is a production-grade, AI-driven music discovery platform and interactive sonic studio. It leverages Google Gemini AI to analyze natural language intent, generate curated playlists, calculate vector mood match percentages, and trigger Web Audio synth previews with WebGL 3D sound visualizers.

---

## 🌟 Key Features

- 🤖 **Natural Language AI Music Curator**: Prompt-driven music search powered by Google Gemini (`gemini-3.6-flash` / `gemini-2.0-flash`) with automatic offline vector recommendation fallback.
- 🎵 **AI Playlist Generator**: Generates custom playlists complete with creative titles, atmospheric descriptions, dominant mood context, and track selections.
- 🎹 **Interactive Web Audio Synthesizer**: Web Audio API oscillator synth engine providing live audio previews, base frequency presets, and detune parameters.
- 🔮 **WebGL & 3D Audio Visualizers**: Interactive soundscape visualizers (3D particle spheres, circular spectrums, and dynamic frequency bars) built with Three.js and Canvas2D.
- 🎨 **Sonic Editorial UI/UX Design System**:
  - Dark Studio Aesthetics (`#000000`, `#101010`, `#DEDBC8`, `#E1E0CC`)
  - Modern Google Fonts pairing (`Instrument Serif` for headlines, `Inter` for UI, `Almarai` for body text)
  - Glassmorphic panels, responsive hanging floating navbar, and 60FPS GPU-accelerated micro-interactions
  - 100% Vector Icon system using Lucide SVG icons (no raw emojis)
- 💾 **Local Storage Sync**: Persistent user state for favorites, custom playlists, recent search queries, spatial audio toggles, and discovery diversity preferences.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite 8 |
| **Artificial Intelligence** | `@google/genai` (Google Gemini API with dynamic candidate fallback) |
| **Styling & Design System** | Tailwind CSS v4 + Vanilla CSS Design Tokens + Dark Glassmorphism |
| **3D & Visual Effects** | Three.js (`@types/three`) + HTML5 Canvas2D |
| **State Management** | Zustand |
| **Routing & Navigation** | React Router DOM v7 |
| **Icons & Micro-UI** | Lucide React |

---

## 📂 Project Architecture

```text
Moodify/
├── public/                 # Static assets & SVG icons
├── Docs/                   # PRD, FRD, and Architecture documentation
├── src/
│   ├── assets/             # Images and branding assets
│   ├── components/
│   │   ├── ai/             # AI prompt input & thinking status components
│   │   ├── animation/      # Typography animations (WordsPullUp, AnimatedLetter)
│   │   ├── landing/        # Landing hero, features, and about sections
│   │   ├── layout/         # Hanging floating navbar & sticky bottom player bar
│   │   ├── music/          # Track cards, track grids, detail modals, vector icons
│   │   └── visualizer/     # Three.js 3D & Canvas2D audio visualizers
│   ├── data/               # Mock datasets (tracks, artists, moods, genres)
│   ├── pages/              # App routes (Home, Discover, Generator, Playlists, Library, Artists, Profile, Settings)
│   ├── services/           # Gemini AI service, Audio Synth engine, Local Recommendation matcher
│   ├── store/              # Zustand stores (Music, Playlist, User, AI)
│   ├── types/              # TypeScript definitions for tracks, recommendations, and preferences
│   ├── App.tsx             # Root layout & route configuration
│   ├── index.css           # Global design system tokens & utility classes
│   └── main.tsx            # Application entry point
├── .env.example            # Environment variables template
├── index.html              # Google Fonts & HTML root
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dnssneak/Moodify.git
   cd Moodify
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to create a local `.env` file:
   ```bash
   cp .env.example .env
   ```

   Open `.env` and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_google_ai_studio_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔑 Obtaining a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key** in your project dashboard.
3. Copy your API key (starting with `AIzaSy...` or `AQ.Ab...`).
4. Paste it into your local `.env` file under `VITE_GEMINI_API_KEY`.

> *Note: If no API key is provided, Moodify seamlessly switches to its built-in local vector similarity engine, ensuring 100% feature functionality out of the box.*

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
