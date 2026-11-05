# 🕷️ Aracribs India (Precision Acrylic Habitats)

A high-performance, full-featured modern E-commerce web application tailored exclusively with **Indian Rupees (INR / ₹)**, integrated **User Authentication**, an **Express.js REST API Backend**, a **Persistent Database**, and an **Interactive Admin Management Dashboard**.

---

## 🌟 Key Features

1. **Strict Indian Rupees (₹ / INR) Architecture**:
   - Every product, bundle, accessory, and substrate is priced realistically in INR (`₹899` to `₹16,499`).
   - Free shipping threshold at `₹2,500` with standard courier delivery at `₹199`.
   - All tax calculations formatted to Indian 5% GST and Indian numbering standards (`₹1,23,456`).

2. **Full Authentication & Role-Based Access (Customer & Admin)**:
   - **Customer Portal**: Sign up, login, track order status, view order history, and save delivery address.
   - **Admin Portal**: Restricted to verified administrators (`admin@aracribs.com`).
   - Secure token-based authentication using **JSON Web Tokens (JWT)** and **bcryptjs** password hashing.
   - **1-Click Test Logins** provided in the UI for instant testing.

3. **Admin Management Console**:
   - **Live Orders**: Real-time status transitions (`Confirmed` ➔ `Processing` ➔ `Dispatched` ➔ `Delivered`) and courier tracking number assignment (Delhivery, BlueDart, DTDC).
   - **Product Catalog Management**: Edit prices in ₹, update inventory stock, add new enclosures, and remove items.
   - **Financial Analytics**: Total revenue in ₹, total order count, average order value (AOV), and top-selling habitats.

4. **All-India Payment Gateways**:
   - **UPI & QR Code Scanner**: Supports Google Pay, PhonePe, Paytm, and BHIM with dynamic QR code generation and UPI VPA verification.
   - **Cards**: RuPay, Visa, MasterCard debit & credit cards with CVV validation.
   - **Netbanking**: Integrated for top Indian banks (HDFC, SBI, ICICI, Axis, Kotak, PNB).
   - **Cash on Delivery (COD)**: With transparent ₹99 handling fee.

5. **High-Velocity Aesthetics & JAWS SONIC 2026 Kinetic Animations**:
   - **Kinetic Infinite Running Tape**: Smooth running ticker with neon stars (`★`), lightning bolts (`⚡`), and discount highlights inspired by JAWS SONIC 2026.
   - **2026 Marathon Drop Live Countdown**: Real-time ticking Hours : Minutes : Seconds banner with neon glow and pulse animations.
   - **Cyber Interactive Particle Canvas**: Canvas background rendering floating neon particles and interactive connecting vectors reacting to mouse movements.
   - **Floating Holographic Specs**: 3D floating chips on the hero visual showcasing optical cast acrylic clarity and N52 magnetic lock ratings.
   - **Quick Category Discovery Strip**: Horizontal pill carousel for instant category filtering.
   - **3D Card Tilt & Scarcity Micro-Interactions**: Dynamic discount badges (`-20% OFF`), stock scarcity pills (`🔥 Only 8 left`), 3D perspective tilt on hover, and instant `✓ Added!` cart feedback.

6. **24/7 Live Keeper Support Desk**:
   - Floating interactive helpdesk pill with online status badge.
   - Expandable chat drawer with quick questions (arboreal suggestions, safe transit guarantee, UPI & COD payments, Admin Console) and automated intelligent assistance.

7. **GST Tax Invoice & Dispatch Tracking**:
   - Official Indian GST Tax Invoice format with GSTIN (`29AABCU9603R1ZM`), SAC/HSN code (`39269099`), and CGST/SGST breakdowns.
   - Visual 4-step courier dispatch tracker (`Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`) with 1-click AWB copying and clean `@media print` support.

8. **Engaging 3D Visualizer & Crib Finder Quiz**:
   - Interactive acrylic enclosure visualizer with real-time lid switching (slider vs canopy), 360-degree rotation, and bioactive substrate layering.
   - 3-step habitat recommendation quiz tailored for beginner, intermediate, and advanced arachnid keepers.

---

## 🚀 Quick Start Guide (Kaise Run Kare)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
Open your terminal in the project directory (`ADITYA DOC/Ecom`) and install dependencies:
```bash
npm install
```

### 3. Start Backend Server (Express REST API)
In your terminal, run:
```bash
npm run server
```
* The backend server will start at: `http://127.0.0.1:3001`
* Health check endpoint: `http://127.0.0.1:3001/api/health`

### 4. Start Frontend Client (Vite Dev Server)
In a second terminal window, run:
```bash
npm run dev
```
* Open your browser at: `http://127.0.0.1:5173`

---

