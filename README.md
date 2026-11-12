# RailOne – Railway Booking App (Functional Demo)

A modern, responsive, mobile-first railway booking application clone inspired by the **RailOne** mobile app for Indian Railways. Built with React 19, TypeScript, Express, Vite, and Tailwind CSS.

---

## 🌟 Key Features

### 1. Home Dashboard
- **Header**: Multi-language switch (`A/अ`), personalized user greeting (`Hi, Pravinkumar s Asaithambi!`), RailOne branding, and notification bell badge.
- **Journey Planner**: 3 prominent picture cards:
  - **Reserved**: Long-distance train booking powered by IRCTC preferences.
  - **Unreserved**: Suburban / local UTS E-Ticket generation.
  - **Platform**: Quick platform pass booking.
- **More Offerings**:
  - `Search Trains`
  - `PNR Status` (10-digit live status check)
  - `Coach Position` (Interactive coach composition viewer)
  - `Track Your Train` (Live running status tracker)
  - `Order Food` (e-Catering)
  - `File Refund` (TDR portal)
  - `Rail Madad` (Interactive grievance registration with video/audio/photo uploads)
  - `Go To WAVES`
- **Upcoming Journey Widget**: Persistent gradient card showing the next active journey with instant "Book Again" and "View Details" actions.
- **Large Shipment**: Freight and parcel logistics with "Plan Shipment", "Track Shipment", and "Freight Calculator".
- **Did You Know Carousel**: Informative Indian Railways trivia cards.

### 2. Fully Editable Station Search & Selector
- Search by **Station Name** or **Station Code** (e.g. MAS, MSB, TBM, GI, GDY, VM, MDU, CBE, SBC).
- **Recent Station Searches** with quick selection chips.
- Instant **Swap Stations** button (`⇅`).
- Automatic distance calculation and fare computation based on official railway slabs.
- Validation preventing selection of identical source and destination.

### 3. Dynamic Ticket Preview with 05:00 Countdown Timer
- **Live 5-Minute Countdown**: Starts automatically at `05:00` and ticks down every second (`04:59`, `04:58`...) using React `useEffect` and `setInterval`.
- **Interval Cleanup**: Properly cleans up timers on unmount to prevent memory leaks.
- **Automatic Expiry**: When reaching `00:00`, displays an animated **Preview Expired** state with a **Refresh Demo Preview** button to restart the countdown.
- **Official Layout**:
  - Vertical `INDIAN RAILWAYS` and `भारतीय रेल` side ribbons.
  - Digital clock display, booking date & time, reference code (`R21704`), and non-transferable badge.
  - High-density authentic QR Code simulation with `DEMO` badge and scan line indicator.
  - Red non-refundable warning banner.
  - Statutory disclaimers and helpline (`139`).
  - Print ticket and Download ticket functionality.
  - Diagonal **DEMO TICKET** watermark.

### 4. My Bookings
- Tabbed filtering: **Upcoming**, **Completed**, **Cancelled**, and **All**.
- Pre-populated with historical demo tickets matching the recorded videos.
- Quick actions: **View Details** (opens full interactive ticket preview) and **Book Again**.
- Demo booking deletion/cancellation for testing state changes.

### 5. User Profile ("You" Tab) & Side Drawer
- Profile card with verified badge and completion progress.
- **R-Wallet**: Live balance, sync, and interactive "Add Money" sheet with quick presets (`+₹500`, `+₹1000`, `+₹1500`, `+₹2000`).
- Biometric toggle (ON/OFF), change password, linked Aadhar status, and recent transaction history.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript (Strict Mode), Vite 8, Tailwind CSS v4, Lucide React icons, Motion
- **Backend**: Node.js, Express, TypeScript (`tsx`)
- **Persistence**: LocalStorage with automatic fallback and synchronization with Express backend REST endpoints
- **Version Control**: Git

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### Installation

1. Clone or extract the repository:
```bash
git clone <repository-url>
cd railone-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```
The server starts on `http://localhost:3000` with the Express API and Vite frontend running simultaneously.

4. Build for production:
```bash
npm run build
```

5. Run in production:
```bash
npm start
```

---

## 📡 Backend API Endpoints

The Express server (`server.ts`) exposes the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stations` | List stations with optional `?q=` search query |
| `GET` | `/api/trains` | List available trains with `?from=` and `?to=` filters |
| `GET` | `/api/bookings` | Retrieve all bookings |
| `GET` | `/api/bookings/:id` | Get single booking by UTS or ID |
| `POST` | `/api/bookings` | Create a new booking |
| `PUT` | `/api/bookings/:id` | Update an existing booking |
| `DELETE` | `/api/bookings/:id` | Delete a booking |
| `GET` | `/api/health` | Service health status check |

---

## 📱 Mobile-First Responsive Design

RailOne is engineered mobile-first with clean white backgrounds, Indian Railways Royal Blue primary accents, rounded card structures, and a persistent bottom navigation bar matching the official RailOne mobile application.
