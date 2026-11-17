from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import io
from database import get_db, init_db

app = FastAPI(title="Fresh.Mart AI Grocery Inventory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class GroceryItemCreate(BaseModel):
    sku: str
    name: str
    category: str
    unit: str
    storage_type: str
    shelf_life_days: int
    price: float
    stock: float
    incoming: float = 0
    safety_stock: float
    lead_time_days: int
    avg_daily_sales: float

def calculate_ai_prediction(item: dict, days: int = 7):
    """
    Predicts grocery demand using historical trend + storage & shelf-life adjustment.
    """
    base_demand = item["avg_daily_sales"] * days

    # Storage & shelf-life adjustment factor
    if item["shelf_life_days"] <= 4:
        storage_factor = 1.12
    elif item["storage_type"] == "Cold Storage":
        storage_factor = 1.08
    else:
        storage_factor = 1.03

    predicted_demand = round(base_demand * storage_factor)
    effective_daily = max(1, round(predicted_demand / days, 1))
    days_left = round(item["stock"] / effective_daily, 1)

    # Cap max order quantity by shelf life to prevent spoilage waste
    max_safe_stock = effective_daily * item["shelf_life_days"]
    raw_order = predicted_demand + item["safety_stock"] - item["stock"] - item["incoming"]
    recommended_order = max(0, min(round(raw_order), round(max_safe_stock - item["stock"])))

    if days_left <= item["lead_time_days"] or item["stock"] < item["safety_stock"]:
        status = "Purchase immediately"
    elif days_left <= item["lead_time_days"] + 3:
        status = "Purchase soon"
    elif item["stock"] > predicted_demand * 2:
        status = "Excess inventory available"
    else:
        status = "Stock is sufficient"

    return {
        "predicted_demand": predicted_demand,
        "effective_daily": effective_daily,
        "days_left": days_left,
        "recommended_order": recommended_order,
        "status": status
    }

@app.post("/api/login")
def login(req: LoginRequest):
    conn = get_db()
    user = conn.execute(
        "SELECT id, name, email, role FROM managers WHERE email = ? AND password = ?",
        (req.email, req.password)
    ).fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return dict(user)

@app.post("/api/register")
def register(req: RegisterRequest):
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO managers (name, email, password) VALUES (?, ?, ?)",
            (req.name, req.email, req.password)
        )
        conn.commit()
    except Exception:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    user = conn.execute(
        "SELECT id, name, email, role FROM managers WHERE email = ?", (req.email,)
    ).fetchone()
    conn.close()
    return dict(user)

@app.get("/api/items")
def get_items(days: int = 7):
    conn = get_db()
    rows = conn.execute("SELECT * FROM grocery_items").fetchall()
    conn.close()
    result = []
    for r in rows:
        item = dict(r)
        item.update(calculate_ai_prediction(item, days))
        result.append(item)
    return result

@app.post("/api/items")
def add_item(item: GroceryItemCreate):
    conn = get_db()
    conn.execute("""
        INSERT INTO grocery_items
        (sku, name, category, unit, storage_type, shelf_life_days, price, stock, incoming, safety_stock, lead_time_days, avg_daily_sales)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        item.sku, item.name, item.category, item.unit, item.storage_type,
        item.shelf_life_days, item.price, item.stock, item.incoming,
        item.safety_stock, item.lead_time_days, item.avg_daily_sales
    ))
    conn.commit()
    conn.close()
    return {"message": "Grocery item added"}

@app.post("/api/upload-sales")
async def upload_sales_csv(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    # Data preprocessing: fill missing quantities & detect anomalies via Z-score
    df["quantity"] = df["quantity"].fillna(df["quantity"].median())
    mean_q = df["quantity"].mean()
    std_q = df["quantity"].std() or 1
    df["is_anomaly"] = np.abs((df["quantity"] - mean_q) / std_q) > 2.0

    # Simple Linear Regression trend check on aggregated daily totals
    daily = df.groupby("date")["quantity"].sum().reset_index()
    daily["day_num"] = np.arange(len(daily))
    model = LinearRegression()
    model.fit(daily[["day_num"]], daily["quantity"])
    preds = model.predict(daily[["day_num"]])

    mae = round(float(np.mean(np.abs(daily["quantity"] - preds))), 2)
    rmse = round(float(np.sqrt(np.mean((daily["quantity"] - preds) ** 2))), 2)

    return {
        "rows_processed": len(df),
        "anomalies_found": int(df["is_anomaly"].sum()),
        "mae": mae,
        "rmse": rmse
    }
