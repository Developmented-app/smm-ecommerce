import React, { useState, useEffect } from 'react';
import { SmmOrder, EComOrder, Product } from '../types';
import { Download, FileText, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, ChevronRight, HelpCircle, TrendingUp, ArrowUpRight, Search, X, Wifi, Play, Clock, XCircle, Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 space-y-1 font-sans text-[11px]">
        <p className="font-bold text-slate-400 font-mono text-[9px] uppercase tracking-wider">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-slate-300">{entry.name}:</span>
            </span>
            <span className="font-bold font-mono text-slate-50">
              {entry.name.includes("Volume") ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface OrdersTrackerProps {
  smmOrders: SmmOrder[];
  ecomOrders: EComOrder[];
  setSmmOrders?: React.Dispatch<React.SetStateAction<SmmOrder[]>>;
}

export default function OrdersTracker({ smmOrders, ecomOrders, setSmmOrders }: OrdersTrackerProps) {
  const [activeSubTab, setActiveSubTab] = useState<'smm' | 'ecom'>('smm');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadFinished, setDownloadFinished] = useState<string | null>(null);
  const [metricType, setMetricType] = useState<'quantity' | 'count'>('quantity');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live Refresh Sim states
  const [isLiveRefresh, setIsLiveRefresh] = useState<boolean>(false);
  const [isAutoRetry, setIsAutoRetry] = useState<boolean>(true);
  const [recentlyCompletedIds, setRecentlyCompletedIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' }[]>([]);

  const triggerToast = (message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const type = message.includes('SUCCESS') ? 'success' : 'info';
    setToasts(prev => [...prev, { id, message, type }]);

    // auto dismiss toast log status after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  // Real-time interval execution for simulated delivery checks
  useEffect(() => {
    if (!isLiveRefresh || !setSmmOrders) return;

    const interval = setInterval(() => {
      setSmmOrders(prevOrders => {
        // Find if there is any Pending or In Progress order matching this user
        const activeOrders = prevOrders.filter(o => o.status === 'Pending' || o.status === 'In Progress');

        if (activeOrders.length === 0) {
          // Automatic Trial Order Dispatch Simulator Spawn
          const demoNum = Math.floor(1000 + Math.random() * 9000);
          const trialId = `TR-DEMO-${demoNum}`;
          const trialOrder: SmmOrder = {
            id: trialId,
            serviceId: 'ig-followers-hq',
            serviceName: 'Demo SMM System Verification Trial [Live Webhook Injector]',
            category: 'Instagram',
            link: 'https://instagram.com/live_test_profile',
            quantity: 500,
            price: 0.00,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            startCount: 1540,
            remains: 500
          };
          triggerToast(`🆕 Automatic Demo Campaign created: #${trialId} to test live webhook dispatch!`);
          return [...prevOrders, trialOrder];
        }

        // Random pick of active order to advance progress or complete
        const randIndex = Math.floor(Math.random() * activeOrders.length);
        const orderToUpdate = activeOrders[randIndex];

        return prevOrders.map(order => {
          if (order.id === orderToUpdate.id) {
            if (order.status === 'Pending') {
              triggerToast(`⚡ SMM Order #${order.id} verified. Status changed: Pending ➡️ In Progress!`);
              return { ...order, status: 'In Progress', remains: Math.floor(order.quantity * 0.7) };
            } else {
              // It is In Progress! Let's decrement remaining and then transition to Completed
              const currentRemains = order.remains || order.quantity;
              if (currentRemains > order.quantity * 0.25) {
                const nextRemains = Math.floor(currentRemains - (order.quantity * 0.3));
                const validatedRemains = nextRemains < 0 ? 0 : nextRemains;
                triggerToast(`📈 Delivery progress on Order #${order.id}: remains reduced to ${validatedRemains} PCS.`);
                return { ...order, remains: validatedRemains, status: 'In Progress' };
              } else {
                // Fully complete order
                triggerToast(`🎉 SUCCESS: SMM Order #${order.id} fully completed! Delivered ${order.quantity} volume units.`);
                
                setRecentlyCompletedIds(prev => [...prev, order.id]);
                // Remove visual row completed highlight after 5 seconds
                setTimeout(() => {
                  setRecentlyCompletedIds(prev => prev.filter(rId => rId !== order.id));
                }, 5000);

                return { ...order, status: 'Completed', remains: 0 };
              }
            }
          }
          return order;
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveRefresh, setSmmOrders]);

  // Track canceled status timestamps to support accurate elapsed time tracking
  useEffect(() => {
    if (!setSmmOrders) return;
    
    const missingCanceledTs = smmOrders.some(o => o.status === 'Canceled' && !o.canceledAt);
    if (missingCanceledTs) {
      setSmmOrders(prev => prev.map(o => {
        if (o.status === 'Canceled' && !o.canceledAt) {
          return { ...o, canceledAt: new Date().toISOString() };
        }
        return o;
      }));
    }
  }, [smmOrders, setSmmOrders]);

  // Auto-retry background check logic
  useEffect(() => {
    if (!isAutoRetry || !setSmmOrders) return;

    const autoRetryInterval = setInterval(() => {
      const now = Date.now();

      setSmmOrders(prevOrders => {
        let updated = false;
        const nextOrders = prevOrders.map(order => {
          if (order.status === 'Canceled') {
            const canceledTime = order.canceledAt ? new Date(order.canceledAt).getTime() : new Date(order.createdAt).getTime();
            const elapsedMs = now - canceledTime;
            
            // 5 minutes threshold (300,000 milliseconds)
            if (elapsedMs >= 5 * 60 * 1000) {
              updated = true;
              const count = order.autoRetryCount || 0;
              triggerToast(`♻️ Auto-Retry activated: Canceled Order #${order.id} automatically re-queued as Pending!`);
              return {
                ...order,
                status: 'Pending',
                remains: order.quantity,
                canceledAt: undefined, // Reset canceled timestamp for clean tracking
                autoRetryCount: count + 1
              };
            }
          }
          return order;
        });

        return updated ? nextOrders : prevOrders;
      });
    }, 4000); // Check every 4 seconds

    return () => clearInterval(autoRetryInterval);
  }, [isAutoRetry, setSmmOrders]);

  // Search filtered order sets
  const filteredSmmOrders = smmOrders.filter(order => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      order.id.toLowerCase().includes(query) ||
      order.serviceName.toLowerCase().includes(query) ||
      (order.category && order.category.toLowerCase().includes(query)) ||
      (order.link && order.link.toLowerCase().includes(query))
    );
  });

  const filteredEcomOrders = ecomOrders.filter(order => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const matchesId = order.id.toLowerCase().includes(query);
    const matchesProductName = order.items.some(item => 
      item.product.name.toLowerCase().includes(query) ||
      item.product.category.toLowerCase().includes(query)
    );
    return matchesId || matchesProductName;
  });

  const startDownloadSimulator = (productId: string, productName: string) => {
    setDownloadFinished(null);
    setDownloadingId(productId);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setDownloadFinished(`Successfully downloaded "${productName}" - Decrypted and ready!`);
          }, 600);
          return 100;
        }
        return prev + 20; // Simulated speed increments
      });
    }, 150);
  };

  // Build sequential, timezone-consistent chronological data for the past 7 days up to static query time
  const getChartData = () => {
    const data = [];
    const today = new Date('2026-06-06T11:12:23Z'); // Anchor to the metadata's local time context
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // "YYYY-MM-DD"
      
      const completedOnDay = smmOrders.filter(order => {
        if (order.status !== 'Completed') return false;
        try {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === dateStr;
        } catch {
          return false;
        }
      });
      
      const count = completedOnDay.length;
      const volume = completedOnDay.reduce((sum, o) => sum + o.quantity, 0);
      
      const formattedLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      data.push({
        date: dateStr,
        label: formattedLabel,
        "Order Count": count,
        "Volume Delivered": volume,
      });
    }
    return data;
  };

  const chartData = getChartData();

  const exportToCsv = (type: 'smm' | 'ecom') => {
    let csvContent = "";
    let filename = "";

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '';
      let str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    if (type === 'smm') {
      const headers = ["Order ID", "Service ID", "Service Name", "Category", "Link", "Quantity", "Price ($)", "Status", "Created At", "Start Count", "Remaining Units", "Auto-Retry Count"];
      const rows = smmOrders.map(order => [
        order.id,
        order.serviceId,
        order.serviceName,
        order.category,
        order.link,
        order.quantity,
        order.price,
        order.status,
        order.createdAt,
        order.startCount,
        order.remains !== undefined ? order.remains : 'Pending',
        order.autoRetryCount || 0
      ]);

      csvContent = [
        headers.map(escapeCsv).join(","),
        ...rows.map(row => row.map(escapeCsv).join(","))
      ].join("\r\n");
      
      filename = `smm_orders_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      const headers = ["Invoice ID", "Items Purchased", "Total Paid ($)", "Download Token", "Purchase Timestamp"];
      const rows = ecomOrders.map(order => {
        const itemsSummary = order.items.map(item => `${item.product.name} (Qty: ${item.quantity})`).join(" | ");
        return [
          order.id,
          itemsSummary,
          order.totalPrice,
          order.downloadToken,
          order.createdAt
        ];
      });

      csvContent = [
        headers.map(escapeCsv).join(","),
        ...rows.map(row => row.map(escapeCsv).join(","))
      ].join("\r\n");

      filename = `digital_source_invoices_${new Date().toISOString().split('T')[0]}.csv`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log verification toast if on live dashboard system
    if (type === 'smm') {
      triggerToast(`📁 Export complete: Successfully downloaded SMM dispatch reports (${smmOrders.length} records) as CSV!`);
    }
  };

  return (
    <div id="orders-tracker-container" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
      
      {/* Tracker Menu Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <span>Fulfillment Dispatch Hub</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time automatic follower injections and download your customized e-commerce files.
          </p>
        </div>

        {/* Dynamic sub tab toggle & Export actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button
              onClick={() => { setActiveSubTab('smm'); setDownloadFinished(null); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeSubTab === 'smm'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SMM Orders ({searchQuery.trim() ? `${filteredSmmOrders.length}/${smmOrders.length}` : smmOrders.length})
            </button>
            <button
              onClick={() => { setActiveSubTab('ecom'); setDownloadFinished(null); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeSubTab === 'ecom'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Digital Resources ({searchQuery.trim() ? `${filteredEcomOrders.length}/${ecomOrders.length}` : ecomOrders.length})
            </button>
          </div>

          <button
            type="button"
            id="export-csv-btn"
            onClick={() => exportToCsv(activeSubTab)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-extrabold rounded-xl border border-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
            title={`Export ${activeSubTab === 'smm' ? 'SMM Campaign' : 'Digital Resource Purchase'} details to a CSV dataset.`}
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search Bar filter wrapper & Live Refresh toggle layout */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between" id="orders-filter-search-container">
        <div className="relative flex-1">
          <input
            id="order-search-input"
            type="text"
            placeholder={activeSubTab === 'smm' ? "Search SMM orders by ID, category, link, or package name..." : "Search digital resources by Invoice ID or product name..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          />
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-405 hover:text-slate-650 cursor-pointer"
              title="Clear search query"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Live Refresh & Auto Retry controllers panel */}
        {activeSubTab === 'smm' && setSmmOrders && (
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0 select-none">
            {/* Live Webhook Toggle */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-2 px-3.5 rounded-xl">
              <div className="flex items-center space-x-2 relative">
                <span className="relative flex h-2 w-2">
                  {isLiveRefresh && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveRefresh ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {isLiveRefresh ? 'Verifying Live' : 'Live updates off'}
                </span>
              </div>
              
              <div className="h-4 w-px bg-slate-200"></div>

              <button
                type="button"
                id="live-refresh-toggle-btn"
                onClick={() => setIsLiveRefresh(!isLiveRefresh)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isLiveRefresh ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
                title="Toggle Live Webhook Simulated Status Feed"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isLiveRefresh ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Auto Retry Toggle */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-2 px-3.5 rounded-xl shadow-sm border-indigo-100/50">
              <div className="flex items-center space-x-2 relative">
                <span className="relative flex h-2 w-2">
                  {isAutoRetry && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoRetry ? 'bg-indigo-500' : 'bg-slate-300'}`}></span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {isAutoRetry ? 'Auto-Retry On' : 'Auto-Retry Off'}
                </span>
              </div>
              
              <div className="h-4 w-px bg-slate-200"></div>

              <button
                type="button"
                id="auto-retry-failed-toggle-btn"
                onClick={() => setIsAutoRetry(!isAutoRetry)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isAutoRetry ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
                title="Toggle Auto-Retry for Canceled SMM campaigns (re-queue after 5 minutes)"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isAutoRetry ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SMM Orders Tab Content */}
      {activeSubTab === 'smm' && (
        <div className="space-y-6">
          
          {/* Daily Completed Volume Graph Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-100">
            
            {/* Visual Chart Card */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100/80 p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    <span>Completed SMM Growth Trendline</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Daily social pipeline dispatch stats over time</p>
                </div>

                {/* Metrics Toggle Controller */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-stretch sm:self-auto justify-center">
                  <button
                    type="button"
                    onClick={() => setMetricType('quantity')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      metricType === 'quantity'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Volume (PCS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricType('count')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      metricType === 'count'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Order Count
                  </button>
                </div>
              </div>

              {/* Recharts responsive render view */}
              <div className="h-56 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={metricType === 'quantity' ? '#4f46e5' : '#059669'} stopOpacity={0.15}/>
                        <stop offset="95%" stopColor={metricType === 'quantity' ? '#4f46e5' : '#059669'} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis 
                      dataKey="label" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      fontWeight={600}
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      fontWeight={600}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => metricType === 'quantity' ? (val >= 1000 ? `${(val/1000).toFixed(0)}k` : val) : val}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                    <Area 
                      type="monotone" 
                      dataKey={metricType === 'quantity' ? "Volume Delivered" : "Order Count"}
                      name={metricType === 'quantity' ? "Volume Delivered" : "Completed Orders"}
                      stroke={metricType === 'quantity' ? "#4f46e5" : "#059669"} 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#metricGradient)"
                      activeDot={{ r: 5, strokeWidth: 0, fill: metricType === 'quantity' ? '#4f46e5' : '#059669' }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="flex flex-col gap-4 justify-between h-full">
              
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Total Fulfilled Volume</span>
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <h4 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight leading-none">
                    {smmOrders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.quantity, 0).toLocaleString()}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">total high-quality followers, views or likes fully dispatched and matched</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between flex-1 border-l-3 border-l-emerald-500">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Fulfillment Count</span>
                  <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <h4 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight leading-none">
                    {smmOrders.filter(o => o.status === 'Completed').length} Orders
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">organic omnichannel campaigns completed with automatic API relay checks</p>
                </div>
              </div>

              {isLiveRefresh ? (
                <div className="bg-gradient-to-r from-slate-950 to-slate-900 text-white rounded-xl p-3.5 shadow-sm space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest block font-mono flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping absolute"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      <span>Relay Syncing Active</span>
                    </span>
                    <span className="text-[8px] font-mono text-slate-400">interval: 4s</span>
                  </div>
                  <div className="space-y-1.5 max-h-[80px] overflow-y-auto pr-1 select-none scrollbar-thin">
                    {toasts.length === 0 ? (
                      <p className="text-[10px] text-slate-400 leading-normal italic">
                        Listening to relay queue... Updates will log here.
                      </p>
                    ) : (
                      toasts.slice().reverse().slice(0, 2).map((t) => (
                        <p key={t.id} className="text-[9px] text-slate-300 font-sans leading-tight border-l-2 pl-1.5 border-emerald-500">
                          {t.message}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white rounded-xl p-3.5 shadow-sm space-y-1">
                  <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest block font-mono">Real-Time Core Status</span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    Redundant global cloud nodes active. Delivery queues dispatch within <strong className="text-emerald-400 font-bold">120 seconds</strong> of payment authorization.
                  </p>
                </div>
              )}

            </div>

          </div>

          {smmOrders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100/60 font-medium text-slate-500 text-sm">
              <RefreshCw className="h-8 w-8 text-slate-300 mx-auto mb-2 animate-spin" style={{ animationDuration: '4s' }} />
              You haven&apos;t placed any social media marketing pipeline requests yet.
            </div>
          ) : filteredSmmOrders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-150 font-medium text-slate-500 text-sm space-y-2">
              <AlertCircle className="h-8 w-8 text-rose-500 mx-auto animate-bounce" />
              <p className="text-slate-800 font-bold text-sm">No SMM orders matched &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-slate-400 text-xs text-center max-w-sm mx-auto">Try searching with a different order reference ID, destination link or platform tag keyword.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Reset Search Filter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Category & Package</th>
                    <th className="py-3 px-4">Target Destination</th>
                    <th className="py-3 px-4 text-center">Amount (PCS)</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-center">API Relay Process</th>
                    <th className="py-3 px-4 text-right">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {filteredSmmOrders.slice().reverse().map((order) => {
                    // Decide status colors
                    let badgeClass = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] border font-bold uppercase tracking-wider select-none';
                    let statusIcon = null;
                    let progressPercentage = 0;
                    
                    if (order.status === 'Pending') {
                      badgeClass += ' bg-amber-50 text-amber-700 border-amber-250';
                      statusIcon = <Clock className="h-3 w-3 text-amber-500 shrink-0" />;
                      progressPercentage = 15;
                    } else if (order.status === 'In Progress') {
                      badgeClass += ' bg-indigo-50 text-indigo-700 border-indigo-250';
                      statusIcon = <Loader2 className="h-3 w-3 text-indigo-500 animate-spin shrink-0" />;
                      progressPercentage = 60;
                    } else if (order.status === 'Completed') {
                      badgeClass += ' bg-emerald-50 text-emerald-800 border-emerald-250';
                      statusIcon = <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />;
                      progressPercentage = 100;
                    } else if (order.status === 'Canceled') {
                      badgeClass += ' bg-slate-100 text-slate-500 border-slate-300';
                      statusIcon = <XCircle className="h-3 w-3 text-slate-400 shrink-0" />;
                      progressPercentage = 0;
                    }

                    const isRecentlyCompleted = recentlyCompletedIds.includes(order.id);

                    return (
                      <tr 
                        key={order.id} 
                        className={`transition-all duration-750 ${
                          isRecentlyCompleted 
                            ? 'bg-emerald-50/70 border-l-4 border-l-emerald-500 shadow-sm animate-[pulse_2s_infinite] text-emerald-950 font-bold' 
                            : 'hover:bg-slate-50/40'
                        }`} 
                        id={`smm-order-row-${order.id}`}
                      >
                        {/* ID */}
                        <td className="py-4 px-4">
                          <span className="font-mono text-slate-400 font-semibold select-all block">#{order.id}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </td>

                        {/* Package */}
                        <td className="py-4 px-4">
                          <span className="text-[10px] uppercase font-bold text-indigo-605 tracking-wide block mb-0.5">
                            {order.category}
                          </span>
                          <span className="text-slate-800 text-xs font-semibold leading-relaxed line-clamp-1 truncate max-w-[220px]" title={order.serviceName}>
                            {order.serviceName}
                          </span>
                        </td>

                        {/* Destination */}
                        <td className="py-4 px-4 font-mono text-slate-500 text-xs truncate max-w-[160px] select-all" title={order.link}>
                          {order.link}
                        </td>

                        {/* Quantity */}
                        <td className="py-4 px-4 text-center font-mono font-bold text-slate-800">
                          {order.quantity.toLocaleString()}
                        </td>

                        {/* Custom Price */}
                        <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                          ${order.price.toFixed(3)}
                        </td>

                        {/* Progress slider bar */}
                        <td className="py-4 px-4 min-w-[120px]">
                          {order.status !== 'Canceled' ? (
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-mono text-[9px] text-slate-400">
                                <span>
                                  Remains: {order.status === 'Completed' ? '0' : (order.remains !== undefined ? order.remains : 'Pending')}
                                </span>
                                <span className="font-semibold text-indigo-600">{progressPercentage}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 ${
                                    order.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600 animate-pulse'
                                  }`}
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono text-[10px]">Deactivated</span>
                          )}
                        </td>

                        {/* Status badge */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            {isRecentlyCompleted && (
                              <span className="text-[8px] font-extrabold text-emerald-700 bg-emerald-100 tracking-wider px-1.5 py-0.5 rounded uppercase animate-bounce">
                                🎉 Completed!
                              </span>
                            )}
                            <span className={badgeClass}>
                              {statusIcon}
                              <span>{order.status}</span>
                            </span>

                            {/* Canceled orders details & simulation trigger */}
                            {order.status === 'Canceled' && (
                              <div className="text-right space-y-1 mt-1 max-w-[140px]">
                                {order.canceledAt ? (
                                  <span className="text-[9px] text-slate-400 block font-mono">
                                    Fail-time: {new Date(order.canceledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-slate-400 block font-mono">
                                    Failed System Check
                                  </span>
                                )}

                                {isAutoRetry && (
                                  <div className="flex flex-col items-end gap-0.5 mt-0.5">
                                    <div className="flex items-center gap-1 text-[8.5px] font-bold text-indigo-605 bg-indigo-50 border border-indigo-100 px-1 py-0.5 rounded animate-pulse">
                                      <RefreshCw className="h-2 w-2 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                                      <span>Auto-Retry Active</span>
                                    </div>
                                    <button
                                      type="button"
                                      id={`fast-forward-btn-${order.id}`}
                                      onClick={() => {
                                        if (setSmmOrders) {
                                          // Fast-forward cancellation timestamp back by 5.5 minutes (330 seconds)
                                          setSmmOrders(prev => prev.map(o => {
                                            if (o.id === order.id) {
                                              const acceleratedTime = new Date(Date.now() - 5.5 * 60 * 1000).toISOString();
                                              return { ...o, canceledAt: acceleratedTime };
                                            }
                                            return o;
                                          }));
                                          triggerToast(`🕒 Timewarp active: Simulated 5.5m elapsed on Order #${order.id}. Auto-retry starting...`);
                                        }
                                      }}
                                      className="text-[9px] text-indigo-700 hover:text-indigo-900 font-bold underline block cursor-pointer bg-slate-50 hover:bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mt-1"
                                      title="Simulate 5 minutes elapsed for immediate automatic retry trigger"
                                    >
                                      Simulate 5m Elapsed
                                    </button>
                                  </div>
                                )}

                                {order.autoRetryCount !== undefined && order.autoRetryCount > 0 && (
                                  <span className="text-[8.5px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded block text-center uppercase tracking-wide">
                                    Retries: {order.autoRetryCount}
                                  </span>
                                )}
                              </div>
                            )}

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SMM Purchased Assets e-commerce downloads Tab Content */}
      {activeSubTab === 'ecom' && (
        <div className="space-y-6">
          {ecomOrders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100/60 font-medium text-slate-500 text-sm">
              <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              You haven&apos;t ordered any social templates or viral design kits yet.
            </div>
          ) : filteredEcomOrders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-150 font-medium text-slate-500 text-sm space-y-2">
              <AlertCircle className="h-8 w-8 text-rose-500 mx-auto animate-bounce" />
              <p className="text-slate-800 font-bold text-sm">No digital resources matched &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-slate-400 text-xs text-center max-w-sm mx-auto">Try searching for alternative kit tags, creator names, or full resource keys.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Reset Search Filter
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Trigger notification bar */}
              {downloadFinished && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3 text-xs flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{downloadFinished}</span>
                </div>
              )}

              {filteredEcomOrders.slice().reverse().map((ecomOrder) => (
                <div 
                  key={ecomOrder.id} 
                  className="bg-slate-50/60 rounded-2xl border border-slate-150 p-4 sm:p-5 space-y-4"
                  id={`ecom-order-card-${ecomOrder.id}`}
                >
                  {/* Order Top Summary metadata */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/50 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md font-mono uppercase">
                        Invoice ID: #{ecomOrder.id.substring(0, 8)}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {new Date(ecomOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 font-medium">Checkout Total:</span>
                      <span className="font-display font-extrabold text-sm text-indigo-700">${ecomOrder.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Products inside this invoice list */}
                  <div className="divide-y divide-slate-100 space-y-3 pt-1">
                    {ecomOrder.items.map((cartItem) => {
                      const isSimulatedDl = downloadingId === cartItem.product.id;
                      return (
                        <div key={cartItem.product.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 first:pt-0">
                          <div className="flex items-start space-x-3">
                            <div className="h-10 w-10 shrink-0 bg-slate-200 rounded-lg overflow-hidden border border-slate-200">
                              <img 
                                src={cartItem.product.imageUrl} 
                                alt={cartItem.product.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                                {cartItem.product.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-slate-400 font-mono">
                                <span className="bg-white px-1.5 py-0.5 rounded border border-slate-250 font-sans text-indigo-600 font-bold">
                                  Qty: {cartItem.quantity}
                                </span>
                                <span>Size: {cartItem.product.fileSize}</span>
                                <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                                  <ShieldCheck className="h-3 w-3" />
                                  Security Verified
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Trigger simulated file assembly download */}
                          <div className="shrink-0 pl-[52px] sm:pl-0">
                            {isSimulatedDl ? (
                              <div className="w-[140px] space-y-1">
                                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                                  <span>Decrypting...</span>
                                  <span>{downloadProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-indigo-600 transition-all duration-150"
                                    style={{ width: `${downloadProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                id={`download-btn-${cartItem.product.id}`}
                                onClick={() => startDownloadSimulator(cartItem.product.id, cartItem.product.name)}
                                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-250 rounded-xl transition-all shadow-sm flex items-center space-x-2 cursor-pointer hover:border-slate-350"
                              >
                                <Download className="h-3.5 w-3.5 text-indigo-600" />
                                <span>Get Asset File</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Platform trust indicator badge */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/60 text-xs text-slate-500 flex items-start gap-3">
        <HelpCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Need a custom social growth plan or hosting custom templates? Ensure your developer keys and payment handles are set up correctly. This SMM platform is fitted with anti-spam API protections and redundant delivery protocols to maintain 100% speed consistency.
        </p>
      </div>

    </div>
  );
}
