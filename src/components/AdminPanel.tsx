import React, { useState } from 'react';
import { SmmService, SmmOrder, SmmCategory } from '../types';
import { LayoutDashboard, Users, CreditCard, Activity, CheckCircle, PlusCircle, Trash2, ArrowRightCircle, RefreshCcw, Bell } from 'lucide-react';

interface AdminPanelProps {
  smmOrders: SmmOrder[];
  smmServices: SmmService[];
  onAddService: (newService: SmmService) => void;
  onDeleteService: (id: string) => void;
  onUpdateSmmOrderStatus: (id: string, status: any) => void;
  ecomRevenue: number;
}

export default function AdminPanel({
  smmOrders,
  smmServices,
  onAddService,
  onDeleteService,
  onUpdateSmmOrderStatus,
  ecomRevenue
}: AdminPanelProps) {
  // Add service form state
  const [newCat, setNewCat] = useState<SmmCategory>('Instagram');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<number>(3.50);
  const [newMin, setNewMin] = useState<number>(100);
  const [newMax, setNewMax] = useState<number>(10000);
  const [newDesc, setNewDesc] = useState('');
  const [successNotif, setSuccessNotif] = useState<string | null>(null);

  // Derive global metrics helper
  const totalSmmOrders = smmOrders.length;
  const totalSmmSpent = smmOrders.reduce((sum, order) => order.status !== 'Canceled' ? sum + order.price : sum, 0);
  const activeSmmOrders = smmOrders.filter(o => o.status === 'Pending' || o.status === 'In Progress').length;
  const completedSmmOrders = smmOrders.filter(o => o.status === 'Completed').length;

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessNotif(null);

    if (!newName.trim() || !newDesc.trim()) return;

    const added: SmmService = {
      id: `custom-srv-${Date.now()}`,
      category: newCat,
      name: newName,
      pricePerThousand: Number(newPrice),
      minQuantity: Number(newMin),
      maxQuantity: Number(newMax),
      description: newDesc
    };

    onAddService(added);
    setSuccessNotif(`Successfully created new SMM service package: "${newName}" inside ${newCat}.`);

    // Reset fields except defaults
    setNewName('');
    setNewDesc('');
  };

  return (
    <div id="admin-dashboard-container" className="space-y-8">
      
      {/* Admin Panel Header details */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div>
          <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-mono">
            Platform Operator Admin Console
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Systems Management Dashboard
          </h2>
          <p className="text-sm text-indigo-200 mt-1 max-w-xl">
            Configure catalogs, add custom API feeds, monitor e-commerce revenue streams, and instantly trigger follow processes.
          </p>
        </div>
      </div>

      {/* Analytics Bento Cards widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start text-indigo-600">
            <span className="p-2 bg-indigo-50 rounded-lg"><Activity className="h-4 w-4" /></span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded uppercase">API Secure</span>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider block mt-4">Growth Volume Spent</span>
          <span className="font-display text-lg sm:text-2xl font-bold text-slate-800 block">${totalSmmSpent.toFixed(2)}</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start text-amber-600">
            <span className="p-2 bg-amber-50 rounded-lg"><CheckCircle className="h-4 w-4" /></span>
            <span className="text-[10px] text-slate-400 font-medium">Auto Counter</span>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider block mt-4">Total SMM Orders</span>
          <span className="font-display text-lg sm:text-2xl font-bold text-slate-800 block">{totalSmmOrders} PCS</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start text-sky-600">
            <span className="p-2 bg-sky-50 rounded-lg"><CreditCard className="h-4 w-4" /></span>
            <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-1.5 py-0.5 rounded uppercase">Store Earnings</span>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider block mt-4">E-Com Sales Balance</span>
          <span className="font-display text-lg sm:text-2xl font-bold text-slate-800 block">${ecomRevenue.toFixed(2)}</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start text-teal-600">
            <span className="p-2 bg-teal-50 rounded-lg"><Users className="h-4 w-4" /></span>
            <span className="text-[10px] text-teal-600 font-bold animate-pulse">● LIVE</span>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider block mt-4">Simulated Flow Users</span>
          <span className="font-display text-lg sm:text-2xl font-bold text-slate-800 block">1 Active Operator</span>
        </div>

      </div>

      {/* Two columns: Lower sections */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column SMM Orders Full-list for updating statuses */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="font-display text-lg font-bold text-slate-800 tracking-tight">
            Order Fulfillment Pipeline
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            As a sandbox simulated administrator, click state buttons to move pending tasks through stages like <strong className="text-indigo-650">In Progress</strong> or <strong className="text-emerald-600">Completed</strong>. Changes reflect instantly on customer tracker dashboards.
          </p>

          {smmOrders.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl">
              No growth orders have been registered in the system ledger database yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Order Details</th>
                    <th className="py-2.5 px-3">Link Target</th>
                    <th className="py-2.5 px-3 text-center">Amount</th>
                    <th className="py-2.5 px-3 text-right">Current Status</th>
                    <th className="py-2.5 px-3 text-right">Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                  {smmOrders.slice().reverse().map((order) => {
                    return (
                      <tr key={order.id} className="hover:bg-slate-50/50" id={`admin-row-${order.id}`}>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800 text-xs block">{order.serviceName}</span>
                          <span className="text-[10px] text-indigo-600 font-mono">#{order.id}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] truncate max-w-[120px]" title={order.link}>
                          {order.link}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">
                          {order.quantity}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            order.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                            order.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap shrink-0">
                          {order.status === 'Pending' && (
                            <button
                              id={`admin-btn-ip-${order.id}`}
                              onClick={() => onUpdateSmmOrderStatus(order.id, 'In Progress')}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold cursor-pointer"
                              title="Set to In Progress"
                            >
                              Dispatch
                            </button>
                          )}
                          {(order.status === 'Pending' || order.status === 'In Progress') && (
                            <>
                              <button
                                id={`admin-btn-cm-${order.id}`}
                                onClick={() => onUpdateSmmOrderStatus(order.id, 'Completed')}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                title="Mark as Completed"
                              >
                                Fulfill
                              </button>
                              <button
                                id={`admin-btn-cc-${order.id}`}
                                onClick={() => onUpdateSmmOrderStatus(order.id, 'Canceled')}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[10px] font-bold cursor-pointer border border-rose-100"
                                title="Cancel and Refund Client"
                              >
                                Refund
                              </button>
                            </>
                          )}
                          {order.status === 'Completed' && (
                            <span className="text-[10px] text-slate-400 font-semibold italic">Settled</span>
                          )}
                          {order.status === 'Canceled' && (
                            <span className="text-[10px] text-rose-400 font-semibold italic">Reversed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: SMM Service Catalogue Manager */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Create Service form */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-800 tracking-tight flex items-center gap-1">
              <PlusCircle className="h-4 w-4 text-indigo-600" />
              <span>Deploy Custom Service Package</span>
            </h3>

            <form onSubmit={handleAddServiceSubmit} className="space-y-3.5">
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Platform Cat</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as SmmCategory)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-lg font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Twitter (X)">Twitter (X)</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Rate / 1k (USD)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-lg font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Product/Service Heading Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Real Feed Followers"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-lg font-bold placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Min Quantity</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={newMin}
                    onChange={(e) => setNewMin(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-lg font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Max Quantity</label>
                  <input
                    type="number"
                    step="100"
                    required
                    value={newMax}
                    onChange={(e) => setNewMax(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-lg font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Short Specification Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Real-time active feeds, lifetime drop protection, automatic renewal systems."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-lg placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              {/* Feedbacks notification */}
              {successNotif && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3 text-[10px] flex items-start gap-1.5 leading-relaxed">
                  <Bell className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successNotif}</span>
                </div>
              )}

              <button
                type="submit"
                id="create-service-btn"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase"
              >
                Assemble Package
              </button>
            </form>
          </div>

          {/* Active Services list */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-800 tracking-tight">Custom SMM Catalog ({smmServices.length})</h3>
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {smmServices.map((srv) => (
                <div key={srv.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100" id={`admin-cat-item-${srv.id}`}>
                  <div>
                    <span className="font-bold text-slate-800 block line-clamp-1 truncate max-w-[170px]" title={srv.name}>{srv.name}</span>
                    <span className="text-[10px] text-indigo-600 font-mono">{srv.category} &bull; ${srv.pricePerThousand.toFixed(2)}/1k</span>
                  </div>

                  <button
                    onClick={() => onDeleteService(srv.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0"
                    title="Delete custom package"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
