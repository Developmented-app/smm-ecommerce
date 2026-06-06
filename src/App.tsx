import React, { useState, useEffect, useRef } from 'react';
import { SmmService, SmmOrder, Product, CartItem, EComOrder, Transaction } from './types';
import { INITIAL_SERVICES, INITIAL_PRODUCTS } from './data/initialData';
import Navbar from './components/Navbar';
import SmmForm from './components/SmmForm';
import EcommerceStore from './components/EcommerceStore';
import OrdersTracker from './components/OrdersTracker';
import WalletTab from './components/WalletTab';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { TrendingUp, Coins, Activity, ShieldCheck, Mail, Bell, Check, X, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 1. Core States
  const [smmServices, setSmmServices] = useState<SmmService[]>(() => {
    const saved = localStorage.getItem('smm_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });
  
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  
  const [smmOrders, setSmmOrders] = useState<SmmOrder[]>(() => {
    const saved = localStorage.getItem('smm_orders');
    if (saved) return JSON.parse(saved);
    
    // Seed high-fidelity sample orders including past completed ones for the line chart viz
    const baseTime = new Date('2026-06-06T11:12:23Z').getTime(); // aligns with system static time
    
    const historical: SmmOrder[] = [
      {
        id: 'SMM-110A',
        serviceId: 'yt-subs-premium',
        serviceName: 'YouTube Active Subscribers [No-Drop Guarantee / Real]',
        category: 'YouTube',
        link: 'https://youtube.com/c/creative_dev_network',
        quantity: 250,
        price: 8.00,
        status: 'Completed',
        createdAt: new Date(baseTime - 5 * 24 * 3600000 - 4 * 3600000).toISOString(), // 5 days ago approx June 1
        startCount: 1540,
        remains: 0
      },
      {
        id: 'SMM-220B',
        serviceId: 'ig-likes-super',
        serviceName: 'Instagram Super-Fast Likes [Instant / Safe Delivery]',
        category: 'Instagram',
        link: 'https://instagram.com/p/C7z8y_aOx1',
        quantity: 1500,
        price: 1.80,
        status: 'Completed',
        createdAt: new Date(baseTime - 4 * 24 * 3600000 - 2 * 3600000).toISOString(), // 4 days ago approx June 2
        startCount: 825,
        remains: 0
      },
      {
        id: 'SMM-330C',
        serviceId: 'tt-followers-real',
        serviceName: 'TikTok Quality Followers [Instant Activation]',
        category: 'TikTok',
        link: 'https://tiktok.com/@growth_hacks',
        quantity: 3000,
        price: 19.50,
        status: 'Completed',
        createdAt: new Date(baseTime - 3 * 24 * 3600000 - 6 * 3600000).toISOString(), // 3 days ago approx June 3
        startCount: 12050,
        remains: 0
      },
      {
        id: 'SMM-440D',
        serviceId: 'tw-followers-nft',
        serviceName: 'Twitter (X) Followers [Tech & Web3-Focused Profiles]',
        category: 'Twitter (X)',
        link: 'https://x.com/web3_innovations',
        quantity: 800,
        price: 11.36,
        status: 'Completed',
        createdAt: new Date(baseTime - 2 * 24 * 3600000).toISOString(), // 2 days ago approx June 4
        startCount: 450,
        remains: 0
      },
      {
        id: 'SMM-550E',
        serviceId: 'ig-views-reels',
        serviceName: 'Instagram Reels Video Views [Viral Boosting / Global]',
        category: 'Instagram',
        link: 'https://instagram.com/reels/C8w_lOpzZq',
        quantity: 5000,
        price: 4.00,
        status: 'Completed',
        createdAt: new Date(baseTime - 1 * 24 * 3600000 - 8 * 3600000).toISOString(), // 1 day ago approx June 5
        startCount: 14200,
        remains: 0
      },
      {
        id: 'SMM-660F',
        serviceId: 'tt-likes-organic',
        serviceName: 'TikTok Video Likes [Gradual / Algorithm Safe]',
        category: 'TikTok',
        link: 'https://tiktok.com/@growth_hacks/video/819320',
        quantity: 2000,
        price: 4.20,
        status: 'Completed',
        createdAt: new Date(baseTime - 5 * 3600000).toISOString(), // 5 hours ago (June 6)
        startCount: 885,
        remains: 0
      },
      {
        id: 'SMM-982A',
        serviceId: 'ig-followers-hq',
        serviceName: 'Instagram High-Quality Followers [Real Profile Pictures / Active]',
        category: 'Instagram',
        link: 'https://instagram.com/influencer_alex',
        quantity: 1000,
        price: 4.80,
        status: 'In Progress',
        createdAt: new Date(baseTime - 3600000).toISOString(), // 1 hour ago (June 6)
        startCount: 4210,
        remains: 400
      }
    ];
    return historical;
  });

  const [ecomOrders, setEcomOrders] = useState<EComOrder[]>(() => {
    const saved = localStorage.getItem('ecom_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ecom_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('wallet_balance');
    return saved ? parseFloat(saved) : 180.00; // start with a generous test amount!
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions_log');
    if (saved) return JSON.parse(saved);
    
    // Seed sample transactions representing the seed order and initial credit
    return [
      {
        id: 'TX-INIT',
        type: 'Deposit',
        amount: 184.80,
        description: 'Complimentary sandbox welcome credits loaded',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'TX-IG-ORDER',
        type: 'SMM Order',
        amount: 4.80,
        description: 'Purchased 1k Instagram Followers pack',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  });

  const [ecomRevenue, setEcomRevenue] = useState<number>(() => {
    const saved = localStorage.getItem('ecom_revenue');
    return saved ? parseFloat(saved) : 0.00;
  });

  // UI Tabs Control States
  const [currentTab, setCurrentTab] = useState<string>('smm');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_authenticated') === 'true';
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('user_email') || 'maisieclarke506@gmail.com';
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('order_notifications_enabled') !== 'false';
  });

  const [activeEmailAlert, setActiveEmailAlert] = useState<SmmOrder | null>(null);
  const prevOrdersRef = useRef<SmmOrder[]>([]);

  // Watch for order completions and trigger simulated email alerts
  useEffect(() => {
    if (prevOrdersRef.current.length > 0) {
      smmOrders.forEach(currentOrder => {
        const prevOrder = prevOrdersRef.current.find(o => o.id === currentOrder.id);
        if (currentOrder.status === 'Completed' && prevOrder && prevOrder.status !== 'Completed') {
          const isEnabled = localStorage.getItem('order_notifications_enabled') !== 'false';
          if (isEnabled) {
            setActiveEmailAlert(currentOrder);
          }
        }
      });
    }
    prevOrdersRef.current = smmOrders;
  }, [smmOrders]);

  const handleLoginSuccess = (email: string, isOperator: boolean) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    setIsAdminMode(isOperator);
    localStorage.setItem('is_authenticated', 'true');
    localStorage.setItem('user_email', email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminMode(false);
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('user_email');
  };

  // 2. LocalStorage Persistence Synchronization
  useEffect(() => {
    localStorage.setItem('smm_services', JSON.stringify(smmServices));
  }, [smmServices]);

  useEffect(() => {
    localStorage.setItem('smm_orders', JSON.stringify(smmOrders));
  }, [smmOrders]);

  useEffect(() => {
    localStorage.setItem('ecom_orders', JSON.stringify(ecomOrders));
  }, [ecomOrders]);

  useEffect(() => {
    localStorage.setItem('ecom_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wallet_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('transactions_log', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ecom_revenue', ecomRevenue.toString());
  }, [ecomRevenue]);


  // 3. Callback Actions
  
  // Placed a new SMM followers order description
  const handlePlaceSmmOrder = (service: SmmService, link: string, quantity: number, calculatedPrice: number) => {
    // 1. Deduct client balance
    setBalance(prev => parseFloat((prev - calculatedPrice).toFixed(4)));

    // 2. Append transaction history
    const txId = `TX-SMM-${Date.now()}`;
    const newTx: Transaction = {
      id: txId,
      type: 'SMM Order',
      amount: calculatedPrice,
      description: `Launched marketing SMM request for ${quantity.toLocaleString()} ${service.category} items`,
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [...prev, newTx]);

    // 3. Append SMM order
    const orderId = `SMM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: SmmOrder = {
      id: orderId,
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      link: link,
      quantity: quantity,
      price: calculatedPrice,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      startCount: Math.floor(500 + Math.random() * 5000),
      remains: quantity
    };
    
    setSmmOrders(prev => [...prev, newOrder]);
  };

  // Add Item to cart in e-commerce marketplace
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Completes store cart purchase
  const handleCheckoutCart = (totalPrice: number) => {
    // 1. Deduct client wallet balance
    setBalance(prev => parseFloat((prev - totalPrice).toFixed(2)));

    // 2. Record transaction log
    const txId = `TX-ECOM-${Date.now()}`;
    const newTx: Transaction = {
      id: txId,
      type: 'E-commerce Purchase',
      amount: totalPrice,
      description: `Bought ${cart.length} social files templates and playbooks`,
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [...prev, newTx]);

    // 3. Update admin statistics
    setEcomRevenue(prev => prev + totalPrice);

    // 4. Record download invoice
    const orderId = `EC-${Date.now()}`;
    const newInvoice: EComOrder = {
      id: orderId,
      items: [...cart],
      totalPrice: totalPrice,
      createdAt: new Date().toISOString(),
      downloadToken: `DL-TOK-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setEcomOrders(prev => [...prev, newInvoice]);

    // 5. De-escalate and empty cart
    setCart([]);
  };

  // Fund account loading
  const handleDepositFunds = (amount: number, description: string) => {
    // Increment wallet balance
    setBalance(prev => parseFloat((prev + amount).toFixed(2)));

    // Log transaction
    const txId = `TX-DEP-${Date.now()}`;
    const newTx: Transaction = {
      id: txId,
      type: 'Deposit',
      amount: amount,
      description: description,
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [...prev, newTx]);
  };

  // Admin: Add new custom SMM service to directory catalog list
  const handleAdminAddService = (newService: SmmService) => {
    setSmmServices(prev => [newService, ...prev]);
  };

  // Admin: Delete service from directory catalog list
  const handleAdminDeleteService = (id: string) => {
    setSmmServices(prev => prev.filter(srv => srv.id !== id));
  };

  // Admin: Mutate SMM order fulfillment state/stages
  const handleAdminUpdateSmmOrderStatus = (id: string, status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled') => {
    setSmmOrders(prev => prev.map(order => {
      if (order.id === id) {
        // If order gets canceled, refund money back immediately to balance!
        if (status === 'Canceled' && order.status !== 'Canceled') {
          setBalance(bal => parseFloat((bal + order.price).toFixed(4)));
          // Log refund transaction
          const txId = `TX-REF-${Date.now()}`;
          const newTx: Transaction = {
            id: txId,
            type: 'Deposit',
            amount: order.price,
            description: `Auto Refund: Canceled SMM Order #${order.id}`,
            createdAt: new Date().toISOString()
          };
          setTransactions(txs => [...txs, newTx]);
        }
        return { ...order, status };
      }
      return order;
    }));
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (!isAuthenticated) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        defaultEmail="maisieclarke506@gmail.com"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-650 selection:text-white pb-12">
      
      {/* 1. Global Navigation header panel bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        balance={balance}
        cartCount={getCartCount()}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        userEmail={userEmail}
        onLogout={handleLogout}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={() => {
          const nextVal = !notificationsEnabled;
          setNotificationsEnabled(nextVal);
          localStorage.setItem('order_notifications_enabled', nextVal ? 'true' : 'false');
        }}
      />

      {/* 2. Primary Marketing Platform Hero banner */}
      <div className="bg-white border-b border-slate-100 py-8 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-600 font-mono text-[11px] font-bold tracking-wider uppercase">
              <TrendingUp className="h-4 w-4" />
              <span>Full-Stack Marketing Operations Framework</span>
            </div>
            <h1 className="font-display text-3xl font-black text-slate-900 tracking-tight leading-none">
              {isAdminMode ? 'Control Operator Hub' : 'Omnichannel Growth Dashboard'}
            </h1>
            <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
              {isAdminMode
                ? 'Welcome back. Configure prices, activate queued accounts followers orders, and review store transactions.'
                : 'Accelerate digital performance. Instantly dispatch automatic API visual followers or download vector canvas templates.'}
            </p>
          </div>

          {/* Quick Platform specs stats row */}
          {!isAdminMode && (
            <div className="flex gap-4 sm:gap-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl shrink-0">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed</span>
                <span className="font-display text-base font-extrabold text-slate-800">{smmOrders.filter(o => o.status === 'Completed').length} PCS</span>
              </div>
              <div className="border-r border-slate-200"></div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Queue</span>
                <span className="font-display text-base font-extrabold text-indigo-600">{smmOrders.filter(o => o.status === 'Pending' || o.status === 'In Progress').length} API</span>
              </div>
              <div className="border-r border-slate-200"></div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Wallet Funds</span>
                <span className="font-display text-base font-extrabold text-slate-800">${balance.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Switchable Content Screen Grid Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {isAdminMode ? (
          /* Active operator control dashboard layout screen */
          <AdminPanel
            smmOrders={smmOrders}
            smmServices={smmServices}
            onAddService={handleAdminAddService}
            onDeleteService={handleAdminDeleteService}
            onUpdateSmmOrderStatus={handleAdminUpdateSmmOrderStatus}
            ecomRevenue={ecomRevenue}
          />
        ) : (
          /* Client facing visual dashboard layouts screen */
          <>
            {currentTab === 'smm' && (
              <SmmForm
                services={smmServices}
                balance={balance}
                onPlaceOrder={handlePlaceSmmOrder}
                onRequestDeposit={() => setCurrentTab('wallet')}
              />
            )}

            {currentTab === 'ecom' && (
              <EcommerceStore
                products={products}
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateCartQty={handleUpdateCartQty}
                onRemoveFromCart={handleRemoveFromCart}
                onCheckoutCart={handleCheckoutCart}
                balance={balance}
              />
            )}

            {currentTab === 'orders' && (
              <OrdersTracker
                smmOrders={smmOrders}
                ecomOrders={ecomOrders}
                setSmmOrders={setSmmOrders}
              />
            )}

            {currentTab === 'wallet' && (
              <WalletTab
                balance={balance}
                transactions={transactions}
                onDeposit={handleDepositFunds}
              />
            )}
          </>
        )}
      </main>

      {/* Simulated Email Pop-up Alert Dashboard Widget */}
      <AnimatePresence>
        {activeEmailAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 120, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden shadow-indigo-100 font-sans"
            id="simulated-email-alert-box"
          >
            {/* Print-specific style overrides to print only the alert box component fullscreen */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                body > div {
                  display: none !important;
                }
                #simulated-email-alert-box {
                  display: block !important;
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  height: auto !important;
                  max-width: none !important;
                  box-shadow: none !important;
                  border: none !important;
                  z-index: 99999 !important;
                  background: white !important;
                  color: black !important;
                }
                #close-email-btn, #understand-notif-btn, #print-pdf-btn {
                  display: none !important;
                }
              }
            ` }} />

            {/* Header / Subject line */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
                  Inbox E-mail Simulation (Sandbox)
                </span>
              </div>
              <button
                onClick={() => setActiveEmailAlert(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                title="Dismiss simulated email notification"
                id="close-email-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Simulated Envelope Details */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-150 text-xs text-slate-650 font-medium space-y-1">
              <p>
                <span className="text-slate-400 font-extrabold inline-block w-14 uppercase tracking-wider text-[9px]">From:</span>{" "}
                <span className="font-semibold text-slate-800">SMM Dispatch Support</span> &lt;delivery-webhook@smm-panel-auto.com&gt;
              </p>
              <p>
                <span className="text-slate-400 font-extrabold inline-block w-14 uppercase tracking-wider text-[9px]">To:</span>{" "}
                <span className="font-bold text-indigo-650">{userEmail}</span>
              </p>
              <p className="pt-1">
                <span className="text-slate-400 font-extrabold inline-block w-14 uppercase tracking-wider text-[9px]">Subject:</span>{" "}
                <span className="font-extrabold text-slate-800">
                  🎉 Campaign Success Report: SMM Order #{activeEmailAlert.id} is Completed!
                </span>
              </p>
            </div>

            {/* Email Body Panel */}
            <div className="p-6 space-y-4 text-xs text-slate-705 leading-relaxed max-h-[380px] overflow-y-auto">
              <div className="flex items-center space-x-2 text-indigo-600 font-mono text-[10px] font-bold tracking-wider uppercase">
                <Activity className="h-3.5 w-3.5" />
                <span>API FULFILLMENT VERIFICATION</span>
              </div>

              <h2 className="text-sm font-black text-slate-900 font-display tracking-tight leading-snug">
                Your high-speed viral campaign has been fully completed!
              </h2>

              <p className="font-medium">
                Hello, <br />
                We are pleased to report that the social engagement dispatch requested under reference <strong>#{activeEmailAlert.id}</strong> has been completely delivered to our API distribution indexes.
              </p>

              {/* Order Specs card */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-2.5 font-medium">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Campaign ID</span>
                  <span className="font-mono font-extrabold text-slate-800">#{activeEmailAlert.id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Network/Platform</span>
                  <span className="font-bold text-[10px] text-slate-800 bg-indigo-50 text-indigo-700 border border-indigo-100/50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {activeEmailAlert.category}
                  </span>
                </div>
                <div className="flex flex-col gap-1 border-b border-slate-150 pb-2">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Target URL Link</span>
                  <span className="font-mono text-slate-600 select-all break-all truncate font-bold text-[10.5px]" title={activeEmailAlert.link}>
                    {activeEmailAlert.link}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Fitted SMM Package</span>
                  <p className="font-bold text-slate-800 text-right truncate pl-4 max-w-[200px]" title={activeEmailAlert.serviceName}>
                    {activeEmailAlert.serviceName}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Full Delivered Volume</span>
                  <span className="font-extrabold text-slate-900 font-mono text-xs">{activeEmailAlert.quantity.toLocaleString()} Volume Units</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100/80 p-2.5 rounded-xl">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Delivered securely. Webhook return is code 200 (Completed on-time).</span>
              </div>

              <div className="border-t border-slate-150 pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-slate-200 shadow-sm"
                  id="print-pdf-btn"
                  title="Print this simulated email alert report as PDF"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500" />
                  <span>Print as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEmailAlert(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-indigo-100"
                  id="understand-notif-btn"
                >
                  Confirm & Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
