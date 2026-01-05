
"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Car, MessageSquare, FileCheck, BarChart3, 
  Search, Bell, Menu, CreditCard, LogOut, ChevronRight, Zap 
} from 'lucide-react';
import DashboardContent from '../../pages/Dashboard';
import { INITIAL_USER, INITIAL_VEHICLES } from '../../constants';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex bg-[#FBFBFC]">
      {/* Sidebar Simples para Exemplo */}
      <aside className="w-[280px] bg-white border-r border-slate-100 hidden lg:flex flex-col p-8">
        <div className="mb-12">
          <h1 className="text-lg font-black tracking-tighter">Repasse<span className="text-orange-600">Já</span></h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase bg-slate-900 text-white rounded-xl">
            <LayoutDashboard className="w-4 h-4" /> Visão Geral
          </button>
          {/* Outros botões aqui... */}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-100 space-y-6">
          <div className="flex items-center gap-4">
             <img src={`https://ui-avatars.com/api/?name=${user?.email}&background=f97316&color=fff`} className="w-10 h-10 rounded-xl" />
             <div className="flex-1 truncate">
               <p className="text-[10px] font-black truncate">{user?.email}</p>
               <button onClick={logout} className="text-[8px] text-red-500 font-black uppercase">Sair</button>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        {/* Usamos o componente Dashboard original limpando os mocks conforme sua solicitação anterior */}
        <DashboardContent 
          onTriggerNotification={() => {}}
          onAddVehicle={() => {}}
          onNavigate={() => {}}
          vehicles={[]}
          currentUser={{...INITIAL_USER, email: user?.email || '', name: user?.email?.split('@')[0] || ''}}
          chatsCount={0}
        />
      </main>
    </div>
  );
}
