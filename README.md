# 💸 Expense Tracker App

This is a simple yet powerful **Expense Tracking** app built using **React Native with Expo Router**, supporting web deployment via **Vercel**.

## 🌐 Live Demo

👉 [Click here to view the deployed app](https://clientfrontend-dsczl2n5r-soumya-rouls-projects.vercel.app)

---

## 📦 Tech Stack

- **React Native (Expo)**
- **Expo Router** – for file-based routing
- **Redux Toolkit** – for state management
- **MongoDB (with Mongoose)** – for backend data persistence
- **Node.js + Express** – for backend API
- **Vercel** – for frontend web deployment
- **React Native Chart Kit** – for pie chart visualizations

---

## ✨ Features

- 📝 Add, Edit, and Delete Expenses
- 💰 Set a Monthly Budget
- 📊 Visualize Spending with Pie Chart
- 🧠 Category-based tracking
- ⚠️ Alerts when expenses exceed budget
- 🔐 Auth middleware (backend) for user-specific data

---

## 🚀 Deployment Instructions

### ✅ Pre-requisites

- Node.js installed
- Expo CLI (`npm install -g expo-cli`)
- Vercel CLI (`npm install -g vercel`)

### 🛠️ Build for Web

Update your `package.json` to include the following:

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint",
  "build": "expo export --platform web"
}

