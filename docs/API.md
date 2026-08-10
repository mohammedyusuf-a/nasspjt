# ShopEZ REST API Documentation

Base API Endpoint (Production): `https://nasspjt.onrender.com/api`  
Base API Endpoint (Local): `http://localhost:8000/api`

---

## 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch current authenticated user info | Yes |

---

## 📦 Product Endpoints (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Get all products (supports `?search=` and `?category=`) | No |
| `GET` | `/api/products/categories` | Get list of all product categories | No |
| `GET` | `/api/products/:id` | Get details of a single product | No |
| `POST` | `/api/products` | Create a new product | Yes (Admin) |
| `PUT` | `/api/products/:id` | Update an existing product | Yes (Admin) |
| `DELETE` | `/api/products/:id` | Delete a product | Yes (Admin) |

---

## 🛒 Cart Endpoints (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/cart` | Get current user's cart | Yes |
| `POST` | `/api/cart` | Add product to cart | Yes |
| `PUT` | `/api/cart/:itemId` | Update quantity of an item in cart | Yes |
| `DELETE` | `/api/cart/:itemId` | Remove item from cart | Yes |
| `DELETE` | `/api/cart/clear` | Clear all items from cart | Yes |

---

## 💳 Order Endpoints (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/orders` | Create/place a new order | Yes |
| `GET` | `/api/orders/my-orders` | Get orders for logged-in user | Yes |
| `GET` | `/api/orders` | Get all orders | Yes (Admin) |
| `GET` | `/api/orders/stats` | Get sales & order analytics | Yes (Admin) |
| `PUT` | `/api/orders/:id/status` | Update order status | Yes (Admin) |

---

## 👥 User Management Endpoints (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users` | Get all registered users | Yes (Admin) |
| `GET` | `/api/users/stats` | Get user growth stats | Yes (Admin) |
| `DELETE` | `/api/users/:id` | Delete user account | Yes (Admin) |