## 🗄️ Database Setup & Connection (Database Keshe Connect Kare)

The backend comes configured with an **automatic persistent database** that works out of the box with zero external setup, and can also be connected to **MongoDB** or **PostgreSQL**.

### Option A: Default Embedded Engine (Zero-Configuration, Ready to Use)
The backend includes a persistent embedded database engine in `server/database.js` which stores data in JSON format at:
```
server/data/db.json
```
- **How it works**: Whenever you create an account, place an order, update product inventory, or assign tracking numbers, data is automatically written to `server/data/db.json`.
- **Persistence**: Your changes are **permanently saved** even if you stop or restart the server or reboot your PC.
- **Seeded Data**: Pre-seeded with 13 products in ₹, 2 demo accounts (Admin & Customer), and initial orders.

---

### Option B: Connect to MongoDB (Atlas or Local)
If you wish to connect a cloud **MongoDB Atlas** database or local MongoDB instance:

1. Open or create the `.env` file in the project root:
   ```env
   PORT=3001
   JWT_SECRET=aracribs_super_secret_jwt_key_2026
   
   # Set Database Type to MongoDB
   DATABASE_TYPE=mongodb
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/aracribs?retryWrites=true&w=majority
   ```
2. Install the MongoDB driver (optional, if using Mongoose/MongoDB):
   ```bash
   npm install mongoose
   ```
3. Restart the server (`npm run server`). The API will recognize `MONGODB_URI` from your `.env`.

---

### Option C: Connect to PostgreSQL / MySQL
To connect an SQL database (PostgreSQL, Supabase, Neon, or MySQL):

1. Update `.env`:
   ```env
   DATABASE_TYPE=postgres
   DATABASE_URL=postgres://postgres:password@localhost:5432/aracribs
   ```
2. Install the client library:
   ```bash
   npm install pg
   ```

---

## 👑 Admin Console Guide (Admin Handle Keshe Kare)

### 1. Admin Credentials
The store comes with a pre-configured administrator account:
* **Email**: `admin@aracribs.com`
* **Password**: `admin123`
* **Role**: `admin`

> 💡 **Tip**: When opening the Sign In dialog, you can simply click the **"👑 Store Admin"** button to automatically fill these credentials!

### 2. How to Open the Admin Dashboard (Dedicated Separate Link)
To maintain an authentic, clean e-commerce storefront, **the Admin Console is completely hidden from regular customers browsing the store**.

