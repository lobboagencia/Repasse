
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Download, Activity, TrendingUp, ArrowUpRight, BarChart3 } from 'lucide-react';
import { Vehicle } from '../types';

const COLORS = ['#f97316', '#10b981', '#f59e0b', '#ef4444'];

interface AnalyticsProps {
  vehicles: Vehicle[];
}

const Analytics: React.FC<AnalyticsProps> = ({ vehicles }) => {
  // Funil dinâmico baseado no estoque real (Placeholder para integração futura de leads)
  const funnelData = useMemo(() => {
    if (vehicles.length === 0) return [];
    return [
      { name: 'Estoque Total', value: vehicles.length },
      { name: 'Vistas (Simul.)', value: Math.floor(vehicles.length * 15.5) },
      { name: 'Interesse', value: Math.floor(vehicles.length * 2.1) },
      { name: 'Propostas', value: 0 },
      { name: 'Vendas', value: 0 },
    ];
  }, [vehicles]);

  const stockMix = useMemo(() => {
    if (vehicles.length === 0) return [];
    
    const categories: Record<string, number> = {
      'SUVs': 0,
      'Sedans': 0,
      'Hatches': 0,
      'Outros': 0
    };

    const keywords = {
      'SUVs': ['compass', 'renegade', 'hr-v', 'creta', 't-cross', 'sw4', 'tracker'],
      'Sedans': ['corolla', 'civic', 'city', 'virtus', 'cronos', 'onix plus', 'jetta'],
      'Hatches': ['golf', 'hb20', 'onix', 'polo', 'argo', 'mobi', 'kwid']
    };

    vehicles.forEach(v => {
      const model = v.model.toLowerCase();
      let found = false;
      for (const [cat, kws] of Object.entries(keywords)) {
        if (kws.some(kw => model.includes(kw))) {
          categories[cat]++;
          found = true;
          break;
        }
      }
      if (!found) categories['Outros']++;
    });

    return Object.entries(categories)
      .filter(([_, val]) => val > 0)
      .map(([name, value]) => ({ 
        name, 
        value: Math.round((value / vehicles.length) * 100),
        raw: value 
      }));
  }, [vehicles]);

  const ticketMedio = useMemo(() => {
    if (vehicles.length === 0) return 0;
    return vehicles.reduce((acc, v) => acc + v.price, 0) / vehicles.length;
  }, [vehicles]);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Estatística</h2>
          </div>
          <p className="text-slate-500 text-sm md:text-base font-medium ml-5 md:ml-6">Métricas de conversão e tendências baseadas no seu pátio real.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-[20px] shadow-sm border border-slate-100">
           <button className="px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all bg-slate-900 text-white shadow-lg">30 Dias</button>
           <button className="px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all text-slate-400 hover:text-slate-900">90 Dias</button>
           <button className="p-2.5 text-slate-400 hover:text-orange-600 transition-colors border-l border-slate-100 ml-2">
             <Download className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm min-h-[450px] flex flex-col">
           <div className="flex items-center justify-between mb-12">
             <div>
               <h3 className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em] mb-1">Fluxo de Operação</h3>
               <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">Funil de Conversão</p>
             </div>
             {funnelData.length > 0 && <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">Dados em Tempo Real</span>}
           </div>
           
           <div className="flex-1">
             {funnelData.length > 0 ? (
               <div className="h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart layout="vertical" data={funnelData} margin={{ left: 40 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 11, fontWeight: 800}} />
                     <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)'}} />
                     <Bar dataKey="value" fill="#f97316" radius={[0, 16, 16, 0]} barSize={32} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <BarChart3 className="w-12 h-12 text-slate-100 mb-4" />
                  <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Aguardando dados de mercado</p>
               </div>
             )}
           </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col">
           <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-12">Mix de Estoque</h3>
           <div className="flex-1 flex flex-col">
             {stockMix.length > 0 ? (
               <>
                 <div className="h-[280px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={stockMix}
                         cx="50%" cy="50%"
                         innerRadius={70}
                         outerRadius={100}
                         paddingAngle={8}
                         dataKey="value"
                       >
                         {stockMix.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                       </Pie>
                       <Tooltip 
                         contentStyle={{borderRadius: '20px', border: 'none', padding: '12px'}}
                         itemStyle={{fontWeight: 900, textTransform: 'uppercase', fontSize: '10px'}}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="space-y-4 mt-6">
                    {stockMix.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full`} style={{backgroundColor: COLORS[i % COLORS.length]}}></div> 
                          {item.name}
                        </span>
                        <span className="text-slate-900">{item.value}%</span>
                      </div>
                    ))}
                 </div>
               </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <Activity className="w-12 h-12 text-slate-100 mb-4" />
                  <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Sem veículos no pátio</p>
               </div>
             )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden group">
           <Activity className="absolute -right-8 -top-8 w-32 h-32 text-white/5 group-hover:scale-125 transition-transform duration-1000" />
           <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-6">Mesa de Inteligência</p>
           <h4 className="text-lg font-black tracking-tight mb-4">{vehicles.length > 0 ? 'Analisando seu Pátio' : 'Inicie seu Estoque'}</h4>
           <p className="text-xs text-slate-400 font-medium leading-relaxed">
             {vehicles.length > 0 ? `Seu ticket médio de R$ ${ticketMedio.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} indica foco em veículos de médio porte.` : 'Adicione veículos para que possamos analisar sua performance de giro.'}
           </p>
        </div>
        
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
             <TrendingUp className="w-8 h-8 text-emerald-600 mb-8" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ticket Médio</p>
             <h4 className="text-2xl font-black text-slate-900 tracking-tighter">
               {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
               <span className="text-[0.65em] opacity-70">,00</span>
             </h4>
           </div>
           <div className="flex items-center gap-2 text-emerald-600 text-[9px] font-black uppercase mt-6">
             <ArrowUpRight className="w-3.5 h-3.5" /> Atualizado Agora
           </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
             <Activity className="w-8 h-8 text-orange-600 mb-8" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engajamento de Rede</p>
             <h4 className="text-2xl font-black text-slate-900 tracking-tighter">0.0</h4>
           </div>
           <p className="text-slate-300 text-[9px] font-black uppercase mt-6">Aguardando interações</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
