import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { ShoppingCart, Tag, Filter, Search, Trash2, Plus, Minus, Download, Star, CheckCircle, Flame, ArrowRight } from 'lucide-react';

interface EcommerceStoreProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateCartQty: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckoutCart: (totalPrice: number) => void;
  balance: number;
}

export default function EcommerceStore({
  products,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onCheckoutCart,
  balance
}: EcommerceStoreProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Derive simple categories
  const categories = ['All', 'Templates', 'E-Books', 'Assets'];

  // Filter products by category and title query
  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.substring(0, activeCategory.length).toLowerCase() || (activeCategory === 'E-Books' && p.category === 'E-Books');
    // Simple custom category overlap check
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    setCheckoutError(null);
    setCheckoutSuccess(null);

    if (cart.length === 0) {
      setCheckoutError('Your shopping cart is empty.');
      return;
    }

    if (cartTotal > balance) {
      setCheckoutError(`You have insufficient funds. Your cart totals $${cartTotal.toFixed(2)} but your current balance is $${balance.toFixed(2)}.`);
      return;
    }

    onCheckoutCart(cartTotal);
    setCheckoutSuccess(`SaaS E-commerce Checkout successful! $${cartTotal.toFixed(2)} deducted. Your downloadable files are now unlocked in 'My Orders & Files'.`);
  };

  return (
    <div id="ecom-store-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Products Display Catalog */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Search and Category Filter Header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <Tag className="h-6 w-6 text-indigo-600" />
                <span>Modern Social E-Commerce</span>
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Acquire masterfully designed resources, preconfigured Canva presets, niche hashtags databases, and legal outreach templates.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                id="product-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates, blueprints, books..."
                className="w-full pl-9 rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>

            {/* Service Filters */}
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setCheckoutSuccess(null); setCheckoutError(null); }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid list */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-12 text-center">
            <Filter className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No resource matches your query.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              Clear filters and view all
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                id={`product-card-${product.id}`}
              >
                <div>
                  {/* Product Visual Photo */}
                  <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm shadow text-indigo-700 font-mono font-bold text-[10px] px-2 py-1 rounded-md uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  {/* Product Details info */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                      <span className="flex items-center text-amber-500 font-semibold gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                        {product.rating} / 5.0
                      </span>
                      <span>File Size: {product.fileSize}</span>
                    </div>

                    <h3 className="font-display font-semibold text-base text-slate-800 tracking-tight leading-snug hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-1 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Price</span>
                    <span className="font-display font-extrabold text-lg text-indigo-600">
                      ${product.price ? product.price.toFixed(2) : 'Free'}
                    </span>
                  </div>

                  <button
                    id={`add-to-cart-${product.id}`}
                    onClick={() => onAddToCart(product)}
                    className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 hover:shadow shadow-sm text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Get Resource</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shopping Cart Drawer (Right Side) */}
      <div className="lg:col-span-4">
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl border border-slate-800 sticky top-20 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-display font-bold text-lg flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-indigo-400" />
              <span>Current Cart</span>
            </h3>
            <span className="bg-indigo-500/20 text-indigo-300 font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
              {cart.length} items
            </span>
          </div>

          {/* Cart items list */}
          {cart.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="h-10 w-10 text-slate-600 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto leading-relaxed">
                Add premium resources from the catalog to prepare your digital social checkout.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-start justify-between gap-3 text-xs border-b border-slate-800/50 pb-3">
                  <div className="space-y-0.5 flex-1">
                    <h4 className="font-semibold text-slate-200 line-clamp-1">{item.product.name}</h4>
                    <p className="font-mono text-[10px] text-slate-400">${item.product.price.toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {/* Quantity controls */}
                    <div className="flex items-center space-x-1.5 bg-slate-800 p-0.5 rounded-md">
                      <button
                        onClick={() => onUpdateCartQty(item.product.id, item.quantity - 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveFromCart(item.product.id)}
                      className="p-1 text-rose-400 hover:text-rose-500 rounded hover:bg-rose-500/10 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checkout pricing sum */}
          {cart.length > 0 && (
            <div className="border-t border-slate-800 pt-4 space-y-4">
              <div className="space-y-1.5 font-mono text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Asset Tax</span>
                  <span className="text-emerald-400">Free download</span>
                </div>
                <div className="flex justify-between font-display text-sm text-slate-100 font-bold border-t border-slate-800/60 pt-2 mt-1">
                  <span>Total Cost</span>
                  <span className="text-indigo-400 text-base">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Feedbacks */}
              {checkoutError && (
                <div className="bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl p-2.5 text-[11px] leading-relaxed">
                  {checkoutError}
                </div>
              )}

              {checkoutSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded-xl p-2.5 text-[11px] leading-relaxed flex items-start gap-1.5">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{checkoutSuccess}</span>
                </div>
              )}

              <button
                id="checkout-btn"
                onClick={handleCheckout}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50"
              >
                <span>Purchase Files</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Quick security notice widget */}
          <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-800/40 pt-4 font-sans flex items-center gap-2">
            <Flame className="h-3.5 w-3.5 text-indigo-400" />
            <span>Files are prepared and hosted instantly upon secure transaction approval.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
