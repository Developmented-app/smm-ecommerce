import React, { useState, useEffect } from 'react';
import { ShoppingBag, Wallet, Settings, LayoutDashboard, Database, Activity, Package, Clock, AlertTriangle, X, LogOut, Bell, Mail } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  balance: number;
  cartCount: number;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  userEmail: string;
  onLogout?: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  balance,
  cartCount,
  isAdminMode,
  setIsAdminMode,
  userEmail,
  onLogout,
  notificationsEnabled,
  onToggleNotifications
}: NavbarProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auto-reset low-balance dismiss state when user tops up their account above $10.00
  useEffect(() => {
    if (balance >= 10.00) {
      setIsDismissed(false);
    }
  }, [balance]);

  const showWarning = balance < 10.00 && !isDismissed;
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-display text-xl font-bold text-white shadow-md shadow-indigo-200">
            S
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              SMM & E-Commerce
            </span>
            <span className="font-mono text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Omnichannel Agency
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <nav className="hidden md:flex space-x-1">
          <button
            id="nav-tab-smm"
            onClick={() => { setCurrentTab('smm'); setIsAdminMode(false); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'smm' && !isAdminMode
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>SMM Growth Panel</span>
          </button>

          <button
            id="nav-tab-shop"
            onClick={() => { setCurrentTab('ecom'); setIsAdminMode(false); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'ecom' && !isAdminMode
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Digital Assets Store</span>
          </button>

          <button
            id="nav-tab-orders"
            onClick={() => { setCurrentTab('orders'); setIsAdminMode(false); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'orders' && !isAdminMode
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>My Orders & Files</span>
          </button>

          <button
            id="nav-tab-wallet"
            onClick={() => { setCurrentTab('wallet'); setIsAdminMode(false); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'wallet' && !isAdminMode
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span>Add Funds</span>
          </button>
        </nav>

        {/* User Actions & Toggle Admin */}
        <div className="flex items-center space-x-4">
          
          {/* User Email & Wallet Balance widget */}
          <div className={`flex items-center space-x-3 rounded-xl p-1.5 pl-3 border transition-all ${
            balance < 10.00
              ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-100 shadow-sm'
              : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400 font-medium truncate max-w-[120px]" title={userEmail}>
                {userEmail}
              </p>
              <p className={`text-sm font-display font-bold ${balance < 10.00 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
            <button
              id="wallet-trigger"
              onClick={() => { setCurrentTab('wallet'); setIsAdminMode(false); }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm border transition-all cursor-pointer relative ${
                balance < 10.00
                  ? 'bg-rose-600 border-rose-650 text-white hover:bg-rose-700'
                  : 'bg-white border-slate-200 text-indigo-600 hover:text-indigo-700 hover:border-indigo-200'
              }`}
              title="Deposit Funds"
            >
              <Wallet className="h-4 w-4" />
              {balance < 10.00 && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-550"></span>
                </span>
              )}
            </button>
          </div>

          {/* Cart Icon indicator (Only visible on shopper modes) */}
          <button
            id="cart-trigger"
            onClick={() => { setCurrentTab('ecom'); setIsAdminMode(false); }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
            title="View Shopping Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 font-sans text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile & Notifications Settings Dropdown */}
          <div className="relative" id="profile-settings-dropdown-wrapper">
            <button
              id="profile-settings-trigger-btn"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                isSettingsOpen
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-50/50'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
              }`}
              title="User Settings & Notifications"
            >
              <Settings className="h-5 w-5" />
              {notificationsEnabled && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-indigo-500 rounded-full"></span>
              )}
            </button>

            {isSettingsOpen && (
              <div
                className="absolute right-0 mt-2.5 w-72 rounded-2xl border border-slate-150 bg-white p-4 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                id="profile-settings-popup"
              >
                <div className="space-y-3">
                  {/* Title / User profile header */}
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-650 font-extrabold text-sm uppercase">
                      {userEmail ? userEmail[0] : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">Client Profile</p>
                      <p className="text-xs font-bold text-slate-800 truncate" title={userEmail}>
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  {/* Settings toggle element */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                      Preferences
                    </span>

                    <div className="flex flex-col gap-2 p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <Bell className="h-3 w-3 text-indigo-500" />
                          <span>Completion Alerts</span>
                        </span>
                        
                        <button
                          type="button"
                          id="settings-notifications-toggle"
                          onClick={onToggleNotifications}
                          className={`relative inline-flex h-4.5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                          }`}
                          title="Toggle Completion Notification Simulation"
                        >
                          <span
                            className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              notificationsEnabled ? 'translate-x-[18px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <p className="text-[9.5px] text-slate-500 font-medium leading-normal">
                        Simulate receiving custom HTML email dispatch verification cards to <span className="font-semibold text-slate-700">{userEmail}</span> when campaigns fully transition to completed.
                      </p>
                    </div>
                  </div>

                  {/* Preference status footer info */}
                  <div className="pt-1.5 border-t border-slate-100 text-[8.5px] font-mono text-center text-indigo-400">
                    🛡️ Secure client sandbox session
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Control Platform Admin Mode toggle switch */}
          <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
            <button
              id="toggle-admin-btn"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isAdminMode
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Toggle Client/Admin View"
            >
              {isAdminMode ? (
                <>
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Admin Mode</span>
                </>
              ) : (
                <>
                  <Settings className="h-3.5 w-3.5" />
                  <span>Control Hub</span>
                </>
              )}
            </button>

            {onLogout && (
              <button
                id="logout-btn"
                onClick={onLogout}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
                title="Disconnect & Sign Out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Low balance warning banner bar */}
      {showWarning && (
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white font-sans text-xs border-y border-rose-200 shadow-inner" id="low-balance-alert-banner">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-2 sm:px-6 lg:px-8 gap-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-rose-100 shrink-0 animate-bounce" />
              <p className="font-medium tracking-wide">
                <strong className="font-bold text-rose-100">Low Balance Alert:</strong> Your credits dropped to <span className="font-mono font-bold text-xs bg-black/15 px-1.5 py-0.5 rounded">${balance.toFixed(2)}</span>. Social automation pipelines require an active balance.
              </p>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => { setCurrentTab('wallet'); setIsAdminMode(false); }}
                className="hover:shadow px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all shrink-0 cursor-pointer"
              >
                Recharge Credit &rarr;
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-white hover:bg-rose-800 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Dismiss warning notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile nav indicator tabs */}
      <div className="flex md:hidden border-t border-slate-100 justify-around bg-slate-50/50 p-1">
        <button
          onClick={() => { setCurrentTab('smm'); setIsAdminMode(false); }}
          className={`flex flex-col items-center py-1.5 text-[10px] font-semibold w-1/4 transition-colors ${
            currentTab === 'smm' && !isAdminMode ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Activity className="h-4 w-4 mb-0.5" />
          SMM Panel
        </button>
        <button
          onClick={() => { setCurrentTab('ecom'); setIsAdminMode(false); }}
          className={`flex flex-col items-center py-1.5 text-[10px] font-semibold w-1/4 transition-colors ${
            currentTab === 'ecom' && !isAdminMode ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="h-4 w-4 mb-0.5" />
          Assets Hub
        </button>
        <button
          onClick={() => { setCurrentTab('orders'); setIsAdminMode(false); }}
          className={`flex flex-col items-center py-1.5 text-[10px] font-semibold w-1/4 transition-colors ${
            currentTab === 'orders' && !isAdminMode ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Clock className="h-4 w-4 mb-0.5" />
          My Orders
        </button>
        <button
          onClick={() => { setCurrentTab('wallet'); setIsAdminMode(false); }}
          className={`flex flex-col items-center py-1.5 text-[10px] font-semibold w-1/4 transition-colors ${
            currentTab === 'wallet' && !isAdminMode ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Wallet className="h-4 w-4 mb-0.5" />
          Add Funds
        </button>
      </div>
    </header>
  );
}
