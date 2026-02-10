# 🌌 3D Space Portfolio

A high-performance, immersive 3D portfolio built with **React**, **Three.js**, and **Vite**. Features a fully interactive solar system, "Lite Glass" orbital aesthetics, and a deep space scroll experience.

## ✨ Features

*   **Immersive 3D Space**: Interactive solar system with orbit controls and parallax stars.
*   **"Lite Glass" Aesthetics**: Premium glassmorphism optimized for mobile devices.
*   **Scroll-Driven Navigation**: Seamless transition from "Home" to "Deep Space" content.
*   **Mobile Optimized**: Custom hooks reduce rendering load (fewer stars, simplified materials) on mobile.
*   **Visitor Logging**: Passive visitor logging to Discord (IP, Device, Location).
*   **Connect System**: Interactive "Guestbook" for visitors to leave their mark.

## 🛠️ Tech Stack

*   **Core**: [React 18](https://react.dev/), [Vite](https://vitejs.dev/)
*   **3D Engine**: [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
*   **Animations**: [GSAP](https://gsap.com/), [Framer Motion](https://www.framer.com/motion/)
*   **Styling**: Tailwind CSS (Utility), Vanilla CSS (Glass effects)

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Sagararora90/portfolio.git
    cd portfolio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    VITE_DISCORD_WEBHOOK="your_discord_webhook_url_here"
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📱 Mobile Optimizations

The app automatically detects mobile devices and applies `Lite Mode`:
*   **Reduced Particle Count**: 40 stars (vs 120 on desktop).
*   **Simplified Materials**: No heavy `backdrop-filter` or refraction calculations.
*   **Tuned Scroll**: Adjusted scroll sensitivity (0.55) and distance (800px) for touch screens.

## 📡 Visitor Logging

The app includes a privacy-friendly logger (`VisitorLogger.jsx`) that sends anonymous data to your Discord:
*   **Data**: City, Country, ISP, Device Type, OS, Browser, Screen Resolution.
*   **Privacy**: Does not track across sites or store cookies.

---

Built with ❤️ by **Sagar**.
