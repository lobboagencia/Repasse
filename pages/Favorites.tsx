
import React, { useState } from 'react';
import { Trophy, ArrowRight, Calendar, Gauge, X, Columns, Plus, Check } from 'lucide-react';
import { Vehicle } from '../types';

const CurrencyDisplay: React.FC<{ value: number }> = ({ value }) => {
  const formatted = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [int, dec] = formatted.split(',');
  return (
    <span>
      R$ {int}<span className="text-[0.7em] opacity-80 font-bold">,{dec}</span>
    </span>
  );
};

interface FavoritesProps {
  onSelectVehicle: (id: string) => void;
  vehicles: Vehicle[];
}

const Favorites: React.FC<FavoritesProps> = ({ onSelectVehicle, vehicles }) => {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const toggleCompare = (id: string) => {
    setCompareList(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const selectedForComparison = vehicles.filter(v => compareList.includes(v.id));

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Favoritos</h2>
          </div>
          <p className="text-slate-500 text-sm md:text-base font-medium ml-5 md:ml-6">Sua garagem de negociações estratégicas.</p>
        </div>
        {compareList.length >= 2 && (
          <button 
            onClick={() => setIsComparing(true)}
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-orange-600 shadow-xl transition-all active:scale-95"
          >
            <Columns className="w-5 h-5" /> Comparar ({compareList.length})
          </button>
        )}
      </div>

      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map(v => (
            <div key={v.id} className="group relative bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="absolute top-4 left-4 z-10">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleCompare(v.id); }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    compareList.includes(v.id) 
                      ? 'bg-orange-600 border-orange-600 text-white' 
                      : 'bg-white/80 backdrop-blur-md border-white/20 text-slate-400'
                  }`}
                >
                  {compareList.includes(v.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>

              <div className="aspect-[4/3] m-2 rounded-[24px] overflow-hidden cursor-pointer" onClick={() => onSelectVehicle(v.id)}>
                <img src={v.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                {(v.retailPrice - v.price) > 0 && (
                  <div className="absolute bottom-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white px-3 py-2 rounded-2xl flex items-center gap-1 shadow-lg border border-white/10">
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-80 mr-0.5">Margem:</span>
                    <Plus className="w-2.5 h-2.5 stroke-[4px]" />
                    <span className="text-[10px] font-black leading-none tracking-tight">
                      R$ {(v.retailPrice - v.price).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-orange-600 tracking-widest">{v.make}</span>
                  <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight">{v.model}</h3>
                  <p className="text-[10px] font-bold text-slate-400 truncate uppercase">{v.version}</p>
                </div>

                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 opacity-50" />
                    <span className="text-[10px] font-black uppercase">{v.year}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 opacity-50" />
                    <span className="text-[10px] font-black uppercase">{v.km.toLocaleString('pt-BR')} KM</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Repasse</p>
                    <p className="text-base font-black text-slate-900 leading-none">
                      <CurrencyDisplay value={v.price} />
                    </p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">
                      FIPE: R$ {v.retailPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <button onClick={() => onSelectVehicle(v.id)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-6 bg-white rounded-[40px] border border-slate-100">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <Trophy className="w-8 h-8 fill-current opacity-20" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">Sua garagem está vazia</h3>
            <p className="text-slate-400 text-sm font-medium">Favorite veículos para monitorar o mercado e comparar ofertas.</p>
          </div>
        </div>
      )}

      {isComparing && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-orange-600 rounded-full"></div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Comparativo de Ativos</h3>
               </div>
               <button onClick={() => setIsComparing(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl active:scale-90 transition-all">
                 <X className="w-5 h-5" />
               </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Atributo</th>
                      {selectedForComparison.map(v => (
                        <th key={v.id} className="p-8 min-w-[250px]">
                           <div className="flex items-center gap-4">
                              <img src={v.images[0]} className="w-16 h-12 rounded-xl object-cover shadow-sm" alt="" />
                              <div className="flex-1">
                                <p className="text-xs font-black text-slate-900 leading-tight truncate">{v.model}</p>
                                <p className="text-[9px] font-bold text-slate-400 truncate uppercase mt-0.5">{v.make}</p>
                              </div>
                           </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { label: 'Repasse', key: 'price', format: (v: Vehicle) => <CurrencyDisplay value={v.price} /> },
                      { label: 'Margem Bruta', key: 'margin', format: (v: Vehicle) => <span className="text-emerald-600 font-black"><CurrencyDisplay value={v.retailPrice - v.price} /></span> },
                      { label: 'FIPE', key: 'retailPrice', format: (v: Vehicle) => <CurrencyDisplay value={v.retailPrice} /> },
                      { label: 'KM', key: 'km', format: (v: Vehicle) => `${v.km.toLocaleString('pt-BR')} km` },
                      { label: 'Ano', key: 'year', format: (v: Vehicle) => `${v.year}/${v.modelYear || v.year}` },
                      { label: 'Combustível', key: 'fuel', format: (v: Vehicle) => v.fuel || 'Flex' },
                      { label: 'Transmissão', key: 'transmission', format: (v: Vehicle) => v.transmission || 'Auto' },
                      { label: 'Cor', key: 'color', format: (v: Vehicle) => v.color || 'Prata' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-white sticky left-0">{row.label}</td>
                        {selectedForComparison.map(v => (
                          <td key={v.id} className="p-8 text-sm font-black text-slate-800">
                            {row.format(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 text-center shrink-0">
               <p className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-md mx-auto">
                 O comparativo técnico auxilia na decisão de liquidez, permitindo identificar qual ativo possui o melhor custo-benefício para seu pátio.
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
