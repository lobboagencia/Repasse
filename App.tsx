
import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Car, MessageSquare, FileCheck, BarChart3, Search, Bell, Menu, CreditCard, X, Info, CheckCircle2, Zap, User as UserIcon, Loader2, LogOut, ChevronRight, Trophy } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Inventory from './pages/Inventory';
import Favorites from './pages/Favorites';
import ChatHub from './pages/ChatHub';
import Plans from './pages/Plans';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VehicleDetails from './pages/VehicleDetails';
import CreateListing from './pages/CreateListing';
import { MOCK_USER, MOCK_VEHICLES } from './constants';
import { Vehicle, Notification, User, Chat, Message } from './types';

const NotificationToast: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    proposal: <MessageSquare className="w-5 h-5 text-orange-600" />,
    counter: <Zap className="w-5 h-5 text-amber-600" />,
    status: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    system: <Info className="w-5 h-5 text-slate-600" />
  };

  return (
    <div className="fixed top-6 right-6 z-[200] w-[calc(100vw-48px)] md:w-80 bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl shadow-orange-900/5 border border-slate-100 p-5 flex gap-4 animate-in slide-in-from-right-8 duration-500 cursor-pointer hover:bg-white transition-all group" onClick={onClose}>
      <div className="shrink-0 p-3 bg-slate-50 rounded-xl group-hover:bg-orange-50 transition-colors">{icons[notification.type] || icons.system}</div>
      <div className="flex-1">
        <p className="text-sm font-extrabold text-slate-900">{notification.title}</p>
        <p className="text-xs text-slate-500 mt-1 leading-snug font-medium">{notification.message}</p>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-slate-100 rounded-lg shrink-0 h-fit">
        <X className="w-4 h-4 text-slate-300" />
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('repasseja_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('repasseja_vehicles');
    return saved ? JSON.parse(saved) : MOCK_VEHICLES;
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('repasseja_chats');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setIsSyncing(true);
    localStorage.setItem('repasseja_vehicles', JSON.stringify(vehicles));
    const timer = setTimeout(() => setIsSyncing(false), 800);
    return () => clearTimeout(timer);
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('repasseja_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('repasseja_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (vehicleId: string) => {
    setFavorites(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId) 
        : [...prev, vehicleId]
    );
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = { ...notif, id: Math.random().toString(36).substr(2, 9), timestamp: new Date(), read: false };
    setActiveToast(newNotif);
  };

  const navigateTo = (newTab: string) => {
    setActiveTab(newTab);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNegotiation = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    const existingChat = chats.find(c => c.vehicle.id === vehicleId);
    if (existingChat) { navigateTo('messages'); return; }
    const newChat: Chat = {
      id: Math.random().toString(36).substr(2, 9),
      participant: { id: vehicle.dealerId || 'dealer-id', name: vehicle.dealer, dealership: vehicle.dealer },
      vehicle: vehicle,
      messages: [],
      unreadCount: 0,
      updatedAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    navigateTo('messages');
  };

  const renderContent = () => {
    if (activeTab === 'vehicle-details' && selectedVehicleId) {
      const v = vehicles.find(x => x.id === selectedVehicleId);
      if (!v) { setActiveTab('marketplace'); return null; }
      return (
        <VehicleDetails 
          vehicle={v} 
          onBack={() => navigateTo('marketplace')} 
          onNegotiate={handleStartNegotiation}
          isFavorite={favorites.includes(v.id)}
          onToggleFavorite={() => toggleFavorite(v.id)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard': return (
        <Dashboard 
          onTriggerNotification={addNotification} 
          onAddVehicle={() => navigateTo('add-vehicle')} 
          onNavigate={navigateTo}
          vehicles={vehicles}
          currentUser={user}
          chatsCount={chats.length}
        />
      );
      case 'marketplace': return <Marketplace onSelectVehicle={(id) => { setSelectedVehicleId(id); navigateTo('vehicle-details'); }} vehicles={vehicles} />;
      case 'inventory': return <Inventory onAddVehicle={() => navigateTo('add-vehicle')} vehicles={vehicles.filter(v => v.dealerId === user.id)} />;
      case 'favorites': return <Favorites onSelectVehicle={(id) => { setSelectedVehicleId(id); navigateTo('vehicle-details'); }} vehicles={vehicles.filter(v => favorites.includes(v.id))} />;
      case 'add-vehicle': return <CreateListing onBack={() => navigateTo('inventory')} onSuccess={(v) => { setVehicles(prev => [v, ...prev]); navigateTo('inventory'); }} />;
      case 'messages': return <ChatHub currentUser={user} chats={chats} onUpdateChat={(id, msgs) => setChats(prev => prev.map(c => c.id === id ? {...c, messages: msgs} : c))} onTriggerNotification={addNotification} />;
      case 'reports': return <Reports />;
      case 'analytics': return <Analytics vehicles={vehicles} />;
      case 'plans': return <Plans />;
      default: return (
        <Dashboard 
          onTriggerNotification={addNotification} 
          onAddVehicle={() => navigateTo('add-vehicle')} 
          onNavigate={navigateTo}
          vehicles={vehicles}
          currentUser={user}
          chatsCount={chats.length}
        />
      );
    }
  };

  if (!isAuthenticated) {
    if (authView === 'forgot') return <ForgotPassword onBack={() => setAuthView('login')} />;
    if (authView === 'register') return <Register onRegister={() => setIsAuthenticated(true)} onLogin={() => setAuthView('login')} />;
    return <Login onLogin={() => setIsAuthenticated(true)} onForgotPassword={() => setAuthView('forgot')} onRegister={() => setAuthView('register')} />;
  }

  const isFullscreenView = ['vehicle-details', 'add-vehicle'].includes(activeTab);

  return (
    <div className="min-h-screen flex bg-white text-slate-900 overflow-hidden">
      {activeToast && <NotificationToast notification={activeToast} onClose={() => setActiveToast(null)} />}
      
      <aside className={`fixed inset-y-0 left-0 z-[150] w-[280px] bg-white border-r border-slate-100 transform transition-transform duration-500 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="mb-12">
            <img 
              src="https://raw.githubusercontent.com/repasseja-club/assets/main/logo.png" 
              alt="RepasseJá.club" 
              className="h-10 w-auto" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<h1 class="text-lg font-black tracking-tighter">Repasse<span class="text-orange-600">Já</span></h1>';
              }}
            />
          </div>
          
          <nav className="flex-1 space-y-1">
            {[
              { id: 'dashboard', name: 'Visão Geral', icon: LayoutDashboard },
              { id: 'marketplace', name: 'Marketplace', icon: Search },
              { id: 'inventory', name: 'Estoque', icon: Car },
              { id: 'messages', name: 'Negociações', icon: MessageSquare },
              { id: 'favorites', name: 'Favoritos', icon: Trophy },
              { id: 'reports', name: 'Consultas', icon: FileCheck },
              { id: 'analytics', name: 'Estatística', icon: BarChart3 },
            ].map((item) => (
              <button key={item.id} onClick={() => navigateTo(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === item.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
                <item.icon className="w-4 h-4" /> {item.name}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-100 space-y-6">
            <button 
              onClick={() => navigateTo('plans')} 
              className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${activeTab === 'plans' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-200 hover:text-orange-600'}`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" /> Meu Plano
              </div>
              <ChevronRight className="w-3 h-3 opacity-50" />
            </button>
            
            <div className="flex items-center gap-4 px-2">
               <div className="relative">
                 <img src={user.avatar} className="w-10 h-10 rounded-xl shadow-sm border border-white" alt="" />
                 <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
               </div>
               <div className="flex-1 truncate">
                 <p className="text-[10px] font-black truncate text-slate-900 uppercase tracking-tight leading-none mb-1">{user.name}</p>
                 <button onClick={() => setIsAuthenticated(false)} className="text-[8px] text-slate-400 font-black uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-1">
                   <LogOut className="w-2.5 h-2.5" /> Sair da conta
                 </button>
               </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FBFBFC]">
        {!isFullscreenView && (
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 md:px-10 shrink-0 z-40">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 bg-white border border-slate-100 rounded-xl"><Menu className="w-5 h-5 text-slate-600" /></button>
            <div className="flex items-center gap-5 ml-auto">
              {isSyncing && <div className="flex items-center gap-2 text-slate-300 text-[8px] font-black uppercase animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> Atualizando</div>}
              <button className="relative p-2.5 rounded-xl text-slate-400 hover:text-orange-600 transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
              <div className="hidden sm:flex flex-col items-end leading-none">
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{user.dealership}</span>
                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Admin</span>
              </div>
            </div>
          </header>
        )}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-[1440px] mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default App;
