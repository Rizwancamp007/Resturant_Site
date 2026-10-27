# 🕌 Lahore Traditional — Fine Dining Restaurant Platform

A premium MERN stack restaurant platform featuring a cozy cafe aesthetic, real-time WebSocket order tracking, digital reservation booker, and dedicated staff/administrative dashboards.

# Live deployed link
🌐 **https://resturant-site-gamma.vercel.app/

---

## 📸 Preview & Aesthetic

The application is styled with a custom **Vintage Cozy Cafe Palette**:
*   **Latte Cream** (`#FAF4EA`): A warm, inviting cream background replacing standard stark black/white layouts.
*   **Deep Espresso** (`#2D1C16`): High-contrast dark chocolate typography.
*   **Honey Drizzle** (`#E5A93C`): Sweet gold highlights for primary CTA buttons and badge borders.
*   **Vintage Teacup Blue** (`#7FA99B`): Cozy teal-blue for secondary indicators, gradients, and icons.

The homepage features a modern, asymmetrical editorial layout with a portrait dining scene, a rotating culinary preview thumbnail, and a direct reservation button.

---

## 🌟 Key Features

### 🛒 Customer Experience
*   **Interactive Menu**: Filter dishes, view descriptions, and add item customizations (spice levels, desi ghee choices).
*   **Table Reservations**: Digital booking system showing seat availability for selected dates.
*   **Real-time Order Tracker**: Live stage progress (Placed ➔ Confirmed ➔ In Kitchen ➔ On the Way ➔ Delivered) powered by WebSockets.
*   **Payment Submission**: Native fields to upload transaction IDs and payment screenshots for local services (JazzCash, Easypaisa, Bank Transfer).

### 🍳 Staff Kitchen Dashboard
*   **FIFO Prep Queue**: Auto-updating list of incoming orders.
*   **Order State Controls**: Click to transition dishes to the next phase, broadcasting instant status alerts to the customer.
*   **Audio Chimes**: Acoustic alerts whenever a new order is registered.

### 📊 Manager / Admin Terminal
*   **Financial Insights**: Interactive sales volume, average order size, and popular dish analytics using charts.
*   **Menu & Inventory Manager**: Create, read, update, and delete menu categories, pricing, and stock items.
*   **Payment Auditing**: Review customer upload slips and approve/reject transaction proofs to confirm orders.
*   **Reviews Moderation**: View customer feedback and control public testimonials.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Zustand, Lucide React, Recharts |
| **Backend** | Node.js, Express, Socket.io, Multer, Helmet, Morgan |
| **Database** | MongoDB, Mongoose ODM |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Cloud Database) |

---

## 📁 Project Structure

```text
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/     # Layout, UI components
│   │   ├── pages/          # Customer, Admin, Staff views
│   │   ├── services/       # Axios API client setup
│   │   ├── store/          # Zustand global stores (auth, cart)
│   │   └── App.jsx         # App router and page definitions
│   ├── index.html          # Main HTML Template
│   └── tailwind.config.js  # Color tokens & custom themes
│
└── server/                 # Express backend API
    ├── controllers/        # Route logic functions
    ├── models/             # Mongoose schemas (User, Order, Menu)
    ├── routes/             # Express endpoint paths
    ├── seed/               # Local database seeding scripts
    └── server.js           # API Entry Point & Socket config
```

---

## 💻 Local Setup & Installation

### Prerequisites
*   Node.js (v16+)
*   MongoDB installed and running locally on port `27017`

### Step 1: Clone and Install Dependencies
Install dependencies in each folder:
```bash
cd client && npm install
cd ../server && npm install
```

### Step 2: Configure Environment Variables
Create a file named `.env` in the root folder with the following settings:
```ini
MONGO_URI=mongodb://localhost:27017/lahore-traditional
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Payment Details (For customer checkout preview)
JAZZCASH_ACCOUNT_NAME=Rizwan Khan
JAZZCASH_ACCOUNT_NUMBER=03278937768
EASYPAISA_ACCOUNT_NAME=Rizwan Khan
EASYPAISA_ACCOUNT_NUMBER=03358477768
```

### Step 3: Seed the Database
Populate your local database with Lahore-themed culinary assets and default users:
```bash
cd server && npm run seed
```

**Seeded Credentials**:
*   **Admin**: `admin@lahoretraditional.com` / `admin123`
*   **Staff**: `staff@lahoretraditional.com` / `staff123`
*   **Customer**: `customer@lahoretraditional.com` / `customer123`

### Step 4: Run the Application
Start the frontend and backend development servers concurrently:
Start the backend and frontend in separate terminals:
```bash
cd server && npm run dev
```
```bash
cd client && npm run dev
```
*   Your frontend will run at `http://localhost:5173`.
*   Your backend API will run at `http://localhost:5000`.

---
## 📝 License 
Build with ☕ & 💓 by Rizwan Khan ©️ 2026
