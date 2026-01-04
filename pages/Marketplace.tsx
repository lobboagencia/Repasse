
import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, ArrowRight, Calendar, Gauge, SlidersHorizontal, X, Info, Plus } from 'lucide-react';
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

const VehicleCard: React.FC<{ vehicle: Vehicle; onSelect: (id: string) => void }> = ({ vehicle, onSelect }) => {
  // Lógica de Margem Real em Dinheiro
  const marginValue = vehicle.retailPrice - vehicle.price;

  return (
    <div className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500 flex flex-col relative">
      <div className="relative aspect-[4/3] cursor-pointer overflow-hidden m-2 rounded-[24px]" onClick={() => onSelect(vehicle.id)}>
        <img src={vehicle.images[0]} alt={vehicle.model} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/20 shadow-sm">
          <div className={`w-2 h-2 rounded-full ${vehicle.reportStatus === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-800">
            {vehicle.reportStatus === 'verified' ? 'Cautelar OK' : 'Aguardando'}
          </span>
        </div>
        {marginValue > 0 && (
          <div className="absolute bottom-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white px-3 py-2 rounded-2xl flex items-center gap-1 shadow-lg border border-white/10">
             <span className="text-[8px] font-black uppercase tracking-tighter opacity-80 mr-0.5">Margem:</span>
             <Plus className="w-2.5 h-2.5 stroke-[4px]" />
             <span className="text-[10px] font-black leading-none tracking-tight">
               R$ {marginValue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
             </span>
          </div>
        )}
      </div>
      <div className="p-6 pt-2 space-y-4 flex-1 flex flex-col">
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600">{vehicle.make}</span>
            <span className="text-[9px] font-black text-slate-300 uppercase">{vehicle.city}</span>
          </div>
          <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight group-hover:text-orange-600 transition-colors">{vehicle.model}</h3>
          <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-wide">{vehicle.version}</p>
        </div>
        
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 opacity-50" />
            <span className="text-[10px] font-black uppercase">{vehicle.year}</span>
          </div>
          <div className="w-1 h-1 bg-slate-100 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 opacity-50" />
            <span className="text-[10px] font-black uppercase">{vehicle.km.toLocaleString('pt-BR')} KM</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Valor Repasse</p>
            <p className="text-base font-black text-slate-900 leading-none">
              <CurrencyDisplay value={vehicle.price} />
            </p>
            <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">
              FIPE: R$ {vehicle.retailPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button onClick={() => onSelect(vehicle.id)} className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-sm">
             <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Marketplace: React.FC<{ onSelectVehicle: (id: string) => void; vehicles: Vehicle[] }> = ({ onSelectVehicle, vehicles }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFiltersPopup, setShowFiltersPopup] = useState(false);

  const categories = ['Todos', 'Sedans', 'SUVs', 'Hatches', 'Picapes', 'Premium', 'Utilitários', 'Motos'];

  const categoryKeywords: Record<string, string[]> = {
    'Sedans': ['corolla', 'civic', 'city', 'virtus', 'cronos', 'onix plus', 'jetta', 'sentra', 'cruze'],
    'SUVs': ['compass', 'renegade', 'hr-v', 'creta', 't-cross', 'nivus', 'kicks', 'tracker', 'equinox', 'sw4'],
    'Hatches': ['golf', 'hb20', 'onix', 'polo', 'argo', 'mobi', 'kwid', 'sandero', '208', 'yaris'],
    'Picapes': ['hilux', 's10', 'ranger', 'amarok', 'toro', 'strada', 'saveiro', 'frontier', 'l200'],
    'Premium': ['bmw', 'mercedes', 'audi', 'porsche', 'land rover', 'volvo', 'mustang', 'camaro'],
    'Utilitários': ['fiorino', 'master', 'ducato', 'hr', 'daily', 'sprinter', 'expert'],
    'Motos': ['honda', 'yamaha', 'bmw motorrad', 'harley', 'triumph', 'kawasaki']
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const modelLower = v.model.toLowerCase();
      const makeLower = v.make.toLowerCase();
      const fullTerm = `${makeLower} ${modelLower} ${v.version?.toLowerCase() || ''}`;
      
      const searchMatch = !search || fullTerm.includes(search.toLowerCase());
      
      let catMatch = filter === 'Todos';
      if (!catMatch && categoryKeywords[filter]) {
        catMatch = categoryKeywords[filter].some(kw => fullTerm.includes(kw));
      }
      
      const minP = minPrice ? parseFloat(minPrice) : 0;
      const maxP = maxPrice ? parseFloat(maxPrice) : Infinity;
      const priceMatch = v.price >= minP && v.price <= maxP;

      return searchMatch && catMatch && priceMatch;
    });
  }, [search, filter, vehicles, minPrice, maxPrice]);

  const CategorySlide = () => (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 flex-nowrap scroll-smooth">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap border shrink-0 ${filter === cat ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-200 hover:text-orange-900'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <button 
        onClick={() => setShowFiltersPopup(true)}
        className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-600 cursor-pointer shadow-sm active:scale-90 transition-all shrink-0 ml-2"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Marketplace</h2>
            </div>
            <p className="text-slate-500 text-sm md:text-base font-medium ml-5 md:ml-6">Ativos verificados com alta margem para o seu pátio.</p>
          </div>
          
          <div className="hidden lg:flex flex-1 max-w-2xl justify-end">
            <CategorySlide />
          </div>
        </div>

        <div className="relative group w-full lg:max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Pesquisar por marca ou modelo..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-slate-200"
          />
        </div>

        <div className="lg:hidden">
          <CategorySlide />
        </div>
      </div>

      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map(v => <VehicleCard key={v.id} vehicle={v} onSelect={onSelectVehicle} />)}
        </div>
      ) : (
        <div className="py-24 text-center space-y-6 bg-white rounded-[40px] border border-slate-50">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">Nenhum veículo encontrado</h3>
            <p className="text-slate-400 text-sm font-medium">Tente ajustar seus termos de busca.</p>
          </div>
          <button onClick={() => {setSearch(''); setFilter('Todos'); setMinPrice(''); setMaxPrice('');}} className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
            <RotateCcw className="w-4 h-4 inline mr-2" /> Resetar
          </button>
        </div>
      )}

      {showFiltersPopup && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-t-[40px] md:rounded-[48px] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom md:zoom-in-95 duration-500 overflow-y-auto max-h-[90vh]">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-orange-600 rounded-full"></div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Filtros Avançados</h3>
               </div>
               <button onClick={() => setShowFiltersPopup(false)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl active:scale-90 transition-all">
                 <X className="w-5 h-5" />
               </button>
             </div>

             <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faixa de Preço</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Preço Mínimo</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">R$</span>
                        <input 
                          type="number" 
                          inputMode="numeric"
                          min="0"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-orange-50" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Preço Máximo</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">R$</span>
                        <input 
                          type="number" 
                          inputMode="numeric"
                          min="0"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-orange-50" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedência</p>
                  <div className="flex flex-wrap gap-2">
                    {['Cautelar OK', 'Único Dono', 'IPVA Pago', 'Garantia Fábrica'].map(tag => (
                      <button key={tag} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-600 transition-all">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                   <Info className="w-5 h-5 text-orange-600 shrink-0" />
                   <p className="text-[10px] text-orange-900/70 font-bold leading-relaxed">Os filtros ajudam a encontrar ativos com a liquidez certa para o seu pátio.</p>
                </div>
             </div>

             <div className="flex gap-3">
                <button onClick={() => {setMinPrice(''); setMaxPrice(''); setShowFiltersPopup(false);}} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Limpar</button>
                <button onClick={() => setShowFiltersPopup(false)} className="flex-2 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all px-12">Aplicar Filtros</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
