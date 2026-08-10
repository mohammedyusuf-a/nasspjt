# Deployment Guide — Step by Step

This guide walks you through deploying the **ShopEZ** application to production using **Render** for the Express backend, **Vercel** for the React frontend, and **MongoDB Atlas** for the database.

---

## 🗄️ 1. Database Setup (MongoDB Atlas)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user (e.g., `yusuf_db`).
3. Allow network access from anywhere (`0.0.0.0/0`).
4. Copy your connection string (`MONGO_URI`).

---

## ⚙️ 2. Backend Deployment (Render)

1. Sign up / log in to [Render](https://render.com).
2. Click **New +** → **Web Service** → Connect your GitHub repo (`nasspjt`).
3. Set the configuration parameters:
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   ```env
   MONGO_URI=mongodb+srv://yusuf_db:yusuf123@yusuf.iwywemb.mongodb.net/?appName=yusuf
   JWT_SECRET=shopez_super_secret_jwt_key_2024
   NODE_ENV=production
   ```
5. Click **Create Web Service** and copy your backend URL (e.g. `https://nasspjt.onrender.com`).

---

## 💻 3. Frontend Deployment (Vercel)

1. Sign up / log in to [Vercel](https://vercel.com).
2. Click **Add New…** → **Project** → Import `nasspjt`.
3. Set the configuration parameters:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   ```env
   VITE_API_URL=https://nasspjt.onrender.com
   ```
5. Click **Deploy** and copy your frontend URL (e.g. `https://nasspjt-phi.vercel.app`).

---

## 🔗 4. Link Backend & Frontend (CORS)

1. Go back to Render → Backend Web Service → **Environment**.
2. Add/Update the `CLIENT_URL` environment variable:
   ```env
   CLIENT_URL=https://nasspjt-phi.vercel.app
   ```
3. Save changes to trigger a quick redeploy.