Administrators manage the store using a **dedicated private link**:
* **Frontend Dev Server**: [http://127.0.0.1:5173/#admin](http://127.0.0.1:5173/#admin) (or [http://127.0.0.1:5173/admin.html](http://127.0.0.1:5173/admin.html))
* **Backend Production Server**: [http://127.0.0.1:3001/#admin](http://127.0.0.1:3001/#admin) (or [http://127.0.0.1:3001/admin.html](http://127.0.0.1:3001/admin.html))

When you visit this link:
1. If you are not signed in, the **Restricted Administrator Sign-In Gate** will automatically open.
2. Enter `admin@aracribs.com` / `admin123` (or click the yellow **"👑 Autofill Store Admin"** button).
3. The Admin Management Console will immediately launch.
4. You can click **"← Back to Store"** at any time to return to the customer shopping experience.

---

### 3. Managing Orders (Orders Kaise Handle Kare)
In the Admin Dashboard, click the **"📦 Orders"** tab:
1. **View Orders**: See every customer order with order ID (e.g., `#AC-948210`), customer name, city, items purchased, payment method (UPI, COD, Card), and total in ₹.
2. **Change Order Status**:
   - Use the dropdown menu in the "Status" column to change the state:
     - `confirmed` ➔ Payment received.
     - `processing` ➔ Habitat being safely packed in foam.
     - `dispatched` ➔ Handed over to courier.
     - `delivered` ➔ Successfully delivered to keeper.
   - Status updates are instantly saved to the database.
3. **Assign Courier Tracking Number**:
   - In the "Tracking No." column, type the courier AWB number (e.g., `DEL-9928192` or `BLUEDART-8821`).
   - Click the **"Save"** button. The tracking number is permanently stored and visible to the customer.

---

### 4. Managing Products (Products Add / Edit / Delete Kaise Kare)
Click the **"🕷️ Products"** tab:
1. **Add New Habitat**:
   - Click the green **"+ Add New Product"** button.
   - Enter Product Name, Category (`arboreal`, `terrestrial`, `fossorial`, `micro`, `substrate`), Price in ₹, Tagline, Initial Stock Count, Dimensions, and Lid Style.
   - Click **"Create Habitat Product"**. It is immediately added to the store catalog and database.
2. **Update Price & Stock**:
   - Change the price in ₹ or adjust the stock quantity in the input fields and click Save.
3. **Delete Product**:
   - Click the red **"Delete"** button next to any product to remove it from the catalog.

---

### 5. Sales Analytics (Analytics Kaise Check Kare)
Click the **"📊 Sales Analytics"** tab:
- **Total Gross Revenue (₹)**: Live aggregated revenue from all confirmed orders.
- **Total Orders Placed**: Real-time counter of customer orders.
- **Average Order Value (AOV)**: Average amount spent per transaction.
- **Top Performing Habitats**: Units sold and revenue breakdown per model.
- **Payment Distribution**: Breakdown of orders paid via UPI, Netbanking, Cards, and Cash on Delivery.

---

## 💳 Payment Gateway Workflow (Payment Kaise Kaam Karta Hai)

The checkout process offers a realistic Indian e-commerce payment experience:

1. **Step 1: Address Input**:
   - Enter customer name, phone (+91), email, street address, city, state, and 6-digit Indian PIN code.
   - Or click **"⚡ Autofill Indian Address"** for rapid testing.
2. **Step 2: Payment Mode Selection**:
   - **⚡ UPI & Dynamic QR Code**:
     - Displays a scannable UPI QR code.
     - Select preferred UPI app (Google Pay, PhonePe, Paytm, BHIM).
     - Enter or verify UPI VPA (e.g., `aditya@okhdfcbank`).
   - **💳 Cards**:
     - Supports RuPay, Visa, MasterCard.
     - Card number, expiry (MM/YY), CVV.
   - **🏦 Netbanking**:
     - Direct selection from India's top 6 banks (HDFC, SBI, ICICI, Axis, Kotak, PNB).
   - **💵 Cash on Delivery (COD)**:
     - Automatic ₹99 cash handling fee applied to order summary.
3. **Order Confirmation**:
   - Generates an official order receipt with a unique Order ID (`#AC-XXXXXX`).
   - Automatically deducts inventory stock and notifies the customer.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | System health, database connection, and store stats | No |
| `GET` | `/api/products` | Fetch all products (optional `?category=` filter) | No |
| `GET` | `/api/products/:id` | Fetch single product details | No |
| `POST` | `/api/products` | Add a new product to catalog | Admin JWT |
| `PUT` | `/api/products/:id` | Update product price or stock | Admin JWT |
| `DELETE` | `/api/products/:id` | Remove a product | Admin JWT |
| `POST` | `/api/auth/register` | Register a new customer or admin | No |
| `POST` | `/api/auth/login` | Login and receive JWT access token | No |
| `GET` | `/api/orders` | Fetch orders (Customer sees theirs; Admin sees all) | JWT |
| `POST` | `/api/orders` | Create a new verified order | Optional JWT |
| `PATCH` | `/api/orders/:id/status` | Update order status or courier tracking number | Admin JWT |
| `GET` | `/api/admin/analytics` | Fetch sales revenue, AOV, and top products | Admin JWT |

---

## 📁 Project Structure

```
Ecom/
├── index.html                 # Main HTML entry point
├── package.json               # Scripts & dependencies
├── vite.config.js             # Vite configuration
├── .env                       # Backend port, JWT secret & DB config
├── README.md                  # Comprehensive Documentation
├── server/
│   ├── index.js               # Express REST API Server
│   ├── database.js            # Database engine & seed data
│   └── data/
│       └── db.json            # Persistent JSON database
└── src/
    ├── main.js                # Frontend app orchestrator
    ├── style.css              # Design system & dark mode CSS
    ├── data/
    │   ├── products.js        # Catalog products in ₹ (13 items)
    │   └── guides.js          # Invertebrate care masterclasses
    ├── utils/
    │   ├── currency.js        # Indian Rupee (₹) formatting utils
    │   ├── storage.js         # State management & API client
    │   └── productVisuals.js  # High-fidelity acrylic SVG visualizer
    └── components/
        ├── adminDashboard.js  # Admin management console
        ├── authModal.js       # Login, Signup & User Profile modal
        ├── checkoutModal.js   # Indian UPI, Cards & COD checkout
        ├── cartDrawer.js      # Cart with ₹2,500 shipping progress
        ├── catalog.js         # Product filter, search & catalog grid
        ├── visualizer.js      # 3D interactive habitat studio
        ├── quiz.js            # "Find Your Crib" quiz wizard
        ├── productModal.js    # Product specs modal
        ├── searchModal.js     # Live search modal
        ├── wishlistDrawer.js  # Wishlist drawer
        ├── compareDrawer.js   # Side-by-side spec comparison
        └── guidesModal.js     # Care guides reader modal
```

---

## 🛡️ License & Credits

Built for invertebrate welfare and precision terrarium keeping. Aracribs India.
