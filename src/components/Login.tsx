import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Mail, ArrowRight, Activity, ShoppingBag } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (email: string, isAdmin: boolean) => void;
  defaultEmail: string;
}

export default function Login({ onLoginSuccess, defaultEmail }: LoginProps) {
  const [email, setEmail] = useState(defaultEmail || 'maisieclarke506@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    // Dynamic fake authentication sandbox simulation
    setTimeout(() => {
      setIsLoading(false);
      // Auto-detect admin behavior for testing: if email contains admin, login as operator
      const isOperator = email.toLowerCase().includes('admin') || email.toLowerCase().includes('operator');
      onLoginSuccess(email, isOperator);
    }, 800);
  };

  const handleQuickSelect = (type: 'client' | 'admin') => {
    setError(null);
    if (type === 'client') {
      setEmail(defaultEmail || 'maisieclarke5506@gmail.com');
      setPassword('clientpass123');
    } else {
      setEmail('admin.operator@smmagency.com');
      setPassword('adminpass650');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Decorative ambient background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Badge */}
      <div className="mb-8 text-center space-y-2 z-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 font-display text-2xl font-bold text-white shadow-xl shadow-indigo-950/40">
          S
        </div>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-white leading-tight">
            SMM & E-Commerce Hub
          </h2>
          <span className="font-mono text-[10px] text-indigo-400 font-bold tracking-widest uppercase">
            Omnichannel Portal Access
          </span>
        </div>
      </div>

      {/* Center login card container */}
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10" id="login-card">
        
        <div className="space-y-1 mb-6 text-center sm:text-left">
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400">Sign in to deploy organic campaigns & manage digital assets.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email address field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex justify-between">
              <span>Account Email Address</span>
              <span className="text-indigo-400 lowercase">Sandbox verified</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 rounded-xl bg-slate-900 border border-slate-800 p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password secure field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Secret Password Key
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password key..."
                className="w-full pl-10 rounded-xl bg-slate-900 border border-slate-800 p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Feedback details */}
          {error && (
            <div className="bg-rose-950/40 border border-rose-800 text-rose-350 p-2.5 rounded-xl text-xs flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Submit trigger */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-indigo-950"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

        </form>

        {/* Sandbox Quick accounts picker for easy testing */}
        <div className="border-t border-slate-900 mt-6 pt-5 space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block text-center">
            Or Quick Connect (Testing Sandbox)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickSelect('client')}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-350 uppercase transition-all cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-indigo-400" />
              <span>Client Sandbox</span>
            </button>
            <button
              onClick={() => handleQuickSelect('admin')}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-350 uppercase transition-all cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Admin Sandbox</span>
            </button>
          </div>
        </div>

      </div>

      {/* Outer credentials footer details */}
      <div className="mt-8 text-center text-slate-500 text-[11px] font-mono select-all">
        Current UTC: 2026-06-06 11:12:23
      </div>

    </div>
  );
}
