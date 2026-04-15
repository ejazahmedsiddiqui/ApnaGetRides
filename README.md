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


| User App                     |
| ---------------------------- |
| <img width="1080" height="2400" alt="Home Page - AGR" src="https://github.com/user-attachments/assets/4b3bbdce-bcd6-4a0b-a244-676fb616a33c" /> |
| <img width="1080" height="2400" alt="Profile Sceurity" src="https://github.com/user-attachments/assets/8b843d78-69e5-45d5-ad32-efd78aee9340" /> |
| <img width="1080" height="2400" alt="Profile Details" src="https://github.com/user-attachments/assets/391eeaf7-0131-4154-8d7a-dee234238909" /> |
| <img width="1080" height="2400" alt="Profile Edit" src="https://github.com/user-attachments/assets/770325c2-c4fc-467a-86a2-584b23f8f86a" /> |
| <img width="1080" height="2400" alt="Map" src="https://github.com/user-attachments/assets/22fb003e-287f-419f-ac1d-501dc004be34" /> |
| <img width="1080" height="2400" alt="Home Page 2" src="https://github.com/user-attachments/assets/9c2a89b5-d213-4777-856a-6f59dff12f5c" /> |

---

## 🎥 Demo

> [short demo video (240 sec)](https://www.youtube.com/shorts/57do9x6II84)

```
https://www.youtube.com/shorts/57do9x6II84
```

---

## 📦 Project Structure

```
src/
 ├── components/
 ├── app/
 ├── api/        # API & WebSocket logic
 ├── store/           # Zustand state
 ├── hooks/
 ├── utils/
 └── context/
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
🔗 [LinkedIn](https://www.linkedin.com/in/ejaz-ahmed-siddiqui-333514221/) | [GitHub](https://github.com/ejazahmedsiddiqui/)

---
