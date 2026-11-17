import sqlite3

DB_NAME = "freshmart.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()

    # Managers table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS managers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'Grocery Inventory Manager'
        )
    """)

    # Grocery items table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS grocery_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sku TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            unit TEXT NOT NULL,
            storage_type TEXT NOT NULL,
            shelf_life_days INTEGER NOT NULL,
            price REAL NOT NULL,
            stock REAL NOT NULL,
            incoming REAL DEFAULT 0,
            safety_stock REAL NOT NULL,
            lead_time_days INTEGER NOT NULL,
            avg_daily_sales REAL NOT NULL
        )
    """)

    # Sales history table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS sales_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_date TEXT NOT NULL,
            sku TEXT NOT NULL,
            item_name TEXT NOT NULL,
            quantity REAL NOT NULL,
            day_type TEXT DEFAULT 'Weekday'
        )
    """)

    # Seed default manager if empty
    cur.execute("SELECT COUNT(*) FROM managers")
    if cur.fetchone()[0] == 0:
        cur.execute(
            "INSERT INTO managers (name, email, password) VALUES (?, ?, ?)",
            ("Rajesh Sharma", "manager@freshmart.com", "manager123")
        )

    # Seed 8 grocery items if empty
    cur.execute("SELECT COUNT(*) FROM grocery_items")
    if cur.fetchone()[0] == 0:
        items = [
            ("GRC-01", "Basmati Rice (5kg)", "Grains", "Bag", "Dry", 365, 450, 22, 10, 25, 3, 12),
            ("GRC-02", "Fresh Milk (1L)", "Dairy", "Pack", "Cold Storage", 3, 60, 18, 0, 30, 1, 45),
            ("GRC-03", "Whole Wheat Bread", "Bakery", "Loaf", "Ambient", 4, 45, 14, 0, 20, 1, 28),
            ("GRC-04", "Sunflower Oil (1L)", "Oils", "Bottle", "Dry", 180, 140, 48, 0, 20, 2, 14),
            ("GRC-05", "Red Onions (1kg)", "Vegetables", "Kg", "Dry", 21, 35, 30, 20, 40, 2, 32),
            ("GRC-06", "Sugar (1kg)", "Essentials", "Pack", "Dry", 365, 48, 95, 0, 30, 3, 18),
            ("GRC-07", "Toor Dal (1kg)", "Pulses", "Pack", "Dry", 180, 160, 15, 10, 20, 3, 11),
            ("GRC-08", "Farm Eggs (12 pcs)", "Dairy & Eggs", "Tray", "Cold Storage", 14, 85, 12, 15, 25, 1, 24),
        ]
        cur.executemany("""
            INSERT INTO grocery_items
            (sku, name, category, unit, storage_type, shelf_life_days, price, stock, incoming, safety_stock, lead_time_days, avg_daily_sales)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, items)

    conn.commit()
    conn.close()
