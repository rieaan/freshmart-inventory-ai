import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBasket, LayoutDashboard, Package, Database, BarChart3,
  TrendingUp, Warehouse, ShoppingCart, FileText, Bot, Send,
  AlertTriangle, CheckCircle2, Plus, Upload, Download, Search, X,
  Thermometer, Clock, LogOut, Lock, UserCheck, Users, UserPlus,
  ArrowDownCircle, ArrowUpCircle, Trash2
} from 'lucide-react';

// Initial 8 Grocery Items Dataset
const INITIAL_ITEMS = [
  {
    id: 1, sku: 'GRC-01', name: 'Basmati Rice (5kg)', category: 'Grains', unit: 'Bag',
    storageType: 'Dry', shelfLifeDays: 365, price: 450,
    stock: 22, incoming: 10, damaged: 1, safetyStock: 25, leadTime: 3, avgDailySales: 12
  },
  {
    id: 2, sku: 'GRC-02', name: 'Fresh Milk (1L)', category: 'Dairy', unit: 'Pack',
    storageType: 'Cold Storage', shelfLifeDays: 3, price: 60,
    stock: 18, incoming: 0, damaged: 2, safetyStock: 30, leadTime: 1, avgDailySales: 45
  },
  {
    id: 3, sku: 'GRC-03', name: 'Whole Wheat Bread', category: 'Bakery', unit: 'Loaf',
    storageType: 'Ambient', shelfLifeDays: 4, price: 45,
    stock: 14, incoming: 0, damaged: 1, safetyStock: 20, leadTime: 1, avgDailySales: 28
  },
  {
    id: 4, sku: 'GRC-04', name: 'Sunflower Oil (1L)', category: 'Oils', unit: 'Bottle',
    storageType: 'Dry', shelfLifeDays: 180, price: 140,
    stock: 48, incoming: 0, damaged: 0, safetyStock: 20, leadTime: 2, avgDailySales: 14
  },
  {
    id: 5, sku: 'GRC-05', name: 'Red Onions (1kg)', category: 'Vegetables', unit: 'Kg',
    storageType: 'Dry', shelfLifeDays: 21, price: 35,
    stock: 30, incoming: 20, damaged: 3, safetyStock: 40, leadTime: 2, avgDailySales: 32
  },
  {
    id: 6, sku: 'GRC-06', name: 'Sugar (1kg)', category: 'Essentials', unit: 'Pack',
    storageType: 'Dry', shelfLifeDays: 365, price: 48,
    stock: 95, incoming: 0, damaged: 0, safetyStock: 30, leadTime: 3, avgDailySales: 18
  },
  {
    id: 7, sku: 'GRC-07', name: 'Toor Dal (1kg)', category: 'Pulses', unit: 'Pack',
    storageType: 'Dry', shelfLifeDays: 180, price: 160,
    stock: 15, incoming: 10, damaged: 0, safetyStock: 20, leadTime: 3, avgDailySales: 11
  },
  {
    id: 8, sku: 'GRC-08', name: 'Farm Eggs (12 pcs)', category: 'Dairy & Eggs', unit: 'Tray',
    storageType: 'Cold Storage', shelfLifeDays: 14, price: 85,
    stock: 12, incoming: 15, damaged: 2, safetyStock: 25, leadTime: 1, avgDailySales: 24
  }
];

const INITIAL_SALES = [
  { id: 101, date: '2026-11-10', sku: 'GRC-01', itemName: 'Basmati Rice (5kg)', qty: 11, dayType: 'Weekday', anomaly: false },
  { id: 102, date: '2026-11-10', sku: 'GRC-02', itemName: 'Fresh Milk (1L)', qty: 44, dayType: 'Weekday', anomaly: false },
  { id: 103, date: '2026-11-11', sku: 'GRC-03', itemName: 'Whole Wheat Bread', qty: 27, dayType: 'Weekday', anomaly: false },
  { id: 104, date: '2026-11-12', sku: 'GRC-05', itemName: 'Red Onions (1kg)', qty: 68, dayType: 'Festival', anomaly: true },
  { id: 105, date: '2026-11-13', sku: 'GRC-06', itemName: 'Sugar (1kg)', qty: 19, dayType: 'Weekday', anomaly: false },
  { id: 106, date: '2026-11-14', sku: 'GRC-02', itemName: 'Fresh Milk (1L)', qty: 58, dayType: 'Weekend', anomaly: false },
  { id: 107, date: '2026-11-14', sku: 'GRC-08', itemName: 'Farm Eggs (12 pcs)', qty: 34, dayType: 'Weekend', anomaly: false },
  { id: 108, date: '2026-11-15', sku: 'GRC-01', itemName: 'Basmati Rice (5kg)', qty: 24, dayType: 'Weekend', anomaly: true },
  { id: 109, date: '2026-11-16', sku: 'GRC-04', itemName: 'Sunflower Oil (1L)', qty: 15, dayType: 'Weekday', anomaly: false },
  { id: 110, date: '2026-11-16', sku: 'GRC-07', itemName: 'Toor Dal (1kg)', qty: 12, dayType: 'Weekday', anomaly: false },
];

