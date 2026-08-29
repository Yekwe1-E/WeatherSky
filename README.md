# 🌤️ WeatherSky - Live Weather & Forecast Web App

WeatherSky is a modern, responsive web application offering real-time weather reports, hourly 24-hour forecast breakdown timelines, live dynamic sun/rain visual canvas scenery, and cloud database integration powered by **Supabase**.

---

## ✨ Key Features

- **Live Weather Data**: Real-time current temperature, weather conditions, humidity, wind speed, pressure, and visibility via OpenWeatherMap API.
- **Hourly Breakdown Timeline**: 24-hour visual weather forecast breakdown with rain probability percentages (`%`).
- **Dynamic Visual Scenery**: Canvas animation engine rendering sun beams, falling rain drops, swirling snowflakes, and lightning flashes.
- **Cloud Database (Supabase)**: User registration, secure login, and live favorite location storage powered by Supabase.
- **Responsive Glassmorphism UI**: Modern aesthetic with dynamic daylight/night time backgrounds and dark mode toggle.

---

## 🚀 Quick Start (Local Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your API keys in `.env`:
- `OPENWEATHER_API_KEY`: OpenWeatherMap API Key
- `SUPABASE_URL`: Supabase Project URL
- `SUPABASE_KEY`: Supabase Anon Public Key

### 3. Setup Supabase Database
Run the SQL DDL statements located in `database/supabase_schema.sql` inside your **Supabase Dashboard SQL Editor**.

### 4. Start the Application
```bash
npm start
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🌐 Deploying to Production (Render / Railway / Vercel)

1. Push your repository to GitHub.
2. Connect your repository to **Render** or **Railway**.
3. Set the build command to `npm install` and start command to `npm start`.
4. Add your Environment Variables (`OPENWEATHER_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `SESSION_SECRET`) in your hosting provider's dashboard settings.
