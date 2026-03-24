# 🥥 CoirCraft PH — E-Commerce Website

> **Educational Project** — For educational purposes only, and no copyright infringement is intended.
> Built by **Powerpuff Gurls**

---

## 📦 Project Structure

```
coircraft/
├── backend/          # Laravel 11 REST API
├── frontend-buyer/   # React 19 (Buyer side)
├── frontend-seller/  # React 19 (Seller dashboard)
└── node-service/     # Node.js realtime + payment bridge
```

---

## ✅ System Requirements

| Tool        | Version     |
|-------------|-------------|
| PHP         | 8.2+        |
| Composer    | 2.x         |
| Node.js     | 18+         |
| npm         | 9+          |
| MySQL       | 8.0+        |
| Laravel     | 11.x        |

---

## 🚀 Quick Start

### Step 1 — Clone / Extract

```bash
unzip coircraft.zip
cd coircraft
```

---

### Step 2 — Backend (Laravel)

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Edit .env — set your DB credentials:
#   DB_DATABASE=coircraft
#   DB_USERNAME=root
#   DB_PASSWORD=yourpassword

# Create the database (in MySQL shell):
#   CREATE DATABASE coircraft CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Run migrations + seed sample data
php artisan migrate --seed

# Create storage symlink (for product images)
php artisan storage:link

# Start Laravel dev server (port 8000)
php artisan serve
```

**Backend will be available at:** `http://localhost:8000`

---

### Step 3 — Node.js Realtime Service

```bash
cd ../node-service

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the Node service (port 3001)
npm start
```

**Node service will be available at:** `http://localhost:3001`

---

### Step 4 — Buyer Frontend (React)

```bash
cd ../frontend-buyer

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api/v1
# VITE_NODE_URL=http://localhost:3001

# Start dev server (port 5173)
npm run dev
```

**Buyer site:** `http://localhost:5173`

---

### Step 5 — Seller Frontend (React)

```bash
cd ../frontend-seller

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api/v1

# Start dev server (port 5174)
npm run dev
```

**Seller dashboard:** `http://localhost:5174`

---

## 🔑 Default Credentials (after seeding)

### Buyer Account
- Email: `buyer@coircraft.ph`
- Password: `password`

### Seller Account
- Email: `seller@coircraft.ph`
- Password: `password`

---

## 📋 Required Libraries

### Backend (composer.json)
```
laravel/framework ^11.0
laravel/sanctum ^4.0
laravel/tinker ^2.9
intervention/image ^3.3
```

### Frontend Buyer & Seller (package.json)
```
react ^19.0
react-dom ^19.0
react-router-dom ^6.22
axios ^1.6
zustand ^4.5
@tanstack/react-query ^5.0
react-hook-form ^7.51
@hookform/resolvers ^3.3
yup ^1.4
react-hot-toast ^2.4
react-icons ^5.0
chart.js ^4.4
react-chartjs-2 ^5.2
@headlessui/react ^2.0
```

### Node Service (package.json)
```
express ^4.18
socket.io ^4.7
cors ^2.8
dotenv ^16.4
axios ^1.6
```

---

## 🗄️ Database Tables

| Table           | Description                          |
|-----------------|--------------------------------------|
| users           | Buyer accounts                       |
| sellers         | Seller accounts                      |
| products        | Product catalog with images          |
| categories      | Product categories                   |
| orders          | Customer orders                      |
| order_items     | Line items per order                 |
| transactions    | Payment transaction records          |
| carts           | Cart items per user                  |
| inventory_logs  | Stock movement history               |

---

## 🌐 API Endpoints

### Auth
| Method | URL                        | Description        |
|--------|----------------------------|--------------------|
| POST   | /api/v1/auth/register      | Buyer registration |
| POST   | /api/v1/auth/login         | Buyer login        |
| POST   | /api/v1/auth/logout        | Logout             |
| POST   | /api/v1/seller/login       | Seller login       |

### Products (Public)
| Method | URL                        | Description        |
|--------|----------------------------|--------------------|
| GET    | /api/v1/products           | List all products  |
| GET    | /api/v1/products/{id}      | Product detail     |
| GET    | /api/v1/products/featured  | Storefront items   |

### Cart & Orders (Auth Required)
| Method | URL                        | Description        |
|--------|----------------------------|--------------------|
| GET    | /api/v1/cart               | View cart          |
| POST   | /api/v1/cart               | Add to cart        |
| DELETE | /api/v1/cart/{id}          | Remove from cart   |
| POST   | /api/v1/orders             | Place order        |
| GET    | /api/v1/orders             | Order history      |

### Seller (Seller Auth Required)
| Method | URL                           | Description       |
|--------|-------------------------------|-------------------|
| GET    | /api/v1/seller/products       | My products       |
| POST   | /api/v1/seller/products       | Add product       |
| PUT    | /api/v1/seller/products/{id}  | Edit product      |
| DELETE | /api/v1/seller/products/{id}  | Remove product    |
| GET    | /api/v1/seller/reports/daily  | Daily sales       |
| GET    | /api/v1/seller/reports/monthly| Monthly sales     |

---

## 🇵🇭 Design Notes

- **Color Palette:** Coconut brown (#5C3A1E), Tropical green (#2D6A4F), Harvest gold (#D4A017)
- **Typography:** Playfair Display (headings) + Lato (body)
- **Cultural Elements:** Baybayin-inspired patterns, bilingual labels (Filipino + English)
- **Theme:** Filipino artisan market aesthetic

---

## 🏫 Educational Disclaimer

> This project is created for **educational purposes only**. No copyright infringement is intended. All product images used are either original, royalty-free, or AI-generated for demonstration.
