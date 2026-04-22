import React, { useMemo, useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Package, DollarSign, CheckCircle, Clock, Trash2, ArrowLeft, 
  Plus, User, Phone, Search, LayoutDashboard, List, Menu as MenuIcon, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MENU_ITEMS = [
  { id: 1, title: "Tok Classic", price: "59 tk", img: "/assets/tok classic.png" },
  { id: 2, title: "Creamy Tok", price: "99 tk", img: "/assets/creamy tok.png" },
  { id: 3, title: "Tok Boom", price: "35 tk", img: "/assets/tok boom.png" },
  { id: 4, title: "Tok Bowl", price: "49 tk", img: "/assets/tok bowl.png" }
];

import { Snowflake, RefreshCw } from 'lucide-react';

export default function Admin() {
  const { orders, updateOrderStatus, deleteOrder, clearAllOrders, addManualSale, systemConfig, toggleFreezeOrders } = useOrders();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showManualForm, setShowManualForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [manualCustomer, setManualCustomer] = useState({ name: '', phone: '' });
  const [manualItems, setManualItems] = useState([]);

  const stats = useMemo(() => {
    const totalSales = orders.reduce((acc, o) => acc + (o.totalAmount || o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
    
    const dailySales = orders.reduce((acc, o) => {
      const date = (o.createdAt || o.date || new Date().toISOString()).split('T')[0];
      acc[date] = (acc[date] || 0) + (o.totalAmount || o.total || 0);
      return acc;
    }, {});

    const chartData = Object.entries(dailySales)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);

    return { totalSales, pendingOrders, completedOrders, chartData };
  }, [orders]);

  const handleAddManualItem = (item) => {
    setManualItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveManualItem = (id) => {
    setManualItems(prev => prev.filter(i => i.id !== id));
  };

  const submitManualSale = (e) => {
    e.preventDefault();
    if (manualItems.length === 0) return;
    addManualSale(manualItems, manualCustomer);
    setManualItems([]);
    setManualCustomer({ name: '', phone: '' });
    setShowManualForm(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-[#0f1109] text-[var(--color-ivory)] font-body">
      {/* Sidebar / Mobile Nav */}
      <aside className={`fixed inset-y-0 left-0 z-[1000] w-64 bg-[#1b1f13] border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between lg:justify-start gap-3 px-2 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-gold)] flex items-center justify-center text-[var(--color-olive)] font-bold">T</div>
              <h2 className="text-xl font-heading font-bold tracking-tighter text-[var(--color-gold)]">TOKBOX HUB</h2>
            </div>
            <button onClick={toggleMobileMenu} className="lg:hidden p-2 opacity-50 hover:opacity-100">
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-1 space-y-2">
            <NavItem active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }} icon={<List size={18} />} label="Orders" />
          </nav>

          <div className="pt-6 border-t border-white/5">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all opacity-60 hover:opacity-100 text-sm">
              <ArrowLeft size={18} />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-[#1b1f13] border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-[900]">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-[var(--color-gold)] flex items-center justify-center text-[var(--color-olive)] text-[10px] font-bold">T</div>
             <span className="font-heading font-bold text-[var(--color-gold)] text-sm tracking-tighter">TOKBOX HUB</span>
          </div>
          <button onClick={toggleMobileMenu} className="p-2 opacity-60 hover:opacity-100">
            <MenuIcon size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12">
          
          {activeTab === 'dashboard' && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-gold)]">Overview</h1>
                  <p className="opacity-50 mt-1 text-xs uppercase tracking-[0.2em]">Business Performance</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={toggleFreezeOrders}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all border ${
                      systemConfig.isOrdersFrozen 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                        : 'bg-white/5 text-[var(--color-ivory)] border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {systemConfig.isOrdersFrozen ? <RefreshCw size={18} className="animate-spin" /> : <Snowflake size={18} />}
                    <span>{systemConfig.isOrdersFrozen ? 'Unfreeze Orders' : 'Freeze Orders'}</span>
                  </button>
                  <button 
                    onClick={() => setShowManualForm(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[var(--color-gold)] text-[var(--color-olive)] px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                  >
                    <Plus size={18} />
                    <span>Record Sale</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                <StatCard icon={<DollarSign />} label="Revenue" value={`৳ ${stats.totalSales}`} color="text-green-400" />
                <StatCard icon={<Package />} label="Total Orders" value={orders.length} color="text-blue-400" />
                <StatCard icon={<Clock />} label="Pending" value={stats.pendingOrders} color="text-yellow-400" />
                <StatCard icon={<CheckCircle />} label="Completed" value={stats.completedOrders} color="text-purple-400" />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                <div className="glass p-6 md:p-8 rounded-[32px] h-[350px] md:h-[400px]">
                  <h3 className="text-lg font-bold mb-6 md:mb-8">Revenue Analytics</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.chartData}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-gold)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--color-gold)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="date" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1b1f13', border: 'none', borderRadius: '16px' }} />
                      <Area type="monotone" dataKey="total" stroke="var(--color-gold)" fill="url(#colorTotal)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass p-6 md:p-8 rounded-[32px]">
                  <h3 className="text-lg font-bold mb-6 md:mb-8">Recent Activity</h3>
                  <div className="space-y-4 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {orders.slice(0, 8).map(order => (
                      <div key={order.id} className="flex justify-between items-center p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex gap-3 items-center min-w-0">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${order.status === 'delivered' || order.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                          <div className="truncate">
                            <p className="font-bold text-xs md:text-sm truncate">{order.customerName || order.customer?.name || 'Walk-in'}</p>
                            <p className="text-[9px] md:text-[10px] opacity-40 font-mono uppercase truncate">{order.id}</p>
                          </div>
                        </div>
                        <p className="text-[var(--color-gold)] font-bold text-sm ml-2 flex-shrink-0">৳ {order.totalAmount || order.total}</p>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-center opacity-30 italic text-sm py-8">No recent activity</p>}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-gold)]">Orders</h1>
                {orders.length > 0 && (
                  <button 
                    onClick={() => { if(window.confirm('Clear all history?')) clearAllOrders(); }}
                    className="text-xs text-red-400/60 hover:text-red-400 px-4 py-2 rounded-full border border-red-400/20 hover:bg-red-400/10 transition-all"
                  >
                    Clear All History
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {/* Mobile Order Cards */}
                {orders.map(order => (
                  <div key={order.id} className="glass p-5 rounded-3xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest">{order.id}</p>
                        <h4 className="font-bold mt-1">{order.customer.name}</h4>
                        <p className="text-xs opacity-50">{order.customer.phone}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-widest ${order.type === 'manual' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {order.type || 'online'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 py-2 border-y border-white/5">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-white/5 px-2 py-1 rounded-md opacity-60">
                          {item.quantity}x {item.title}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-[var(--color-gold)] font-bold">৳ {order.total}</p>
                      <div className="flex items-center gap-3">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button onClick={() => deleteOrder(order.id)} className="p-2 text-red-400/40 hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-center opacity-30 italic py-12">No orders found.</p>}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block glass rounded-[32px] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[10px] opacity-50 uppercase tracking-[0.2em]">
                        <th className="px-8 py-6">ID / Customer</th>
                        <th className="px-8 py-6">Items</th>
                        <th className="px-8 py-6">Channel</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6">Total</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-6">
                            <p className="font-bold">{order.customer.name}</p>
                            <p className="text-xs opacity-40 font-mono mt-1">{order.id}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-wrap gap-2">
                              {order.items.map((item, idx) => (
                                <span key={idx} className="text-[10px] bg-white/5 px-2 py-1 rounded-md opacity-60">
                                  {item.quantity}x {item.title}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`text-[10px] px-2 py-1 rounded-md uppercase tracking-widest ${order.type === 'manual' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                              {order.type || 'online'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-8 py-6 font-bold text-[var(--color-gold)]">৳ {order.total}</td>
                          <td className="px-8 py-6 text-right">
                            <button onClick={() => deleteOrder(order.id)} className="text-white/20 hover:text-red-400 p-2">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Manual Sale Modal - Fully Responsive */}
      {showManualForm && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowManualForm(false)} />
          <div className="relative w-full max-w-5xl h-[95vh] sm:h-auto sm:max-h-[90vh] glass rounded-[32px] sm:rounded-[40px] overflow-hidden flex flex-col">
            
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Menu Side */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto border-r border-white/5 custom-scrollbar">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl md:text-2xl font-heading font-bold">Menu</h3>
                  <div className="relative w-40 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                    <input className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs outline-none" placeholder="Search..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-4">
                  {MENU_ITEMS.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => handleAddManualItem(item)}
                      className="flex flex-col sm:flex-row items-center gap-3 p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[var(--color-gold)]/50 transition-all text-center sm:text-left group"
                    >
                      <img src={item.img} className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform" alt={item.title} />
                      <div className="min-w-0">
                        <p className="font-bold text-xs truncate">{item.title}</p>
                        <p className="text-[var(--color-gold)] text-[10px] font-bold">{item.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order/Checkout Side */}
              <div className="w-full lg:w-[400px] p-6 md:p-8 bg-black/40 flex flex-col overflow-hidden">
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-6">Checkout</h3>
                
                <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
                  {manualItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[var(--color-gold)] font-bold text-[10px]">{item.quantity}x</span>
                        <span className="text-xs truncate">{item.title}</span>
                      </div>
                      <button onClick={() => handleRemoveManualItem(item.id)} className="text-white/20 hover:text-red-400 ml-2">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {manualItems.length === 0 && <p className="text-center opacity-30 italic text-xs py-10">Cart is empty</p>}
                </div>

                <form onSubmit={submitManualSale} className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                    <input required value={manualCustomer.name} onChange={e => setManualCustomer({...manualCustomer, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-[var(--color-gold)]" placeholder="Name" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                    <input required value={manualCustomer.phone} onChange={e => setManualCustomer({...manualCustomer, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-[var(--color-gold)]" placeholder="Phone" />
                  </div>
                  <div className="pt-4 border-t border-white/5 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm opacity-50 uppercase tracking-widest">Total</span>
                      <span className="text-xl font-bold text-[var(--color-gold)]">৳ {manualItems.reduce((acc, i) => acc + (parseFloat(i.price) * i.quantity), 0)}</span>
                    </div>
                    <button type="submit" disabled={manualItems.length === 0} className="w-full bg-[var(--color-gold)] text-[var(--color-olive)] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                      Confirm Sale
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <button onClick={() => setShowManualForm(false)} className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 lg:hidden">
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[var(--color-gold)] text-[var(--color-olive)] font-bold shadow-lg' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}>
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="glass p-5 md:p-6 rounded-3xl space-y-4 border border-white/5">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 ${color}`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <p className="text-[9px] md:text-[10px] opacity-50 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-xl md:text-2xl font-heading font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}
