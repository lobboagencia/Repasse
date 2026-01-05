
import React, { useMemo } from 'react';
import { Car, Search, MessageSquare, FileCheck, Plus, Calendar, Zap, LayoutPanelLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Notification, Vehicle, User, PlanType } from '../types';

interface DashboardProps {
  onTriggerNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  onAddVehicle: () => void;
  onNavigate: (tab: string) => void;
  vehicles: Vehicle[];
  currentUser: User;
  chatsCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onAddVehicle, 
  onNavigate,
  vehicles, 
  currentUser,
  chatsCount
}) => {
  const stats = useMemo(() => {
    const totalOportunidades = vehicles.length;
    const meuEstoque = vehicles.filter(v => v.dealerId === currentUser.id).length;
    const consultaLimit = currentUser.plan === PlanType.PREMIUM ? '∞' : currentUser.plan === PlanType.PRO ? '15' : '3';
    
    return {
      oportunidades: totalOportunidades.toString(),
      estoque: meuEstoque.toString(),
      negociacoes: chatsCount.toString(),
      consultas: `0/${consultaLimit}`
    };
  }, [vehicles, currentUser.id, chatsCount, currentUser.plan]);

  // Gráfico agora inicia vazio ou reflete atividade real
  const chartData = useMemo(() => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return days.map((day, idx) => ({
      name: day,
      // Se não houver atividade, mostra 0. Se houver, distribui uma parte (apenas para visual)
      propostas: chatsCount > 0 && idx === new Date().getDay() - 1 ? chatsCount : 0
    }));
  }, [chatsCount]);

  const cards = [
    { label: 'Oportunidades', shortLabel: 'Oportun.', value: stats.oportunidades, icon: Search, color: 'text-orange-600', bg: 'bg-orange-50', tab: 'marketplace' },
    { label: 'Meu Estoque', shortLabel: 'Estoque', value: stats.estoque, icon: Car, color: 'text-slate-900', bg: 'bg-slate-100', tab: 'inventory' },
    { label: 'Negociações', shortLabel: 'Negoc.', value: stats.negociacoes, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50', tab: 'messages' },
    { label: 'Consultas', shortLabel: 'Consultas', value: stats.consultas, icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', tab: 'reports' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Painel de Controle</h2>
          </div>
          <p className="text-slate-500 text-sm md:text-base font-medium ml-5 md:ml-6">Bem-vindo, {currentUser.name || 'Lojista'}. Gerencie sua liquidez B2B.</p>
        </div>
        <button onClick={onAddVehicle} className="bg-orange-600 text-white px-8 py-4 rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 active:scale-95 flex items-center gap-3">
          <Plus className="w-5 h-5" /> Novo Repasse
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-6">
        {cards.map((stat, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(stat.tab)}
            className="bg-white p-3 md:p-8 rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col text-left active:scale-95 overflow-hidden"
          >
            <div className={`w-8 h-8 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3 md:mb-8 group-hover:scale-110 transition-transform shrink-0`}>
               <stat.icon className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="space-y-0.5 md:space-y-2">
              <p className="text-slate-400 text-[7px] md:text-[10px] font-black uppercase tracking-widest leading-none truncate">
                <span className="hidden md:inline">{stat.label}</span>
                <span className="md:hidden">{stat.shortLabel}</span>
              </p>
              <h3 className="text-xs md:text-2xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em] mb-1">Performance Semanal</h3>
              <p className="text-xl font-black text-slate-900 tracking-tighter">Volume de Negociações</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tempo Real</span>
            </div>
          </div>
          <div className="h-[300px]">
            {chatsCount > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 11, fontWeight: 800}} />
                  <Tooltip 
                    cursor={{stroke: '#f97316', strokeWidth: 2, strokeDasharray: '4 4'}}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px'}}
                    labelStyle={{fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px'}}
                  />
                  <Area type="monotone" dataKey="propostas" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorPro)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                 <LayoutPanelLeft className="w-12 h-12 text-slate-100" />
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Aguardando primeiras negociações</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden group">
            <div className="relative z-10">
              <Zap className="w-10 h-10 text-orange-400 mb-8" />
              <h3 className="text-xl font-black tracking-tight mb-3">Upgrade Pro</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">Libere anúncios ilimitados e selo de verificação para sua loja.</p>
              <button onClick={() => onNavigate('plans')} className="mt-8 w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-orange-600 hover:text-white">Ver Planos</button>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/20 blur-[100px] rounded-full" />
          </div>

          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8">Atividade Recente</h3>
            <div className="text-center py-4 space-y-2">
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Nenhuma atividade</p>
               <p className="text-[9px] text-slate-300 font-medium">Seu histórico de negociações aparecerá aqui.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
