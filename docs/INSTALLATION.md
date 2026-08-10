# Installation & Setup Guide

This document provides step-by-step instructions to set up **ShopEZ** on your local environment.

---

## 📋 Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- A **MongoDB Atlas** account (or local MongoDB instance)

---

## 🛠️ Step 1: Clone the Repository

```bash
git clone https://github.com/mohammedyusuf-a/nasspjt.git
cd nasspjt
```

---

## ⚙️ Step 2: Backend Setup (`server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `server/.env` with the following variables:
   ```env
   PORT=8000
   MONGO_URI=mongodb+srv://yusuf_db:yusuf123@yusuf.iwywemb.mongodb.net/?appName=yusuf
   JWT_SECRET=shopez_super_secret_jwt_key_2024
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   > The server will start on `http://localhost:8000` and seed initial admin & product data automatically.

---

## 💻 Step 3: Frontend Setup (`client`)

1. Open a new terminal tab and navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `client/.env` (optional for local dev as Vite proxy handles API calls):
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   > Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Default Credentials

- **Admin Email**: `admin@gmail.com`
- **Admin Password**: `admin123`
