# Fresh.Mart — AI-Based Sales Forecasting & Intelligent Grocery Inventory System

A full-stack AI/ML engineering project built for **Fresh.Mart** grocery inventory managers to forecast demand (factoring in storage type and shelf-life), monitor live stock levels, detect demand anomalies, generate automated purchase orders, and query store data via an AI Grocery Assistant chatbot.

## Folder Structure
```
freshmart-inventory-ai/
├── backend/
│   ├── main.py                  # FastAPI backend & AI demand prediction logic
│   ├── database.py              # SQLite database initialization & seed data
│   ├── grocery_sales_data.csv   # Sample 8-item grocery sales dataset
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── index.html               # HTML entry point
│   ├── package.json             # React + Vite + Tailwind dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── src/
│       ├── App.jsx              # Complete React frontend (9 pages + AI Chatbot)
│       ├── main.jsx             # React DOM mount
│       └── index.css            # Tailwind CSS directives
└── README.md
```

## How to Run Locally

### 1. Start the Python FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API docs: `http://localhost:8000/docs`

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
Default Manager Login:
- **Email:** `manager@freshmart.com`
- **Password:** `manager123`
