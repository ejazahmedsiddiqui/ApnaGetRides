# 🚖 ApnaGetRides — Real-Time Ride Booking Platform

A production-grade **ride-hailing mobile application** inspired by Uber, built with a focus on **real-time systems, scalable architecture, and performance optimization**.

---

## 📌 Overview

ApnaGetRides is a full-featured ride-booking platform that enables users to request rides and drivers to accept and complete trips in real time.

The system is designed to handle:

* Live ride tracking
* Real-time driver-passenger synchronization
* Optimized state management for high performance

---

## 🚀 Key Features

### 👤 User App

* Request ride with pickup & drop location
* Real-time driver matching
* Live ride tracking on map
* Ride status updates (Searching → Accepted → Ongoing → Completed)
* Secure authentication (JWT-based)

### 🚗 Driver App

* Accept/reject ride requests
* Live navigation to pickup/drop using rnmapbox
* Real-time ride updates
* Availability toggle (online/offline)
* Pay one time for no commission rides
* KYC for both driver and Vehicle
---

## ⚙️ Tech Stack

### Mobile

* React Native (Expo)
* TypeScript
* [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
* [zustand](https://zustand.docs.pmnd.rs/)
* Socket.io
* [react-navigation](https://reactnavigation.org/)

### State & Data

* Zustand (lightweight global state)
* TanStack React Query (server state & caching)

### Real-Time

* WebSockets (live ride updates)

### Backend

* Nest.js
* REST APIs
* JWT Authentication
* Redis

### Maps & Location

* [rnmapbox](https://github.com/rnmapbox/maps)
* Google Maps API

---

## 🧠 Architecture Highlights

* **Modular Architecture** → separation of UI, services, and state
* **Optimized rendering** → selective Zustand subscriptions
* **Real-time sync** → WebSocket-driven updates across clients
* **Resilient data layer** → React Query caching + retries

---

## 🔄 Ride Lifecycle Flow

1. User requests ride
2. Nearby drivers receive request (WebSocket broadcast)
3. Driver accepts ride
4. Real-time updates sync across user & driver apps
5. Ride progresses (pickup → ongoing → completed)

---

## 📸 Screenshots


| User App                     | Driver App                       |
| ---------------------------- | -------------------------------- |
| ![user](./screens/user1.png) | ![driver](./screens/driver1.png) |
| ![map](./screens/map.png)    | ![ride](./screens/ride.png)      |

---

## 🎥 Demo

> Add a short demo video (30–60 sec)

```
https://your-demo-link.com
```

---

## 📦 Project Structure

```
src/
 ├── components/
 ├── screens/
 ├── services/        # API & WebSocket logic
 ├── store/           # Zustand state
 ├── hooks/
 ├── utils/
 └── navigation/
```

---

## ⚡ Performance Optimizations

* Reduced unnecessary re-renders using Zustand selective subscriptions
* Optimized API calls with React Query caching & deduplication
* Lazy loading and efficient state updates
* Smooth real-time updates with minimal UI blocking

---

## 🔐 Security

* JWT-based authentication
* Secure API communication
* Input validation and error handling

---

## 🛠️ Setup & Installation

```bash
# Clone repo
git clone https://github.com/your-username/apna-get-rides.git

# Install dependencies
npm install

# Start project
npx expo start
```

---

## 📈 Future Improvements

* Payment integration (Stripe/Razorpay)
* Ride history & analytics
* Surge pricing algorithm
* Push notifications (Firebase)
* Driver earnings dashboard

---

## 🤝 Contribution

Contributions, ideas, and feedback are welcome.

---

## ⭐ Why This Project Stands Out

* Real-world system design (not just UI)
* Real-time architecture using WebSockets
* Multi-role scalable system
* Production-level state management
* Performance-focused implementation

---

## 📬 Contact

If you’re a recruiter or hiring manager, feel free to reach out:

📧 [eahmed.official.2001@gmail.com](mailto:eahmed.official.2001@gmail.com)
🔗 LinkedIn | GitHub

---
