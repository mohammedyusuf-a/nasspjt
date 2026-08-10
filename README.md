# 🛍️ ShopEZ — Modern E-Commerce Application

ShopEZ is a full-stack, feature-rich E-Commerce application built with React, Vite, Node.js, Express, and MongoDB. It provides a seamless shopping experience for customers and a complete management dashboard for administrators.

---

## 📌 Quick Links & External Resources

- **Project Live Web App**: [https://nasspjt-phi.vercel.app](https://nasspjt-phi.vercel.app)
- **Render Backend API**: [https://nasspjt.onrender.com](https://nasspjt.onrender.com)
- **GitHub Repository**: [https://github.com/mohammedyusuf-a/nasspjt.git](https://github.com/mohammedyusuf-a/nasspjt.git)
- **Live Demo Video**: [Watch Live Demo Video](https://drive.google.com/file/d/13OUhv1gR-wZfKkX_zTph98jiAlkmNyyk/view?usp=drivesdk)
- **Google Drive Folder**: [Nasspjt Project Assets & Resources](https://drive.google.com/drive/folders/1sjHcYt7nIm9UugCOmuFimCBf4O8f8bJu)

---

## ✨ Features

- 🛒 **Interactive Product Catalog**: Real-time searching, category filtering, and product details.
- 🛍️ **Cart Management**: Guest cart storage (localStorage) + persistent DB cart sync upon user login.
- 🔐 **Authentication & Security**: Secure JWT authentication, password hashing (`bcryptjs`), and protected API routes.
- 💳 **Seamless Checkout**: Multiple payment methods (COD, Card, UPI, NetBanking) with real-time totals and address management.
- 👑 **Admin Management Suite**:
  - Full Product CRUD (Add, Edit, Delete, Stock update)
  - Order Tracking & Status updates (Processing, Confirmed, Shipped, Delivered, Cancelled)
  - User Management & Admin Revenue Analytics Dashboard
- 🎨 **Responsive UI/UX**: Dark mode theme, glassmorphism design, CSS micro-animations, and mobile-friendly layout.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Axios, Vanilla CSS |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), Cors |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 👥 Roles & Permissions

- 👤 **Customer**:
  - Browse catalog, search & filter products
  - Manage shopping cart & place orders
  - View personal order history & profile
- 👑 **Administrator**:
  - Access `/admin` dashboard
  - Manage product catalog (Add / Edit / Delete)
  - Manage customer orders & update fulfillment status
  - View system analytics (Revenue, User count, Pending/Delivered orders)

---

## 🚀 Quick Start & Setup

Full step-by-step setup instructions are available in [docs/INSTALLATION.md](docs/INSTALLATION.md).

### Quick Local Start:

1. **Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 📁 Project Structure

For full architectural documentation, refer to [docs/STRUCTURE.md](docs/STRUCTURE.md).

```
nasspjt/
├── client/          # Vite + React Frontend Application
├── server/          # Express.js REST API Server
└── docs/            # Comprehensive Project Documentation
```

---

## 📖 Documentation

- 📄 [docs/INSTALLATION.md](docs/INSTALLATION.md) — Local installation & setup guide.
- 📄 [docs/STRUCTURE.md](docs/STRUCTURE.md) — Detailed folder & file structure docs.
- 📄 [docs/API.md](docs/API.md) — Complete REST API reference.
- 📄 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Step-by-step production deployment guide.
- 📁 **External Assets**: [Google Drive Folder (Nasspjt)](https://drive.google.com/drive/folders/1sjHcYt7nIm9UugCOmuFimCBf4O8f8bJu)

---

## 🌐 Deployment Overview

- **Backend**: Deployed on **Render** (`https://nasspjt.onrender.com`)
- **Frontend**: Deployed on **Vercel** (`https://nasspjt-phi.vercel.app`)
- **Database**: Cloud **MongoDB Atlas**

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute as needed.