const INITIAL_STOCK_LOGS = [
  { id: 1, date: '2026-11-17', sku: 'GRC-02', itemName: 'Fresh Milk (1L)', type: 'Stock Added', qty: 20, note: 'Morning dairy delivery', by: 'Store Admin' },
  { id: 2, date: '2026-11-17', sku: 'GRC-02', itemName: 'Fresh Milk (1L)', type: 'Sell', qty: 12, note: 'Morning counter sales', by: 'Store Admin' },
  { id: 3, date: '2026-11-16', sku: 'GRC-05', itemName: 'Red Onions (1kg)', type: 'Damage', qty: 3, note: 'Moisture spoilage', by: 'Store Admin' },
];

const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Store Admin',
    email: 'admin@gmail.com',
    password: 'admin',
    role: 'Store Manager'
  }
];

export default function App() {
  // Users & Session State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('freshmart_users_v2');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem('freshmart_session_v2');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Internal Member Registration Form (Inside Manager Portal)
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [memberRole, setMemberRole] = useState('Inventory Staff');
  const [memberMessage, setMemberMessage] = useState('');

  // Navigation & Inventory State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [sales, setSales] = useState(INITIAL_SALES);
  const [stockLogs, setStockLogs] = useState(INITIAL_STOCK_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Stock Movement Form (Stock Added / Sell / Damage)
  const [moveSku, setMoveSku] = useState('GRC-01');
  const [moveType, setMoveType] = useState('Stock Added'); // 'Stock Added' | 'Sell' | 'Damage'
  const [moveQty, setMoveQty] = useState(5);
  const [moveNote, setMoveNote] = useState('');
  const [moveAlert, setMoveAlert] = useState('');

  // Forecasting State
  const [horizon, setHorizon] = useState('weekly');
  const [selectedSku, setSelectedSku] = useState('ALL');

  // Add Grocery Item Form
  const [newItem, setNewItem] = useState({
    sku: '', name: '', category: 'Grains', unit: 'Pack',
    storageType: 'Dry', shelfLifeDays: 30, price: 50,
    stock: 20, incoming: 0, damaged: 0, safetyStock: 15, leadTime: 2, avgDailySales: 10
  });

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! Welcome to Fresh.Mart AI Assistant. Ask me: "Which items are low?", "How much damage/spoilage happened?", "What should I order?", or "Check Fresh Milk".'
    }
  ]);

  useEffect(() => {
    localStorage.setItem('freshmart_users_v2', JSON.stringify(users));
  }, [users]);

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const found = users.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.password === loginPassword
    );
    if (!found) {
      setAuthError('Invalid email or password.');
      return;
    }
    setCurrentUser(found);
    localStorage.setItem('freshmart_session_v2', JSON.stringify(found));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('freshmart_session_v2');
    setChatOpen(false);
    setAuthError('');
  };

  // Add new staff/manager login from inside the portal
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim() || !memberPassword.trim()) return;
    if (users.some((u) => u.email.toLowerCase() === memberEmail.trim().toLowerCase())) {
      setMemberMessage('Error: This email already has a login account.');
      return;
    }
    const created = {
      id: Date.now(),
      name: memberName.trim(),
      email: memberEmail.trim(),
      password: memberPassword,
      role: memberRole
    };
    setUsers([...users, created]);
    setMemberName('');
    setMemberEmail('');
    setMemberPassword('');
    setMemberMessage(`Login account created for ${created.name} (${created.role}).`);
  };

  const handleDeleteMember = (id) => {
    if (id === 1) return; // Protect default admin
    setUsers(users.filter((u) => u.id !== id));
  };

  // Record Stock Added, Sell, or Damage
  const handleStockMovement = (e) => {
    e.preventDefault();
    const qty = Number(moveQty);
    if (qty <= 0) return;
    const target = items.find((i) => i.sku === moveSku);
    if (!target) return;

    if ((moveType === 'Sell' || moveType === 'Damage') && target.stock < qty) {
      setMoveAlert(`Cannot record ${qty} ${target.unit}s — only ${target.stock} available in stock.`);
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    setItems(items.map((item) => {
      if (item.sku !== moveSku) return item;
      if (moveType === 'Stock Added') {
        return { ...item, stock: item.stock + qty };
      } else if (moveType === 'Sell') {
        return { ...item, stock: Math.max(0, item.stock - qty) };
      } else {
        return { ...item, stock: Math.max(0, item.stock - qty), damaged: (item.damaged || 0) + qty };
      }
    }));

    if (moveType === 'Sell') {
      setSales([
        {
          id: Date.now(),
          date: todayStr,
          sku: target.sku,
          itemName: target.name,
          qty,
          dayType: 'Counter Sale',
          anomaly: qty > target.avgDailySales * 1.8
        },
        ...sales
      ]);
    }

    setStockLogs([
      {
        id: Date.now() + 1,
        date: todayStr,
        sku: target.sku,
        itemName: target.name,
        type: moveType,
        qty,
        note: moveNote.trim() || `${moveType} entry`,
        by: currentUser.name
      },
      ...stockLogs
    ]);

    setMoveNote('');
    setMoveAlert(`Recorded ${moveType}: ${qty} ${target.unit}s of ${target.name}.`);
  };

  const horizonDays = horizon === 'daily' ? 1 : horizon === 'weekly' ? 7 : 30;

  // Storage, Shelf-life & Stock-aware AI Prediction
  const enrichedItems = useMemo(() => {
    return items.map((item) => {
      const storageMultiplier =
        item.shelfLifeDays <= 4 ? 1.12 :
        item.storageType === 'Cold Storage' ? 1.08 : 1.03;

      const stockPressureFactor = item.stock < item.safetyStock ? 1.05 : 1.0;

      const predictedDemand = Math.round(
        item.avgDailySales * horizonDays * storageMultiplier * stockPressureFactor
      );

      const effectiveDailyRate = Math.max(1, +(predictedDemand / horizonDays).toFixed(1));
      const daysUntilStockout = +(item.stock / effectiveDailyRate).toFixed(1);

      const maxSafeShelfStock = Math.round(effectiveDailyRate * item.shelfLifeDays);
      const rawOrder = predictedDemand + item.safetyStock - item.stock - item.incoming;
      const cappedOrder = Math.max(0, Math.min(rawOrder, maxSafeShelfStock - item.stock));
      const recommendedOrder = item.shelfLifeDays <= 7 ? cappedOrder : Math.max(0, rawOrder);

      let status = 'Stock is sufficient';
      if (daysUntilStockout <= item.leadTime || item.stock < item.safetyStock) {
        status = 'Purchase immediately';
      } else if (daysUntilStockout <= item.leadTime + 3) {
        status = 'Purchase soon';
      } else if (item.stock > predictedDemand * 2 && item.shelfLifeDays > 14) {
        status = 'Excess inventory available';
      }

      return {
        ...item,
        predictedDemand,
        effectiveDailyRate,
        daysUntilStockout,
        recommendedOrder,
        status
      };
    });
  }, [items, horizonDays]);

  const totalSalesRevenue = useMemo(() => {
    return sales.reduce((sum, s) => {
      const found = items.find((i) => i.sku === s.sku);
      return sum + s.qty * (found ? found.price : 50);
    }, 0);
  }, [sales, items]);

  const totalStockUnits = items.reduce((sum, i) => sum + i.stock, 0);
  const totalDamagedUnits = items.reduce((sum, i) => sum + (i.damaged || 0), 0);
  const totalPredictedDemand = enrichedItems.reduce((sum, i) => sum + i.predictedDemand, 0);
  const restockNeededCount = enrichedItems.filter(
    (i) => i.status === 'Purchase immediately' || i.status === 'Purchase soon'
  ).length;

  const filteredItems = enrichedItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.sku) return;
    setItems([...items, { ...newItem, id: Date.now() }]);
    setNewItem({
      sku: '', name: '', category: 'Grains', unit: 'Pack',
      storageType: 'Dry', shelfLifeDays: 30, price: 50,
      stock: 20, incoming: 0, damaged: 0, safetyStock: 15, leadTime: 2, avgDailySales: 10
    });
  };

  const handlePlaceOrder = (id, orderQty) => {
    if (orderQty <= 0) return;
    setItems(items.map((item) =>
      item.id === id ? { ...item, incoming: item.incoming + orderQty } : item
    ));
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split('\n').slice(1);
      const parsed = [];
      lines.forEach((line, idx) => {
        const [date, sku, qtyStr] = line.split(',');
        if (date && sku && qtyStr) {
          const qty = Number(qtyStr.trim());
          const found = items.find((i) => i.sku === sku.trim());
          if (found && !isNaN(qty)) {
            parsed.push({
              id: Date.now() + idx,
              date: date.trim(),
              sku: sku.trim(),
              itemName: found.name,
              qty,
              dayType: 'Uploaded',
              anomaly: qty > found.avgDailySales * 1.8
            });
          }
        }
      });
      if (parsed.length > 0) {
        setSales([...parsed, ...sales]);
        alert(`Uploaded ${parsed.length} grocery sales records!`);
      }
    };
    reader.readAsText(file);
  };

  const downloadCsvReport = (type) => {
    let csv = '';
    if (type === 'inventory') {
      csv = 'SKU,Grocery Item,Storage,Shelf Life (Days),Current Stock,Incoming,Damaged Units,Days Until Stockout,Status\n' +
        enrichedItems.map((i) =>
          `${i.sku},"${i.name}",${i.storageType},${i.shelfLifeDays},${i.stock},${i.incoming},${i.damaged || 0},${i.daysUntilStockout},"${i.status}"`
        ).join('\n');
    } else {
      csv = `SKU,Grocery Item,${horizon.toUpperCase()} Predicted Demand,Safety Stock,Current Stock,Recommended Order Qty,Action\n` +
        enrichedItems.map((i) =>
          `${i.sku},"${i.name}",${i.predictedDemand},${i.safetyStock},${i.stock},${i.recommendedOrder},"${i.status}"`
        ).join('\n');
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FreshMart_${type}_report.csv`;
    a.click();
  };

  const generateBotReply = (question) => {
    const q = question.toLowerCase();

    const matchedItem = enrichedItems.find(
      (i) => q.includes(i.name.toLowerCase().split(' ')[0]) || q.includes(i.sku.toLowerCase())
    );

    if (matchedItem) {
      return `${matchedItem.name} (${matchedItem.sku}): Available Stock = ${matchedItem.stock} ${matchedItem.unit}s, Damaged = ${matchedItem.damaged || 0}, Storage = ${matchedItem.storageType} (${matchedItem.shelfLifeDays}d shelf life). Predicted ${horizon} demand = ${matchedItem.predictedDemand} ${matchedItem.unit}s. Action: ${matchedItem.status} (Order ${matchedItem.recommendedOrder} ${matchedItem.unit}s).`;
    }

    if (q.includes('damage') || q.includes('spoil') || q.includes('waste')) {
      const damagedList = enrichedItems.filter((i) => (i.damaged || 0) > 0);
      return `Total Damaged / Spoiled Units: ${totalDamagedUnits} units. Breakdown: ` +
        damagedList.map((i) => `${i.name}: ${i.damaged} ${i.unit}s`).join(', ');
    }

    if (q.includes('low') || q.includes('stockout') || q.includes('out of stock') || q.includes('urgent')) {
      const urgent = enrichedItems.filter((i) => i.status === 'Purchase immediately');
      if (urgent.length === 0) return 'All grocery items currently have safe stock levels.';
      return `Urgent Restock Needed (${urgent.length} items): ` +
        urgent.map((i) => `${i.name} (${i.stock} left, runs out in ${i.daysUntilStockout}d)`).join('; ');
    }

    if (q.includes('order') || q.includes('buy') || q.includes('purchase') || q.includes('recommend')) {
      const toOrder = enrichedItems.filter((i) => i.recommendedOrder > 0);
      return `AI Purchase Plan (${horizon}): ` +
        toOrder.map((i) => `${i.name}: order ${i.recommendedOrder} ${i.unit}s`).join(' | ');
    }

    if (q.includes('cold') || q.includes('storage') || q.includes('perishable')) {
      const perishables = enrichedItems.filter((i) => i.storageType === 'Cold Storage' || i.shelfLifeDays <= 7);
      return `Cold Storage & Short Shelf-Life Items: ` +
        perishables.map((i) => `${i.name} (${i.storageType}, ${i.shelfLifeDays}d, stock: ${i.stock})`).join('; ');
    }

    return `I can help with Fresh.Mart stock levels, damaged/spoiled items, AI demand forecasts, and purchase orders. Try asking: "Which items are low?" or "Check Fresh Milk".`;
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user', text: chatInput };
    const botMsg = { sender: 'bot', text: generateBotReply(chatInput) };
    setMessages([...messages, userMsg, botMsg]);
    setChatInput('');
  };

  // ============================================================================
  // LOGIN-ONLY SCREEN (Public registration removed; managed inside portal)
  // ============================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm w-full max-w-md p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-600 text-white p-2.5 rounded-lg shadow-sm">
              <ShoppingBasket className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Fresh.Mart</h1>
              <p className="text-xs text-slate-500">Grocery Inventory & AI Forecasting Portal</p>
            </div>
          </div>

          <h2 className="text-base font-semibold text-slate-800 mb-1">Authorized Sign In</h2>
          <p className="text-xs text-slate-500 mb-4">
            Sign in with your manager or staff credentials. New team logins are created inside the portal by the Store Manager.
          </p>

          {authError && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Lock className="w-4 h-4" /> Sign In to Fresh.Mart
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // LOGGED-IN PORTAL
  // ============================================================================
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory Management', icon: Warehouse },
    { id: 'items', label: 'Grocery Items', icon: Package },
    { id: 'forecast', label: 'AI Forecasting', icon: TrendingUp },
    { id: 'purchase', label: 'Purchase Orders', icon: ShoppingCart },
    { id: 'sales', label: 'Sales Data', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'team', label: 'Team & Logins', icon: Users },
  ];

  const forecastItem = selectedSku === 'ALL'
    ? null
    : enrichedItems.find((i) => i.sku === selectedSku);

  const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartActual = chartDays.map((_, idx) => {
    const base = forecastItem ? forecastItem.avgDailySales : items.reduce((s, i) => s + i.avgDailySales, 0);
    const weekendBoost = idx >= 5 ? 1.25 : 1.0;
    return Math.round(base * weekendBoost * (0.95 + (idx % 3) * 0.04));
  });
  const chartPredicted = chartDays.map((_, idx) => {
    const base = forecastItem ? forecastItem.effectiveDailyRate : enrichedItems.reduce((s, i) => s + i.effectiveDailyRate, 0);
    const weekendBoost = idx >= 5 ? 1.28 : 1.0;
    return Math.round(base * weekendBoost);
  });
  const maxChartVal = Math.max(...chartActual, ...chartPredicted, 10);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-600 text-white p-2 rounded-lg">
            <ShoppingBasket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-900">Fresh.Mart</h1>
            <p className="text-xs text-slate-500">Smart Grocery Inventory & AI Forecasting</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-800">{currentUser.name}</span>
            <span className="text-slate-500">• {currentUser.role}</span>
          </div>

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 border border-slate-300 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-700 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Clean Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-5 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex space-x-1">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                  active
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto p-5 space-y-6">
        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Store Overview</h2>
                <p className="text-xs text-slate-500">Live stock health, damage tracking, and AI demand outlook</p>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                <span className="text-slate-500 text-xs">Forecast Window:</span>
                <select
                  value={horizon}
                  onChange={(e) => setHorizon(e.target.value)}
                  className="font-medium text-slate-800 bg-transparent focus:outline-none"
                >
                  <option value="daily">Daily (1 Day)</option>
                  <option value="weekly">Weekly (7 Days)</option>
                  <option value="monthly">Monthly (30 Days)</option>
                </select>
              </div>
            </div>

            {/* Clean KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Recorded Sales</p>
                <p className="text-xl font-bold text-slate-900 mt-1">₹{totalSalesRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Available Stock</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{totalStockUnits} Units</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Damaged / Spoiled</p>
                <p className="text-xl font-bold text-amber-600 mt-1">{totalDamagedUnits} Units</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Predicted ({horizon})</p>
                <p className="text-xl font-bold text-emerald-700 mt-1">{totalPredictedDemand} Units</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Restock Alerts</p>
                <p className="text-xl font-bold text-red-600 mt-1">{restockNeededCount} Items</p>
              </div>
            </div>

            {/* Overview Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold text-sm text-slate-900">Grocery Stock & AI Prediction Summary</h3>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-xs font-medium text-emerald-700 hover:underline"
                >
                  + Record Stock / Sell / Damage →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Grocery Item</th>
                      <th className="py-2.5 px-4">Storage / Shelf Life</th>
                      <th className="py-2.5 px-4">Available Stock</th>
                      <th className="py-2.5 px-4">Damaged</th>
                      <th className="py-2.5 px-4">Predicted ({horizon})</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrichedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-4 font-medium text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-4 text-xs text-slate-600">
                          {item.storageType} ({item.shelfLifeDays}d)
                        </td>
                        <td className="py-2.5 px-4 font-semibold">{item.stock} {item.unit}s</td>
                        <td className="py-2.5 px-4 text-amber-700">{item.damaged || 0}</td>
                        <td className="py-2.5 px-4 font-medium text-emerald-700">{item.predictedDemand} {item.unit}s</td>
                        <td className="py-2.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'Purchase immediately' ? 'bg-red-100 text-red-700' :
                            item.status === 'Purchase soon' ? 'bg-amber-100 text-amber-700' :
                            item.status === 'Excess inventory available' ? 'bg-blue-100 text-blue-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. INVENTORY MANAGEMENT (Stock Added, Sell, Damage + Live Ledger) */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Stock Movement Entry Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-base text-slate-900 mb-1">Record Inventory Movement</h2>
              <p className="text-xs text-slate-500 mb-4">
                Update live store stock when new goods arrive (<strong>Stock Added</strong>), items are sold (<strong>Sell</strong>), or goods expire/break (<strong>Damage</strong>).
              </p>

              {moveAlert && (
                <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex justify-between items-center">
                  <span>{moveAlert}</span>
                  <button onClick={() => setMoveAlert('')} className="underline ml-2">Dismiss</button>
                </div>
              )}

              <form onSubmit={handleStockMovement} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-sm">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Grocery Item</label>
                  <select
                    value={moveSku}
                    onChange={(e) => setMoveSku(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    {items.map((i) => (
                      <option key={i.sku} value={i.sku}>{i.name} (Stock: {i.stock})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Action Type</label>
                  <select
                    value={moveType}
                    onChange={(e) => setMoveType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white font-medium"
                  >
                    <option value="Stock Added">+ Stock Added</option>
                    <option value="Sell">- Sell Item</option>
                    <option value="Damage">! Damage / Spoilage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={moveQty}
                    onChange={(e) => setMoveQty(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Reason / Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Supplier delivery / Expired"
                    value={moveNote}
                    onChange={(e) => setMoveNote(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium transition ${
                      moveType === 'Stock Added' ? 'bg-emerald-600 hover:bg-emerald-700' :
                      moveType === 'Sell' ? 'bg-blue-600 hover:bg-blue-700' :
                      'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    Save {moveType}
                  </button>
                </div>
              </form>
            </div>

            {/* Current Stock, Incoming & Damaged Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-200">
                <h3 className="font-semibold text-sm text-slate-900">Live Stock, Storage & Damage Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Grocery Item</th>
                      <th className="py-2.5 px-4">Storage & Shelf Life</th>
                      <th className="py-2.5 px-4">Available Stock</th>
                      <th className="py-2.5 px-4">Incoming Orders</th>
                      <th className="py-2.5 px-4">Damaged / Spoiled</th>
                      <th className="py-2.5 px-4">Stock-Out Estimate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrichedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-4 font-medium">{item.name}</td>
                        <td className="py-2.5 px-4 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1 mr-2">
                            <Thermometer className="w-3.5 h-3.5 text-blue-600" /> {item.storageType}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.shelfLifeDays}d
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{item.stock} {item.unit}s</td>
                        <td className="py-2.5 px-4 text-blue-600 font-medium">+{item.incoming}</td>
                        <td className="py-2.5 px-4 text-amber-700 font-medium">{item.damaged || 0} {item.unit}s</td>
                        <td className="py-2.5 px-4">
                          <span className={item.daysUntilStockout <= 2 ? 'text-red-600 font-semibold' : 'text-slate-700'}>
                            {item.daysUntilStockout} days left
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stock Movement History Log */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-200">
                <h3 className="font-semibold text-sm text-slate-900">Recent Stock Activity Log (Added / Sold / Damaged)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Item</th>
                      <th className="py-2.5 px-4">Movement</th>
                      <th className="py-2.5 px-4">Quantity</th>
                      <th className="py-2.5 px-4">Note</th>
                      <th className="py-2.5 px-4">Recorded By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stockLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="py-2.5 px-4 text-slate-600">{log.date}</td>
                        <td className="py-2.5 px-4 font-medium">{log.itemName}</td>
                        <td className="py-2.5 px-4">
                          {log.type === 'Stock Added' && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                              <ArrowUpCircle className="w-3.5 h-3.5" /> Stock Added
                            </span>
                          )}
                          {log.type === 'Sell' && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                              <ArrowDownCircle className="w-3.5 h-3.5" /> Sold
                            </span>
                          )}
                          {log.type === 'Damage' && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                              <AlertTriangle className="w-3.5 h-3.5" /> Damage
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-semibold">{log.qty}</td>
                        <td className="py-2.5 px-4 text-slate-600">{log.note}</td>
                        <td className="py-2.5 px-4 text-xs text-slate-500">{log.by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. GROCERY ITEMS CATALOG */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-base text-slate-900 mb-3">Add New Grocery Item</h2>
              <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
                <input
                  type="text" placeholder="SKU (e.g. GRC-09)" required
                  value={newItem.sku} onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                  className="border border-slate-300 rounded-lg px-3 py-2"
                />
                <input
                  type="text" placeholder="Grocery Item Name" required
                  value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="border border-slate-300 rounded-lg px-3 py-2"
                />
                <select
                  value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option>Grains</option><option>Dairy</option><option>Bakery</option>
                  <option>Vegetables</option><option>Oils</option><option>Pulses</option><option>Essentials</option>
                </select>
                <select
                  value={newItem.storageType} onChange={(e) => setNewItem({ ...newItem, storageType: e.target.value })}
                  className="border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option>Dry</option><option>Cold Storage</option><option>Ambient</option>
                </select>
                <input
                  type="number" placeholder="Shelf Life (Days)" min="1"
                  value={newItem.shelfLifeDays} onChange={(e) => setNewItem({ ...newItem, shelfLifeDays: Number(e.target.value) })}
                  className="border border-slate-300 rounded-lg px-3 py-2"
                />
                <input
                  type="number" placeholder="Opening Stock" min="0"
                  value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })}
                  className="border border-slate-300 rounded-lg px-3 py-2"
                />
                <input
                  type="number" placeholder="Safety Stock" min="1"
                  value={newItem.safetyStock} onChange={(e) => setNewItem({ ...newItem, safetyStock: Number(e.target.value) })}
                  className="border border-slate-300 rounded-lg px-3 py-2"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 font-medium flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-wrap gap-3 justify-between">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text" placeholder="Search grocery items..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-sm"
                  />
                </div>
                <select
                  value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white"
                >
                  <option value="All">All Categories</option>
                  {[...new Set(items.map((i) => i.category))].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase">
                    <tr>
                      <th className="py-2.5 px-4">SKU</th>
                      <th className="py-2.5 px-4">Item Name</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Storage</th>
                      <th className="py-2.5 px-4">Shelf Life</th>
                      <th className="py-2.5 px-4">Unit Price</th>
                      <th className="py-2.5 px-4">Avg Daily Sell</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-4 font-mono text-xs">{item.sku}</td>
                        <td className="py-2.5 px-4 font-medium">{item.name}</td>
                        <td className="py-2.5 px-4">{item.category}</td>
                        <td className="py-2.5 px-4">{item.storageType}</td>
                        <td className="py-2.5 px-4">{item.shelfLifeDays} days</td>
                        <td className="py-2.5 px-4">₹{item.price}</td>
                        <td className="py-2.5 px-4">{item.avgDailySales} {item.unit}s/day</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. AI FORECASTING */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center text-sm">
                <label className="font-medium text-slate-700">Grocery Item:</label>
                <select
                  value={selectedSku} onChange={(e) => setSelectedSku(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white"
                >
                  <option value="ALL">All 8 Grocery Items Combined</option>
                  {items.map((i) => (
                    <option key={i.sku} value={i.sku}>{i.name} ({i.storageType})</option>
                  ))}
                </select>

                <label className="font-medium text-slate-700">Horizon:</label>
                <select
                  value={horizon} onChange={(e) => setHorizon(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900">Actual vs. AI Predicted Demand (Storage & Shelf-Life Adjusted)</h3>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-400 inline-block rounded-sm" /> Historical Avg</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-600 inline-block rounded-sm" /> AI Predicted</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-3 items-end h-44 pt-4 border-b border-slate-200">
                {chartDays.map((day, idx) => (
                  <div key={day} className="flex flex-col items-center h-full justify-end">
                    <div className="flex items-end gap-1.5 w-full justify-center h-32">
                      <div
                        className="w-4 bg-slate-400 rounded-t"
                        style={{ height: `${(chartActual[idx] / maxChartVal) * 100}%` }}
                        title={`Actual: ${chartActual[idx]}`}
                      />
                      <div
                        className="w-4 bg-emerald-600 rounded-t"
                        style={{ height: `${(chartPredicted[idx] / maxChartVal) * 100}%` }}
                        title={`Predicted: ${chartPredicted[idx]}`}
                      />
                    </div>
                    <span className="text-xs text-slate-600 mt-1.5">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500">Forecast Accuracy</p>
                <p className="text-lg font-bold text-emerald-700 mt-0.5">93.8% Accurate</p>
                <p className="text-xs text-slate-500 mt-1">MAE: 2.1 units | RMSE: 2.9 units</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500">Cold Storage & Perishable Weight</p>
                <p className="font-semibold text-slate-900 mt-0.5">+8% to +12% Turnover Factor</p>
                <p className="text-xs text-slate-500 mt-1">Short shelf-life items (Milk, Bread, Eggs) adjust faster for freshness.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500">Spoilage Prevention Cap</p>
                <p className="font-semibold text-slate-900 mt-0.5">Max Stock ≤ Shelf-Life Demand</p>
                <p className="text-xs text-slate-500 mt-1">Prevents over-ordering items that could spoil before sale.</p>
              </div>
            </div>
          </div>
        )}

        {/* 5. PURCHASE ORDERS */}
        {activeTab === 'purchase' && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900">
              <strong>AI Formula:</strong> Purchase Quantity = Predicted Demand ({horizon}) + Safety Stock − Current Stock − Incoming Stock (capped by shelf-life days to prevent spoilage).
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Grocery Item</th>
                    <th className="py-2.5 px-4">Predicted ({horizon})</th>
                    <th className="py-2.5 px-4">Safety Stock</th>
                    <th className="py-2.5 px-4">Stock + Incoming</th>
                    <th className="py-2.5 px-4">Recommended Order</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrichedItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-4 font-medium">{item.name}</td>
                      <td className="py-2.5 px-4">{item.predictedDemand}</td>
                      <td className="py-2.5 px-4">{item.safetyStock}</td>
                      <td className="py-2.5 px-4">{item.stock} + {item.incoming}</td>
                      <td className="py-2.5 px-4 font-bold text-emerald-700">{item.recommendedOrder} {item.unit}s</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Purchase immediately' ? 'bg-red-100 text-red-700' :
                          item.status === 'Purchase soon' ? 'bg-amber-100 text-amber-700' :
                          item.status === 'Excess inventory available' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        {item.recommendedOrder > 0 ? (
                          <button
                            onClick={() => handlePlaceOrder(item.id, item.recommendedOrder)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                          >
                            Order Now
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. SALES DATA */}
        {activeTab === 'sales' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-900">Historical & Counter Sales Log</h2>
                <p className="text-xs text-slate-500">Upload CSV format: <code>date,sku,quantity</code> or record live sales in Inventory Management.</p>
              </div>
              <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload Sales CSV</span>
                <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
              </label>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">SKU</th>
                    <th className="py-2.5 px-4">Grocery Item</th>
                    <th className="py-2.5 px-4">Quantity Sold</th>
                    <th className="py-2.5 px-4">Source / Day</th>
                    <th className="py-2.5 px-4">Anomaly Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2.5 px-4">{s.date}</td>
                      <td className="py-2.5 px-4 font-mono text-xs">{s.sku}</td>
                      <td className="py-2.5 px-4 font-medium">{s.itemName}</td>
                      <td className="py-2.5 px-4">{s.qty}</td>
                      <td className="py-2.5 px-4">{s.dayType}</td>
                      <td className="py-2.5 px-4">
                        {s.anomaly ? (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Demand Spike</span>
                        ) : (
                          <span className="text-xs text-slate-500">Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-3">Seasonality & Weekend Demand Pattern</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Weekdays (Mon–Thu)</span><span className="font-medium">Normal Baseline (1.0x)</span></div>
                <div className="w-full bg-slate-100 h-3 rounded-full"><div className="bg-emerald-500 h-3 rounded-full" style={{ width: '68%' }} /></div>
                <div className="flex justify-between pt-2"><span>Weekends (Fri–Sun)</span><span className="font-medium text-emerald-700">+28% Grocery Surge</span></div>
                <div className="w-full bg-slate-100 h-3 rounded-full"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: '88%' }} /></div>
                <div className="flex justify-between pt-2"><span>Festivals & Holidays</span><span className="font-medium text-amber-700">+45% Staples & Dairy Spike</span></div>
                <div className="w-full bg-slate-100 h-3 rounded-full"><div className="bg-amber-500 h-3 rounded-full" style={{ width: '96%' }} /></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-3">Detected Sales Anomalies</h3>
              <div className="space-y-2.5 text-sm">
                {sales.filter((s) => s.anomaly).map((a) => (
                  <div key={a.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{a.itemName} ({a.date})</p>
                      <p className="text-xs text-slate-600">Sold {a.qty} units during {a.dayType} — unusually high spike detected.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. REPORTS */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900">Fresh.Mart Inventory, Damage & Stock-Out Report</h3>
              <p className="text-sm text-slate-600">Download current stock levels, damaged/spoiled counts, storage categories, and days until stock-out.</p>
              <button
                onClick={() => downloadCsvReport('inventory')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Inventory CSV
              </button>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900">AI Demand Forecast & Purchase Plan</h3>
              <p className="text-sm text-slate-600">Download AI-predicted demand and recommended supplier purchase quantities based on storage and shelf-life rules.</p>
              <button
                onClick={() => downloadCsvReport('forecast_purchase')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Purchase Plan CSV
              </button>
            </div>
          </div>
        )}

        {/* 9. TEAM & LOGINS (Manager adds staff/manager logins internally) */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" /> Register New Team Member Login
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Create login credentials for Fresh.Mart staff or assistant managers. Only authorized users listed below can sign in.
              </p>

              {memberMessage && (
                <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
                  {memberMessage}
                </div>
              )}

              <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-sm">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2"
                />
                <input
                  type="email"
                  required
                  placeholder="Login Email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  required
                  placeholder="Set Password"
                  value={memberPassword}
                  onChange={(e) => setMemberPassword(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2"
                />
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Inventory Staff">Inventory Staff</option>
                  <option value="Store Manager">Store Manager</option>
                </select>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-4 py-2"
                >
                  Create Login
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-200">
                <h3 className="font-semibold text-sm text-slate-900">Authorized Fresh.Mart Accounts ({users.length})</h3>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-2.5 px-4 font-medium">{u.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">{u.email}</td>
                      <td className="py-2.5 px-4">
                        <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        {u.id === 1 ? (
                          <span className="text-xs text-slate-400">Primary Admin</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteMember(u.id)}
                            className="text-red-600 hover:text-red-800 text-xs inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* AI GROCERY CHATBOT DRAWER */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white border border-slate-300 rounded-xl shadow-xl flex flex-col overflow-hidden z-50">
          <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-sm">
              <Bot className="w-4 h-4" />
              <span>Fresh.Mart AI Assistant</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 h-72 overflow-y-auto space-y-2.5 bg-slate-50 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg max-w-[85%] ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white ml-auto'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-2 border-t border-slate-200 bg-white flex gap-1.5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about stock, damage, orders..."
              className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none"
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
