# 🛰️ SKYCAST - Atmospheric Intelligence Dashboard

**SKYCAST** is a high-performance, professional-grade weather intelligence platform built with **Next.js 15**. Featuring a modern Bento Grid interface, it delivers real-time atmospheric telemetry while maintaining a strict zero-server privacy policy.

![Build Version](https://img.shields.io/badge/Build-v1.0.0--Pro-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Core Features

- **Bento Intelligence UI:** Modular dashboard design optimized for rapid data consumption.
- **Smart Auto-Location Sync:** Instant geographic telemetry using browser GPS with coordinate rounding logic.
- **Privacy Core Architecture:** Zero-Server data policy. Your coordinates and profile remain siloed locally.
- **AQI Monitoring:** Real-time Air Quality Index tracking with visual health indicators.
- **Premium UX:** High-end visual feedback, active button scaling, and satellite sync spinners.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Glassmorphism)
- **Icons:** Lucide React
- **Data Fetching:** OpenWeatherMap API 2.5
- **Charts:** Recharts

---

## Step-by-Step Installation Guide

Follow these steps to get the project running on your local machine:

### 1. Clone the repository
First, download the source code to your system:
```bash
git clone https://github.com/engraliahmed/sky-cast-project.git
```

### 2. Install Dependencies

Navigate into the project folder and install all required packages:

```bash
cd skycast
npm install
```

### 3. Configure Environment Variables
Create a file named .env.local in the root directory and paste your OpenWeatherMap API key:

```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key_here
```

### 4. Launch Development Server
Start the local server to see the project in action:

```bash
npm run dev
Now open http://localhost:3000 in your browser.
```

🛡️ Security Architecture
SKYCAST utilizes AES-256 Local Persistence logic. All geographic telemetry and profile configurations are restricted to local node storage (LocalStorage) and are never transmitted to external cloud databases.

📈 Roadmap (Future Iterations)
[ ] v1.1.0: Interactive Satellite Radar Maps.

[ ] v1.2.0: 7-Day Extended Atmospheric Outlook.

[ ] v1.3.0: Multiple City Telemetry Comparison Module.

## Developed by Ali Ahmed | Build v1.0.0