# 💸 Expense Tracker App

This is a simple yet powerful **Expense Tracking** app built using **React Native with Expo Router**, supporting web deployment via **Vercel**.

## 🌐 Live Demo

👉 [Click here to view the deployed app](https://clientfrontend-dsczl2n5r-soumya-rouls-projects.vercel.app)

---
#🔐 Demo Credentials
Use the following demo account to log in and explore the app:

📧 Email:    sam16@gmail.com  
🔑 Password: namehim213
---

# 📱 Expense Tracker App
A cross-platform React Native mobile application for tracking daily expenses with category-wise breakdown and monthly budgeting. Users can add, edit, and delete their expenses, visualize spending patterns using pie charts, and manage a personalized monthly budget.

# 🔧 Features
User Authentication (assumed via JWT)

CRUD Operations on expenses

Add new expenses with category, amount, and date

Edit and delete existing records

Monthly Budget Setting

Set a personal monthly spending limit

Visual warning if the budget is exceeded

Category-wise Pie Chart

Visualize expenses split across categories like Food, Travel, Rent, etc.

Uses react-native-chart-kit for mobile-friendly data visualization

Redux Toolkit Integration

Centralized state management with asynchronous thunks for API calls

Persistent Token-based API Requests

Uses AsyncStorage for storing auth tokens

Backend with Express & MongoDB

RESTful API endpoints for expense CRUD

JWT authentication middleware to protect routes

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

