# Project Architecture & File Structure

This document outlines the detailed folder and file structure of the **ShopEZ** application.

```
nasspjt/
├── client/                     # React + Vite Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI Components (Navbar, Footer, ProductCard, etc.)
│   │   ├── context/            # Global React Contexts (AuthContext, CartContext)
│   │   ├── pages/              # Page View Components
│   │   │   ├── admin/          # Admin Dashboard, Products, Orders & Users management
│   │   │   ├── Cart.jsx        # Shopping Cart Page
│   │   │   ├── Checkout.jsx    # Checkout & Payment Page
│   │   │   ├── Landing.jsx     # Home / Landing Page
│   │   │   ├── Login.jsx       # Auth Login Page
│   │   │   ├── Register.jsx    # Auth Register Page
│   │   │   ├── Products.jsx    # Product Catalog with Search & Filters
│   │   │   ├── Profile.jsx     # User Profile & Order History Page
│   │   │   └── OrderSuccess.jsx# Order Confirmation Page
│   │   ├── utils/              # Utility Functions & Helper modules
│   │   ├── App.jsx             # Main Application Routes & Layout
│   │   ├── index.css           # Global Design System & Styling
│   │   └── main.jsx            # React App Entrypoint
│   ├── index.html              # HTML Shell
│   ├── package.json            # Client Dependencies & Scripts
│   ├── vercel.json             # Vercel SPA Routing Configuration
│   └── vite.config.js          # Vite Configuration & API Proxy settings
│
├── server/                     # Express + Node.js Backend API
│   ├── controllers/            # Controller Functions for API Logic
│   ├── data/                   # Initial Seeder Data
│   ├── middleware/             # Auth & RBAC Middleware
│   ├── models/                 # Mongoose Data Schemas (User, Product, Order, Cart)
│   ├── routes/                 # Express API Endpoint Routes
│   │   ├── auth.js             # User Registration & Login Routes
│   │   ├── cart.js             # Cart Management Routes
│   │   ├── orders.js           # Order Processing & Stats Routes
│   │   ├── products.js         # Product Catalog & Admin CRUD Routes
│   │   └── users.js            # User Management & Stats Routes
│   ├── index.js                # Server Entrypoint, DB Connection & Seeders
│   ├── package.json            # Server Dependencies & Scripts
│   └── vercel.json             # Vercel Serverless Function Configuration
│
├── docs/                       # Project Documentation
│   ├── API.md                  # REST API Documentation
│   ├── DEPLOYMENT.md           # Step-by-Step Deployment Guide
│   ├── INSTALLATION.md         # Local Setup & Installation Guide
│   └── STRUCTURE.md            # Project Architecture & Structure Overview
│
└── README.md                   # Main Project Readme & Overview
```
