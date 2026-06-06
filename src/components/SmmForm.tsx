import React, { useState, useEffect } from 'react';
import { SmmService, SmmCategory, SmmOrder } from '../types';
import { Zap, Link as LinkIcon, Info, CheckCircle2, AlertTriangle, Coins, Sparkles, Loader2 } from 'lucide-react';

interface SmmFormProps {
  services: SmmService[];
  balance: number;
  onPlaceOrder: (service: SmmService, link: string, quantity: number, calculatedPrice: number) => void;
  onRequestDeposit: () => void;
}

export default function SmmForm({ services, balance, onPlaceOrder, onRequestDeposit }: SmmFormProps) {
  const categories: SmmCategory[] = ['Instagram', 'TikTok', 'YouTube', 'Twitter (X)', 'Facebook'];
  const [selectedCategory, setSelectedCategory] = useState<SmmCategory>('Instagram');
  const [filteredServices, setFilteredServices] = useState<SmmService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedService, setSelectedService] = useState<SmmService | null>(null);

  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number>(100);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Gemini URL Analyze States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    suggestedQuantity: number;
    analysis: string;
    confidence: number;
    trendKeywords: string[];
  } | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAiAnalyze = async () => {
    setAnalysisError(null);
    setAnalysisResult(null);
    setErrorMsg(null);

    if (!link || !link.trim()) {
      setAnalysisError("Please input your target link or profile handle above first so Gemini can analyze metrics.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/gemini/analyze-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: link,
          category: selectedCategory,
          serviceName: selectedService ? selectedService.name : "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to communicate with Gemini API proxy.");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || "Something went wrong during SMM trend analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAiQuantity = (suggested: number) => {
    if (selectedService) {
      // Clamping suggested values to keep it legal in service boundaries
      const clamped = Math.max(
        selectedService.minQuantity,
        Math.min(selectedService.maxQuantity, suggested)
      );
      setQuantity(clamped);
      setSuccessMsg(`AI optimization config loaded! Configured suggested growth amount of ${clamped.toLocaleString()} SMM delivery units.`);
      setAnalysisResult(null);
    }
  };

  // Filter services when category change
  useEffect(() => {
    const matched = services.filter(s => s.category === selectedCategory);
    setFilteredServices(matched);
    if (matched.length > 0) {
      setSelectedServiceId(matched[0].id);
      setSelectedService(matched[0]);
      setQuantity(matched[0].minQuantity);
    } else {
      setSelectedServiceId('');
      setSelectedService(null);
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [selectedCategory, services]);

  // Handle service drop-down selection change
  const handleServiceChange = (id: string) => {
    setSelectedServiceId(id);
    const s = services.find(x => x.id === id) || null;
    setSelectedService(s);
    if (s) {
      setQuantity(s.minQuantity);
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Re-calculate price on quantity or service change
  useEffect(() => {
    if (selectedService) {
      const price = (quantity * selectedService.pricePerThousand) / 1000;
      setCalculatedPrice(parseFloat(price.toFixed(4)));
    } else {
      setCalculatedPrice(0);
    }
  }, [quantity, selectedService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedService) {
      setErrorMsg('Please select a valid service first.');
      return;
    }

    if (!link.trim()) {
      setErrorMsg('Target destination URL or social username is required.');
      return;
    }

    // Quick regex or link test warning (gently validating starting with http or standard handle formats)
    if (!link.toLowerCase().includes('http://') && !link.toLowerCase().includes('https://') && !link.startsWith('@')) {
      setErrorMsg('Provide a valid link URL (e.g. https://instagram.com/...) or handles starting with @.');
      return;
    }

    if (quantity < selectedService.minQuantity) {
      setErrorMsg(`The minimum order quantity for this service is ${selectedService.minQuantity}.`);
      return;
    }

    if (quantity > selectedService.maxQuantity) {
      setErrorMsg(`The maximum allowed order quantity for this service is ${selectedService.maxQuantity}.`);
      return;
    }

    if (calculatedPrice > balance) {
      setErrorMsg(`Insufficient balance in wallet. You need $${calculatedPrice.toFixed(2)} but only have $${balance.toFixed(2)}.`);
      return;
    }

    // Trigger order callback!
    onPlaceOrder(selectedService, link, quantity, calculatedPrice);

    // Prompt user on screen
    setSuccessMsg(`Successfully ordered ${quantity.toLocaleString()} SMM items for ${selectedService.category}! SMM systems initiated.`);
    setLink('');
    setQuantity(selectedService.minQuantity);
  };

  return (
    <div id="smm-panel-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* SMM Order placement Column */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <Zap className="h-6 w-6 text-indigo-600 fill-indigo-100" />
          <span>New Growth Panel Order</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Deploy high-speed organic social algorithms to increase followers, reviews, viewers and shares.
        </p>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              id={`cat-btn-${cat.replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Service Drop-down Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Services Package
            </label>
            <select
              id="smm-service-select"
              value={selectedServiceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all bg-white"
            >
              {filteredServices.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.name} (Rate: ${srv.pricePerThousand.toFixed(2)}/1k)
                </option>
              ))}
            </select>
          </div>

          {/* Active Service Description Notice Card */}
          {selectedService && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start space-x-3">
              <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800 block">Package details:</span>
                <p className="leading-relaxed">{selectedService.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-500 font-mono">
                  <span>Min: <strong className="text-slate-700">{selectedService.minQuantity}</strong></span>
                  <span>Max: <strong className="text-slate-700">{selectedService.maxQuantity.toLocaleString()}</strong></span>
                  <span>Rate: <strong className="text-slate-700">${selectedService.pricePerThousand.toFixed(2)} per 1,000</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Target Link Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
              <span>Target Link / Profile Handle</span>
              <span className="text-[11px] text-indigo-500 font-medium lowercase">Requires public visibility</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <LinkIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                id="smm-link-input"
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder={
                  selectedCategory === 'Instagram' ? 'e.g. https://instagram.com/p/Co12xYz/ or @username' :
                  selectedCategory === 'TikTok' ? 'e.g. https://www.tiktok.com/@creator/video/1234' : 'Target URL profile link...'
                }
                className="w-full pl-10 rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-slate-400 font-medium">Not sure what organic volume to scale with?</span>
              <button
                type="button"
                id="smm-ai-helper-btn"
                onClick={handleAiAnalyze}
                disabled={isAnalyzing}
                className="text-[11px] font-bold text-indigo-650 hover:text-indigo-805 disabled:text-slate-400 transition-colors flex items-center gap-1.5 cursor-pointer bg-indigo-50 hover:bg-indigo-100/50 px-3 py-1 rounded-xl border border-indigo-100/30 font-sans"
              >
                <Sparkles className="h-3 w-3 text-indigo-500" />
                <span>{isAnalyzing ? "Analyzing URL..." : "Recommend via AI"}</span>
              </button>
            </div>

            {/* AI Assistant Loading & Results Panels */}
            {isAnalyzing && (
              <div className="mt-3 bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex items-center gap-2.5 animate-pulse">
                <Loader2 className="h-4 w-4 text-indigo-650 animate-spin shrink-0" />
                <span className="text-xs font-semibold text-slate-600">
                  Gemini analyzing target parameters and social trend indexes...
                </span>
              </div>
            )}

            {analysisError && (
              <div className="mt-3 bg-red-50 border border-red-100/80 rounded-xl p-3 text-xs text-red-700 leading-normal flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span className="font-medium">{analysisError}</span>
              </div>
            )}

            {analysisResult && !isAnalyzing && (
              <div className="mt-3 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50/50 border border-indigo-150 rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-500/10 rounded-bl-full flex items-center justify-end pr-2.5 pb-2.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                </div>

                <div>
                  <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest block font-mono mb-1">
                    Gemini AI Strategic Forecast
                  </span>
                  <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                    {analysisResult.analysis}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {analysisResult.trendKeywords.map((tag, i) => (
                    <span key={tag} className="text-[10px] font-bold bg-indigo-50 text-indigo-705 px-2.5 py-0.5 rounded-full border border-indigo-100/50">
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] font-mono font-bold text-slate-450">
                    Confidence: <span className="text-emerald-700 font-bold">{(analysisResult.confidence * 100).toFixed(0)}%</span>
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Recommended Volume</span>
                    <span className="text-sm font-extrabold text-slate-800 font-mono">
                      {analysisResult.suggestedQuantity.toLocaleString()} Units
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyAiQuantity(analysisResult.suggestedQuantity)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-100 cursor-pointer"
                  >
                    Apply Suggestion
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quantity Slider / Numeric Selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Order Quantity
              </label>
              {selectedService && (
                <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                  Step Size: 10
                </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <input
                type="number"
                id="smm-quantity-input"
                required
                min={selectedService?.minQuantity || 100}
                max={selectedService?.maxQuantity || 50000}
                step="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-32 rounded-xl border border-slate-200 p-3 text-sm font-semibold text-slate-800 text-center focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="range"
                min={selectedService?.minQuantity || 100}
                max={selectedService?.maxQuantity || 20000}
                step="50"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="flex-1 accent-indigo-600 rounded-lg cursor-pointer my-auto"
              />
            </div>
          </div>

          {/* Alerts Feedback display */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-3 text-xs flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3 text-xs flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Pricing & Checkout Summary */}
          <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Estimated Charge</span>
              <span className="font-display text-2xl font-extrabold text-slate-800">
                ${calculatedPrice.toFixed(4)}
              </span>
            </div>

            <button
              id="submit-smm-btn"
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 flex items-center space-x-2 cursor-pointer"
            >
              <span>Initiate Delivery</span>
            </button>
          </div>

        </form>
      </div>

      {/* SMM Industry stats/guide Column */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Real-time Order Engine specs Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start">
            <span className="bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full text-xs uppercase tracking-wide">
              API Automated V3
            </span>
            <Coins className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="font-display font-bold text-xl mt-4 max-w-[200px] leading-snug">
            Zero-Delay Instant Fulfillment
          </h3>
          <p className="text-indigo-200 text-xs mt-2 leading-relaxed">
            All panel orders feed dynamically into global marketing API channels. Accounts updates usually manifest within 3-15 minutes of launch.
          </p>
          <div className="grid grid-cols-2 gap-4 border-t border-indigo-800/60 pt-4 mt-6">
            <div>
              <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">Average Dispatch</span>
              <span className="block font-mono font-medium text-lg text-white mt-1">4.2 Minutes</span>
            </div>
            <div>
              <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">Active Stream API</span>
              <span className="block font-sans text-xs font-semibold text-emerald-400 mt-2 flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1"></span>
                Nominal
              </span>
            </div>
          </div>
        </div>

        {/* Why choose SMM Sizing and tips */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4">
          <h4 className="font-semibold text-slate-800 text-sm">Grow Securely: Best Practices</h4>
          <ol className="text-xs text-slate-600 space-y-2.5 list-decimal pl-4 leading-normal">
            <li>
              <strong className="text-slate-800">Do not order concurrently:</strong> Wait for a pending order to fully complete before placing a separate order on the same post.
            </li>
            <li>
              <strong className="text-slate-800">Public profile status:</strong> Ensure your social profile settings are set strictly to "Public". Private accounts will bounce orders.
            </li>
            <li>
              <strong className="text-slate-800">No Refund for Typo links:</strong> Always triple check that the video, story, or profile handle matches your page correctly.
            </li>
          </ol>
          <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Need immediate help?</span>
            <button
              type="button"
              onClick={onRequestDeposit}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              Finance Account &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
