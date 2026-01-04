
import React from 'react';
import { 
  ArrowLeft, MapPin, Gauge, Calendar, 
  Fuel, Settings as Gear, ShieldCheck, ChevronRight,
  MessageSquare, DollarSign, UserCheck, Check, Info, Zap, Trophy, Plus
} from 'lucide-react';
import { Vehicle } from '../types';

const CurrencyDisplay: React.FC<{ value: number; light?: boolean }> = ({ value, light }) => {
  const formatted = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [int, dec] = formatted.split(',');
  return (
    <span>
      R$ {int}<span className="text-[0.65em] opacity-70 font-bold">,{dec}</span>
    </span>
  );
};

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onBack: () => void;
  onNegotiate: (vehicleId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle, onBack, onNegotiate, isFavorite, onToggleFavorite }) => {
  const marginValue = vehicle.retailPrice - vehicle.price;

  return (
    <div className="animate-in slide-in-from-right duration-500 bg-[#F8FAFC] min-h-screen">
      {/* HEADER VISÍVEL E HIERÁRQUICO */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] px-4 md:px-10 py-4 flex items-center justify-between h-24 shadow-sm">
        <button 
          onClick={onBack} 
          className="p-3 bg-slate-50 text-slate-400 rounded-2xl transition-all active:scale-90 shrink-0 border border-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center text-center overflow-hidden flex-1 px-6 max-w-2xl">
          {/* Marca - Tag sutil */}
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-1">
            {vehicle.make}
          </span>
          
          {/* Modelo - Título Principal H1 */}
          <h1 className="text-xl md:text-2xl font-[900] text-slate-900 tracking-tighter uppercase leading-none truncate w-full">
            {vehicle.model}
          </h1>
          
          {/* Versão e Ano - Subtítulo H2/P */}
          <div className="flex items-center justify-center gap-2 mt-1 w-full opacity-60">
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-tight truncate">
              {vehicle.version}
            </p>
            <div className="w-1 h-1 bg-slate-300 rounded-full shrink-0" />
            <p className="text-[10px] md:text-xs font-black text-slate-700 tracking-tight shrink-0">
              ANO {vehicle.year}
            </p>
          </div>
        </div>

        {/* Botão de Favoritos à Direita na Barra de Topo */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={onToggleFavorite}
            className={`p-3 rounded-2xl border transition-all active:scale-90 flex items-center justify-center group ${
              isFavorite 
                ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/20' 
                : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-orange-600'
            }`}
          >
            <Trophy className={`w-5 h-5 transition-transform group-hover:scale-110 ${isFavorite ? 'fill-white/20' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32 md:pb-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-[4/3] md:aspect-video bg-slate-200 rounded-[40px] overflow-hidden shadow-2xl relative">
            <img src={vehicle.images[0]} className="w-full h-full object-cover" alt={vehicle.model} />
            
            {/* Localização sobre a Imagem */}
            <div className="absolute top-6 right-6">
               <div className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-md text-slate-700 rounded-2xl border border-white/20 shadow-xl">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-tight whitespace-nowrap">
                    {vehicle.city}/{vehicle.state || 'SP'}
                  </span>
               </div>
            </div>

            <div className="absolute bottom-6 left-6 flex gap-2">
              <span className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">1 / {vehicle.images.length} Fotos</span>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: 'Ano', value: `${vehicle.year}/${vehicle.modelYear || vehicle.year}` },
                { icon: Gauge, label: 'KM', value: `${vehicle.km.toLocaleString('pt-BR')} KM` },
                { icon: Fuel, label: 'Combust.', value: vehicle.fuel || 'Flex' },
                { icon: Gear, label: 'Câmbio', value: vehicle.transmission || 'Automático' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600 mb-3">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-xs font-black text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-50 space-y-4">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Descrição do Repasse</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {vehicle.description || "Veículo selecionado para repasse B2B. Revisão em dia, documentação pronta para transferência. Ideal para lojistas que buscam giro rápido e procedência garantida."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[48px] p-8 md:p-10 text-white md:sticky md:top-32 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Valor de Repasse</p>
                 <p className="text-4xl font-black text-white tracking-tighter">
                   <CurrencyDisplay value={vehicle.price} />
                 </p>
                 <p className="text-sm font-bold text-slate-400">
                    FIPE: R$ {vehicle.retailPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                 </p>
                 {marginValue > 0 && (
                   <div className="pt-4">
                     <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-400/20 shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 w-fit">
                       <span className="opacity-80">Margem:</span>
                       <Plus className="w-3 h-3 stroke-[4px]" />
                       <span>R$ {marginValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                     </div>
                   </div>
                 )}
               </div>

               <div className="h-px bg-white/5 w-full" />

               <div className="space-y-4">
                  <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-xl font-black italic shadow-xl">
                      {vehicle.dealer.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Vendedor</p>
                      <p className="text-sm font-black truncate">{vehicle.dealer}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-orange-400">
                         <UserCheck className="w-3 h-3" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Verificado</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex flex-col gap-3">
                    <button 
                      onClick={() => onNegotiate(vehicle.id)}
                      className="w-full py-5 bg-orange-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-500 transition-all shadow-2xl shadow-orange-600/20"
                    >
                      <MessageSquare className="w-5 h-5" /> Negociar
                    </button>
                  </div>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 blur-[100px] rounded-full group-hover:bg-orange-600/20 transition-all duration-1000" />
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-start gap-4">
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Garantia de Liquidez</h4>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">Este lojista utiliza o <span className="text-orange-600 font-bold">RepasseSeguro</span>, garantindo a custódia do valor até a entrega do veículo.</p>
             </div>
          </div>
        </div>
      </div>

      {/* FOOTER MOBILE - CTA ÚNICO */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-2xl border-t border-slate-100 z-[100]">
        <button 
          onClick={() => onNegotiate(vehicle.id)}
          className="w-full py-5 bg-orange-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-orange-500/30 active:scale-95 transition-all"
        >
          <MessageSquare className="w-5 h-5" /> Negociar agora
        </button>
      </div>
    </div>
  );
};

export default VehicleDetails;
