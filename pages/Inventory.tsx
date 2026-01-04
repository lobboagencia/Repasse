
import React from 'react';
import { Plus, Eye, MessageSquare, Car, Calendar, Gauge, Trash2, Edit3 } from 'lucide-react';
import { Vehicle } from '../types';

const CurrencyDisplay: React.FC<{ value: number }> = ({ value }) => {
  const formatted = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [int, dec] = formatted.split(',');
  return (
    <span>
      R$ {int}<span className="text-[0.65em] opacity-70">,{dec}</span>
    </span>
  );
};

interface InventoryProps {
  onAddVehicle: () => void;
  vehicles: Vehicle[];
}

const Inventory: React.FC<InventoryProps> = ({ onAddVehicle, vehicles }) => {
  const totalStockValue = vehicles.reduce((acc, v) => acc + v.price, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Estoque</h2>
          </div>
          <p className="text-slate-500 text-sm md:text-base font-medium ml-5 md:ml-6">Gerencie seu estoque e acompanhe a liquidez dos ativos.</p>
        </div>
        <button 
          onClick={onAddVehicle}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Novo Anúncio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Valor em Estoque', value: <CurrencyDisplay value={totalStockValue} />, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Tempo Médio Giro', value: '8.2 dias', color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Negociações Ativas', value: '14', color: 'text-slate-900', bg: 'bg-white' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between`}>
            <div>
              <h4 className="text-slate-400 text-[10px] font-black uppercase mb-4 tracking-widest leading-none">{stat.label}</h4>
              <p className={`text-2xl md:text-3xl font-black ${stat.color} tracking-tighter leading-none`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-[40px] md:rounded-[48px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b border-slate-100 tracking-widest">
                <th className="px-10 py-6">Veículo</th>
                <th className="px-10 py-6">Valor Repasse</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-16 rounded-[20px] bg-slate-200 overflow-hidden shrink-0 shadow-inner">
                        <img src={v.images[0]} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 tracking-tight">{v.model}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg uppercase">{v.year}</span>
                           <span className="text-[10px] font-black text-slate-300">{v.km.toLocaleString('pt-BR')} KM</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-base font-black text-orange-600 leading-none">
                       {v.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">
                      FIPE: {v.retailPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100">Ativo</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 text-slate-300 hover:text-orange-600 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100"><Edit3 className="w-5 h-5" /></button>
                      <button className="p-3 text-slate-300 hover:text-red-600 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
