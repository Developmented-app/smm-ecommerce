import React, { useState } from 'react';
import { Transaction } from '../types';
import { CreditCard, Wallet, Plus, ShieldCheck, Flame, ArrowUpRight, History, ArrowDownLeft, AlertTriangle, Gauge, Sliders, Activity } from 'lucide-react';

interface WalletTabProps {
  balance: number;
  transactions: Transaction[];
  onDeposit: (amount: number, description: string) => void;
}

export default function WalletTab({ balance, transactions, onDeposit }: WalletTabProps) {
  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [provider, setProvider] = useState<'card' | 'paypal' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardHolder, setCardHolder] = useState('Alex Marketing');
  const [cvv, setCvv] = useState('123');
  const [successMemo, setSuccessMemo] = useState<string | null>(null);

  // Remaining Balance Capacity & Threshold tracking hooks
  const [walletCapacity, setWalletCapacity] = useState<number>(300);
  const [averageMonthlySpend, setAverageMonthlySpend] = useState<number>(150);
  const [isSimulateOpen, setIsSimulateOpen] = useState<boolean>(false);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMemo(null);

    if (depositAmount <= 0) return;

    let desc = '';
    if (provider === 'card') {
      desc = `Fund upload via Secure Card (Ending *${cardNumber.slice(-4)})`;
    } else if (provider === 'paypal') {
      desc = 'Fund upload via digital payment gateway (PayPal)';
    } else {
      desc = 'Fund upload via verified USDC Wallet (Crypto Ledger)';
    }

    onDeposit(depositAmount, desc);
    setSuccessMemo(`Transfer complete! Added $${depositAmount.toFixed(2)} USD to your SMM balance instantly.`);
  };

  return (
    <div id="wallet-recharge-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Deposit/Billing form column */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Plus className="h-6 w-6 text-indigo-600" />
            <span>Fund Wallet Account</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Top-up your balance instantly to purchase SMM views, real followers or premium e-commerce design assets.
          </p>
        </div>

        {/* Quick Amount Selector Tags */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quick Amount Selection
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => { setDepositAmount(amt); setSuccessMemo(null); }}
                className={`py-2 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all border ${
                  depositAmount === amt
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* Deposit Form */}
        <form onSubmit={handleDepositSubmit} className="space-y-4">
          
          {/* Custom payment provider select */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Payment Gateway Route
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProvider('card')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-xs font-semibold gap-1.5 transition-all ${
                  provider === 'card'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('paypal')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-xs font-semibold gap-1.5 transition-all ${
                  provider === 'paypal'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Wallet className="h-4 w-4 text-sky-500" />
                <span>PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('crypto')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-xs font-semibold gap-1.5 transition-all ${
                  provider === 'crypto'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="font-mono text-xs text-amber-500 font-bold">₿ / $</span>
                <span>USDC Crypto</span>
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Specific Deposit Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 font-mono font-bold">
                $
              </span>
              <input
                type="number"
                id="deposit-amount-input"
                required
                min="5"
                max="500"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full pl-8 rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">Min upload: $5.00 | Max: $500.00</span>
          </div>

          {/* Provider Specific Input Forms (Dummy/Simulates Checkout details) */}
          {provider === 'card' && (
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block">Direct Card Payment Form</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block font-medium">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-medium">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block font-medium">Expiry</label>
                  <input
                    type="text"
                    required
                    defaultValue="12/28"
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs text-center font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-medium">Security CVV Code</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs text-center font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {provider === 'paypal' && (
            <div className="bg-sky-50/50 border border-sky-100/60 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-600 leading-normal">
                Click checkout matching your saved PayPal handle or merchant email. This redirect session simulates secure payments instantly without multi-factor tokens.
              </p>
            </div>
          )}

          {provider === 'crypto' && (
            <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Transfer Address (USDC Sandbox)</span>
              <div className="bg-white p-2 border border-slate-200 rounded-lg text-[10px] sm:text-xs font-mono text-slate-500 truncate select-all font-semibold">
                0x71C7656EC7ab88b098defB751B7401B5f6d8976F
              </div>
              <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">
                Send USDC on Arbitrum or Optimism chains. Funds confirm in 2 micro-blocks upon payment assembly click.
              </p>
            </div>
          )}

          {/* Alert Memo Feedback */}
          {successMemo && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3 text-xs flex items-center space-x-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMemo}</span>
            </div>
          )}

          {/* Confirm Button */}
          <button
            type="submit"
            id="deposit-funds-btn"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 cursor-pointer text-center"
          >
            Deposit ${depositAmount.toFixed(2)} USD
          </button>
        </form>
      </div>

      {/* Transaction History Column right and visual layout summaries */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Wallet Balance Summary & Capacity Progress Card */}
        {(() => {
          const capacityPercentage = Math.min(100, Math.max(0, (balance / walletCapacity) * 100));
          const thresholdValue = averageMonthlySpend * 0.10;
          const isBelowThreshold = balance < thresholdValue;

          return (
            <div 
              id="wallet-balance-panel"
              className={`rounded-2xl border p-5 space-y-4 transition-all duration-300 relative overflow-hidden ${
                isBelowThreshold 
                  ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-500/20 shadow-lg shadow-rose-100/50 text-rose-950 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]' 
                  : 'bg-slate-50 border-slate-100 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`p-2.5 rounded-xl ${isBelowThreshold ? 'bg-rose-100 text-rose-600 animate-bounce' : 'bg-indigo-50 text-indigo-600'}`}>
                    {isBelowThreshold ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <Wallet className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isBelowThreshold ? 'text-rose-500' : 'text-slate-450'}`}>
                      {isBelowThreshold ? 'Attention Required' : 'Available SMM Credits'}
                    </span>
                    <span className="font-display font-black text-2xl">${balance.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    isBelowThreshold ? 'bg-rose-200/60 text-rose-700 font-mono' : 'bg-slate-200/50 text-slate-500'
                  }`}>
                    {capacityPercentage.toFixed(0)}% Capacity
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                  <span>Balance Capacity Scale</span>
                  <span className="font-mono">Cap: ${walletCapacity.toFixed(0)} USD</span>
                </div>
                
                {/* Horizontal Progress bar */}
                <div className="w-full h-3 bg-slate-200/60 rounded-full overflow-hidden p-[2px] border border-slate-200/30">
                  <div 
                    title={`Balance is running at ${capacityPercentage.toFixed(1)}% of your target capacity of $${walletCapacity}`}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBelowThreshold 
                        ? 'bg-rose-600 animate-pulse' 
                        : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                    }`} 
                    style={{ width: `${capacityPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Threshold indicator messages */}
              {isBelowThreshold ? (
                <div className="bg-rose-100/50 border border-rose-200/60 rounded-xl p-3 text-[11px] leading-relaxed text-rose-805 font-medium flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
                  <p>
                    <strong className="font-bold text-rose-900">Credit Warning:</strong> Account is below <strong className="font-mono">10%</strong> of average monthly spend (<strong className="font-mono">${thresholdValue.toFixed(2)}</strong>). Safe automated operations require immediate funding to protect SMM queues.
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your balance is running at a healthy capacity. Next recharge recommended when credits touch <span className="font-mono font-bold text-slate-700">${thresholdValue.toFixed(2)}</span>.
                </p>
              )}

              {/* Interactive Simulator Sliders Control */}
              <div className="border-t border-slate-200/50 pt-3">
                <button
                  type="button"
                  id="simulator-toggle-btn"
                  onClick={() => setIsSimulateOpen(!isSimulateOpen)}
                  className={`flex items-center justify-between w-full text-[10px] uppercase font-bold transition-all cursor-pointer ${
                    isBelowThreshold ? 'text-rose-600 hover:text-rose-800' : 'text-slate-400 hover:text-indigo-600'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Spend Threshold Simulator</span>
                  </span>
                  <span className="font-mono font-bold text-xs">{isSimulateOpen ? '[-]' : '[+]'}</span>
                </button>

                {isSimulateOpen && (
                  <div className="mt-3 space-y-3 bg-white p-3.5 rounded-xl border border-slate-150 shadow-inner">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                        <span className="flex items-center gap-1"><Gauge className="h-3 w-3 text-indigo-500" /> Target Wallet Capacity</span>
                        <span className="font-mono text-slate-800">${walletCapacity}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="1000"
                        step="50"
                        value={walletCapacity}
                        onChange={(e) => setWalletCapacity(Number(e.target.value))}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                        <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-rose-500" /> Avg Monthly Spend</span>
                        <span className="font-mono text-slate-800">${averageMonthlySpend}</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="2500"
                        step="50"
                        value={averageMonthlySpend}
                        onChange={(e) => setAverageMonthlySpend(Number(e.target.value))}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between items-center text-[9px] text-slate-400 leading-none pt-1">
                        <span>Low Balance Bar (10%):</span>
                        <span className="font-semibold text-rose-600 font-mono">${thresholdValue.toFixed(2)}</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic bg-slate-50 p-1.5 rounded border border-slate-100">
                      *Tip: Spin the Average Monthly Spend slider above to simulate high volumes (e.g. $1900+) to witness the 10% flash alarm state instantly!
                    </p>
                  </div>
                )}
              </div>

            </div>
          );
        })()}

        {/* Transaction ledger log history tab list */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-800 tracking-tight flex items-center space-x-1.5">
            <History className="h-4 w-4 text-indigo-500" />
            <span>Transaction Ledger History</span>
          </h3>

          <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Your transaction ledger is currently empty. Upload funds to start operations.
              </p>
            ) : (
              transactions.slice().reverse().map((tx) => {
                const isDeposit = tx.type === 'Deposit';
                return (
                  <div key={tx.id} className="flex justify-between items-start gap-2 border-b border-slate-50 pb-2.5 text-xs">
                    <div>
                      <div className="flex items-center space-x-1">
                        {isDeposit ? (
                          <ArrowDownLeft className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3 text-indigo-500" />
                        )}
                        <span className="font-semibold text-slate-800">{tx.type}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{tx.description}</p>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-bold block ${isDeposit ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {isDeposit ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-450 block">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
