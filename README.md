# Transaction Dashboard

A modern, responsive dashboard for monitoring transaction data with interactive charts and detailed transaction listings. Built with **Next.js, Express.js, and MongoDB**.

## Features

- 📊 **Interactive Charts**: Visualize price distribution and category breakdown.
- 📱 **Fully Responsive**: Works across desktop and mobile devices.
- 🔍 **Search & Pagination**: Easily filter and navigate transactions.
- 📈 **Real-time Statistics**: View total sales, sold, and unsold items.

---

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (v4.4+)
- npm or yarn package manager

---

## Project Structure

```
transaction-dashboard/
├── transaction-backend/     # Backend server
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── server.js           # Server entry point
│   ├── .env.example        # Sample environment variables
│   └── package.json        # Backend dependencies
└── transaction-frontend/    # Frontend Next.js app
    ├── app/                # Next.js 13+ app directory
    │   ├── components/     # Reusable UI components
    │   ├── page.js        # Main dashboard page
    ├── .env.local.example  # Sample frontend env variables
    └── package.json        # Frontend dependencies
```

---

## API Endpoints

### Transactions
- `GET /api/transactions` - Fetch paginated transactions with search
- `POST /api/seed` - Seed the database with initial data

### Charts & Statistics
- `GET /api/statistics` - Get total sales, sold, and unsold items
- `GET /api/bar-chart` - Get price range distribution
- `GET /api/pie-chart` - Get category breakdown

---

## Environment Variables

### Backend (`transaction-backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/transaction_db
```

### Frontend (`transaction-frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Deployment (Production)

### 1️⃣ Build the Frontend
```bash
cd transaction-frontend
npm run build
```

### 2️⃣ Start Backend & Frontend Servers
```bash
# Start Backend
cd transaction-backend
node server.js

# Start Frontend
cd transaction-frontend
npm run dev
```

---

## Development Tools

### 🛠 Running Tests
```bash
# Backend tests
cd transaction-backend
npm test

# Frontend tests
cd transaction-frontend
npm test
```

### 📝 Linting & Code Formatting
```bash
# Backend
cd transaction-backend
npm run lint

# Frontend
cd transaction-frontend
npm run lint
```

---

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

