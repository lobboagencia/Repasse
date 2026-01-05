
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Car, MessageSquare, FileCheck, BarChart3, 
  Search, Bell, Menu, CreditCard, LogOut, ChevronRight, Zap, Trophy, Loader2 
} from 'lucide-react';

import DashboardContent from '../../pages/Dashboard';
import Marketplace from '../../pages/Marketplace';
import Inventory from '../../pages/Inventory';
import Favorites from '../../pages/Favorites';
import ChatHub from '../../pages/ChatHub';
import Plans from '../../pages/Plans';
import Reports from '../../pages/Reports';
import Analytics from '../../pages/Analytics';
import VehicleDetails from '../../pages/VehicleDetails';
import CreateListing from '../../pages/CreateListing';

import { INITIAL_USER, INITIAL_VEHICLES, INITIAL_REPORTS } from '../../constants';
import { Vehicle, Chat, Report, PlanType, User } from '../../types';

export default function DashboardShell() {
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Estados de dados locais (Sync com LocalStorage para demo/MVP)
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const savedVehicles = localStorage.getItem('repasseja_vehicles');
    const savedFavs = localStorage.getItem('repasseja_favorites');
    if (savedVehicles) setVehicles(JSON.parse(savedVehicles));
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  const navigateTo = (newTab: string) => {
    setActiveTab(newTab);
    setSidebarOpen(false);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const currentUserData: User = {
    ...INITIAL_USER,
    email: user?.email || '',
    name: user?.displayName || user?.email?.split('@')[0] || 'Lojista',
    id: user?.uid || ''
  };

  const renderContent = () => {
    if (activeTab === 'vehicle-details' && selectedVehicleId) {
      const v = vehicles.find(x => x.id === selectedVehicleId);
      if (!v) { navigateTo('marketplace'); return null; }
      return (
        <VehicleDetails 
          vehicle={v} 
          onBack={() => navigateTo('marketplace')} 
          onNegotiate={() => navigateTo('messages')}
          isFavorite={favorites.includes(v.id)}
          onToggleFavorite={() => {}}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard': return <DashboardContent onTriggerNotification={() => {}} onAddVehicle={() => navigateTo('add-vehicle')} onNavigate={navigateTo} vehicles={vehicles} currentUser={currentUserData} chatsCount={chats.length} />;
      case 'marketplace': return <Marketplace onSelectVehicle={(id) => { setSelectedVehicleId(id); navigateTo('vehicle-details'); }} vehicles={vehicles} />;
      case 'inventory': return <Inventory onAddVehicle={() => navigateTo('add-vehicle')} vehicles={vehicles.filter(v => v.dealerId === user?.uid)} />;
      case 'favorites': return <Favorites onSelectVehicle={(id) => { setSelectedVehicleId(id); navigateTo('vehicle-details'); }} vehicles={vehicles.filter(v => favorites.includes(v.id))} />;
      case 'add-vehicle': return <CreateListing onBack={() => navigateTo('inventory')} onSuccess={(v) => { setVehicles(prev => [v, ...prev]); navigateTo('inventory'); }} />;
      case 'messages': return <ChatHub currentUser={currentUserData} chats={chats} onUpdateChat={() => {}} onTriggerNotification={() => {}} />;
      case 'reports': return <Reports reports={reports} />;
      case 'analytics': return <Analytics vehicles={vehicles} />;
      case 'plans': return <Plans onSelectPlan={() => {}} currentPlan={PlanType.FREE} />;
      default: return <DashboardContent onTriggerNotification={() => {}} onAddVehicle={() => navigateTo('add-vehicle')} onNavigate={navigateTo} vehicles={vehicles} currentUser={currentUserData} chatsCount={chats.length} />;
    }
  };

  const isFullscreenView = ['vehicle-details', 'add-vehicle'].includes(activeTab);

  return (
    <div className="min-h-screen flex bg-white text-slate-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-[150] w-[280px] bg-white border-r border-slate-100 transform transition-transform duration-500 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="mb-12">
            <h1 className="text-lg font-black tracking-tighter">Repasse<span className="text-orange-600">Já</span></h1>
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
              <button key={item.id} onClick={() => navigateTo(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === item.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
                <item.icon className="w-4 h-4" /> {item.name}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-100 space-y-6">
            <button onClick={() => navigateTo('plans')} className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 hover:border-orange-200">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" /> Meu Plano
              </div>
              <ChevronRight className="w-3 h-3 opacity-50" />
            </button>
            
            <div className="flex items-center gap-4 px-2">
               <img src={`https://ui-avatars.com/api/?name=${user?.email}&background=f97316&color=fff`} className="w-10 h-10 rounded-xl" />
               <div className="flex-1 truncate">
                 <p className="text-[10px] font-black truncate">{user?.email}</p>
                 <button onClick={logout} className="text-[8px] text-red-500 font-black uppercase flex items-center gap-1"><LogOut className="w-2.5 h-2.5" /> Sair</button>
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
              <button className="relative p-2.5 rounded-xl text-slate-400">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="hidden sm:flex flex-col items-end leading-none">
                 <span className="text-[10px] font-black text-slate-900 uppercase">Minha Loja</span>
                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Plano Free</span>
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
}
