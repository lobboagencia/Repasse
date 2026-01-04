
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Search, Loader2, AlertCircle, Hash, Gauge, 
  FileCheck, ShieldCheck, CameraIcon, ChevronRight, TrendingUp,
  Building2, Car, Calendar, Info, Layers
} from 'lucide-react';
import { FipeBrand, FipeModel, FipeYear, FipePrice, Vehicle } from '../types';
import { MOCK_USER } from '../constants';

interface CreateListingProps {
  onBack: () => void;
  onSuccess: (vehicle: Vehicle) => void;
}

const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1/carros';

const CreateListing: React.FC<CreateListingProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [plateLoading, setPlateLoading] = useState(false);
  const [plateIdentified, setPlateIdentified] = useState(false);
  const [plateType, setPlateType] = useState<'mercosul' | 'antiga' | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const [brands, setBrands] = useState<FipeBrand[]>([]);
  const [models, setModels] = useState<FipeModel[]>([]);
  const [years, setYears] = useState<FipeYear[]>([]);
  
  const [selection, setSelection] = useState({
    brand: '',
    modelId: '',
    yearId: '',
    plate: ''
  });

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    version: '',
    year: '',
    modelYear: '',
    km: '',
    price: '',
    fipe: '0',
    description: '',
    color: 'Prata',
    fuel: 'Flex',
    transmission: 'Automático',
    plate: '',
    reportStatus: 'pending' as 'verified' | 'pending' | 'none'
  });

  const plateInputRef = useRef<HTMLInputElement>(null);

  // Carrega marcas da FIPE no início
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${FIPE_BASE_URL}/marcas`);
        const data = await res.json();
        setBrands(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro FIPE Marcas');
      }
    };
    fetchBrands();
  }, []);

  // Busca modelos quando a marca muda
  useEffect(() => {
    if (!selection.brand) {
      setModels([]);
      return;
    }
    const fetchModels = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${FIPE_BASE_URL}/marcas/${selection.brand}/modelos`);
        const data = await res.json();
        setModels(Array.isArray(data.modelos) ? data.modelos : []);
      } catch (err) {
        setModels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, [selection.brand]);

  // Busca anos quando o modelo muda
  useEffect(() => {
    if (!selection.modelId || !selection.brand) {
      setYears([]);
      return;
    }
    const fetchYears = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${FIPE_BASE_URL}/marcas/${selection.brand}/modelos/${selection.modelId}/anos`);
        const data = await res.json();
        setYears(Array.isArray(data) ? data : []);
      } catch (err) {
        setYears([]);
      } finally {
        setLoading(false);
      }
    };
    fetchYears();
  }, [selection.modelId]);

  // Busca preço FIPE
  useEffect(() => {
    if (!selection.yearId || !selection.modelId || !selection.brand) return;
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${FIPE_BASE_URL}/marcas/${selection.brand}/modelos/${selection.modelId}/anos/${selection.yearId}`);
        const data: FipePrice = await res.json();
        
        if (data && data.Valor) {
          const priceVal = parseFloat(data.Valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
          setFormData(prev => ({ 
            ...prev, 
            fipe: priceVal.toString(),
            price: prev.price || (priceVal * 0.9).toFixed(0),
            year: data.AnoModelo.toString(),
            modelYear: data.AnoModelo.toString(),
            fuel: data.Combustivel,
            version: data.Modelo,
            make: data.Marca,
            model: data.Modelo
          }));
        }
      } catch (err) {
        console.error('Erro preço FIPE');
      } finally {
        setLoading(false);
      }
    };
    fetchPrice();
  }, [selection.yearId]);

  const normalize = (s: string) => {
    if (!s) return "";
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  };

  const handlePlateSearch = async () => {
    const rawPlate = selection.plate.toUpperCase().trim();
    const cleanPlate = rawPlate.replace(/[^A-Z0-9]/g, '');
    
    if (cleanPlate.length < 7) {
      setSearchError("A placa deve ter pelo menos 7 caracteres.");
      return;
    }
    
    setPlateLoading(true);
    setSearchError(null);
    setPlateIdentified(false);

    try {
      const res = await fetch('/api/vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placa: cleanPlate })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Placa não localizada no banco de dados.");
      }

      const vehicle = result.body || result; 
      
      const marcaApi = vehicle.marca || vehicle.brand || "";
      const modeloApi = vehicle.modelo || vehicle.model || "";
      const anoApi = (vehicle.ano_modelo || vehicle.model_year || vehicle.ano || "").toString();
      const corApi = vehicle.cor || vehicle.color || "Prata";

      setFormData(prev => ({
        ...prev,
        plate: cleanPlate,
        color: corApi,
        make: marcaApi,
        model: modeloApi,
        year: anoApi,
        reportStatus: 'verified'
      }));

      setPlateIdentified(true);

      const foundBrand = brands.find(b => 
        normalize(b.nome).includes(normalize(marcaApi)) || 
        normalize(marcaApi).includes(normalize(b.nome))
      );
      
      if (foundBrand) {
        const brandCode = foundBrand.codigo;
        setSelection(prev => ({ ...prev, brand: brandCode }));
        
        const modelsRes = await fetch(`${FIPE_BASE_URL}/marcas/${brandCode}/modelos`);
        const modelsData = await modelsRes.json();
        const modelsList = Array.isArray(modelsData.modelos) ? modelsData.modelos : [];
        
        const foundModel = modelsList.find((m: FipeModel) => 
          normalize(m.nome).includes(normalize(modeloApi)) || 
          normalize(modeloApi).includes(normalize(m.nome))
        );
        
        if (foundModel) {
          const modelId = foundModel.codigo;
          setSelection(prev => ({ ...prev, modelId: modelId }));
          
          const yearsRes = await fetch(`${FIPE_BASE_URL}/marcas/${brandCode}/modelos/${modelId}/anos`);
          const yearsData = await yearsRes.json();
          const foundYear = (Array.isArray(yearsData) ? yearsData : []).find((y: FipeYear) => y.nome.includes(anoApi));
          
          if (foundYear) {
            setSelection(prev => ({ ...prev, yearId: foundYear.codigo }));
          }
        }
      }

      setTimeout(() => {
        document.getElementById('fipe-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (error: any) {
      console.error("Erro na busca por placa:", error);
      setSearchError(error.message || "Erro de conexão com o gateway de veículos.");
    } finally {
      setPlateLoading(false);
    }
  };

  const formatPlate = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length >= 4) {
      const isMercosul = /[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}/.test(clean) || (clean.length >= 5 && /[A-Z]/.test(clean[4]));
      setPlateType(isMercosul ? 'mercosul' : 'antiga');
      return isMercosul ? clean.slice(0, 7) : `${clean.slice(0, 3)}-${clean.slice(3, 7)}`;
    }
    setPlateType(null);
    return clean;
  };

  const isStep1Valid = formData.make !== '' && formData.model !== '' && formData.year !== '' && formData.km !== '';
  const isStep2Valid = formData.price !== '' && Number(formData.price) > 0;
  
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const fallbackImage = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop`;
      const newVehicle: Vehicle = {
        id: Math.random().toString(36).substr(2, 9),
        make: formData.make,
        model: formData.model,
        version: formData.version || formData.model,
        year: parseInt(formData.year),
        modelYear: parseInt(formData.modelYear) || parseInt(formData.year),
        km: parseInt(formData.km) || 0,
        price: parseFloat(formData.price),
        retailPrice: parseFloat(formData.fipe) || parseFloat(formData.price) * 1.1,
        city: 'São Paulo',
        state: 'SP',
        images: [fallbackImage],
        reportStatus: formData.reportStatus,
        dealer: MOCK_USER.dealership,
        dealerId: MOCK_USER.id,
        createdAt: new Date().toISOString(),
        fuel: formData.fuel,
        transmission: formData.transmission,
        color: formData.color
      };
      onSuccess(newVehicle);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col overflow-hidden animate-in fade-in duration-500">
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-50">
        <button onClick={onBack} className="p-3 bg-slate-50 text-slate-400 rounded-2xl transition-all active:scale-90"><X className="w-5 h-5" /></button>
        <div className="flex flex-col items-center">
           <div className="flex gap-1.5 mb-1.5">
             {[1, 2, 3].map(s => (
               <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-orange-600' : step > s ? 'w-4 bg-emerald-500' : 'w-4 bg-slate-100'}`} />
             ))}
           </div>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Passo {step} de 3</p>
        </div>
        <div className="w-11" />
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8 md:p-12 scroll-smooth">
        <div className="max-w-xl mx-auto space-y-10">
          {step === 1 && (
            <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-500">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Dados do Ativo</h2>
                  {plateType && (
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${plateType === 'mercosul' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                      Placa {plateType}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 font-medium">Insira a placa para consulta em base nacional.</p>
              </div>

              <div className="relative group">
                <div className={`bg-white border-4 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 ${plateIdentified ? 'border-emerald-500 ring-8 ring-emerald-50' : 'border-slate-900 focus-within:ring-8 focus-within:ring-blue-50'}`}>
                  <div className={`${plateIdentified ? 'bg-emerald-600' : 'bg-blue-600'} h-10 flex items-center justify-between px-6 transition-colors`}>
                    <span className="text-[9px] font-black text-white tracking-[0.2em] uppercase">Brasil</span>
                    <Hash className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="p-8 md:p-10 flex items-center justify-center bg-white relative">
                    <input 
                      ref={plateInputRef}
                      type="text" 
                      placeholder="ABC-1234"
                      maxLength={9}
                      className="w-full text-center text-5xl md:text-7xl font-black tracking-tight uppercase outline-none text-slate-900 placeholder:text-slate-100"
                      value={selection.plate}
                      onChange={(e) => {
                        const val = formatPlate(e.target.value);
                        setSelection({...selection, plate: val});
                        if (plateIdentified) setPlateIdentified(false);
                        if (searchError) setSearchError(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handlePlateSearch()}
                    />
                    {plateLoading && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest animate-pulse">Sincronizando Gateway...</p>
                      </div>
                    )}
                  </div>
                </div>

                {searchError && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
                    <p className="text-[10px] font-bold text-orange-700 uppercase leading-relaxed">{searchError}</p>
                  </div>
                )}

                {!plateIdentified && selection.plate.replace('-', '').length >= 7 && !plateLoading && (
                  <button onClick={handlePlateSearch} className="w-full mt-6 bg-slate-900 text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3">
                    <Search className="w-5 h-5" /> Consultar Placa
                  </button>
                )}
              </div>
              
              <div id="fipe-section" className={`space-y-6 transition-all duration-700 ${plateIdentified ? 'opacity-100 translate-y-0' : 'opacity-20 pointer-events-none translate-y-4'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 bg-orange-600 rounded-full"></div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Ficha de Procedência</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Marca Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-orange-200 transition-colors">
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Marca</label>
                      <input 
                        type="text" 
                        value={formData.make}
                        onChange={(e) => setFormData({...formData, make: e.target.value})}
                        className="w-full bg-transparent text-sm font-black text-slate-900 outline-none border-b border-transparent focus:border-orange-500 pb-1"
                        placeholder="Ex: Toyota"
                      />
                    </div>
                  </div>

                  {/* Ano Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-orange-200 transition-colors">
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Ano Modelo</label>
                      <input 
                        type="text" 
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full bg-transparent text-sm font-black text-slate-900 outline-none border-b border-transparent focus:border-orange-500 pb-1"
                        placeholder="Ex: 2023"
                      />
                    </div>
                  </div>

                  {/* Modelo Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-4 md:col-span-2 hover:border-orange-200 transition-colors">
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Modelo</label>
                      <input 
                        type="text" 
                        value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                        className="w-full bg-transparent text-sm font-black text-slate-900 outline-none border-b border-transparent focus:border-orange-500 pb-1"
                        placeholder="Ex: Corolla XEi"
                      />
                    </div>
                  </div>

                  {/* Versão Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-4 md:col-span-2 hover:border-orange-200 transition-colors">
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Versão / Pacote</label>
                      <input 
                        type="text" 
                        value={formData.version || formData.model}
                        onChange={(e) => setFormData({...formData, version: e.target.value})}
                        className="w-full bg-transparent text-sm font-black text-slate-900 outline-none border-b border-transparent focus:border-orange-500 pb-1"
                        placeholder="Ex: 2.0 Direct Shift Premium"
                      />
                    </div>
                  </div>

                  {/* KM Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-4 md:col-span-2 hover:border-orange-200 transition-colors">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <Gauge className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Quilometragem Atual</label>
                      <input 
                        type="number" 
                        inputMode="numeric"
                        value={formData.km}
                        onChange={(e) => setFormData({...formData, km: e.target.value})}
                        className="w-full bg-transparent text-sm font-black text-slate-900 outline-none border-b border-transparent focus:border-orange-500 pb-1"
                        placeholder="0 KM"
                      />
                    </div>
                  </div>
                </div>

                {plateIdentified && (
                  <div className="flex items-center gap-3 p-5 bg-emerald-50 rounded-3xl border border-emerald-100 mt-4 animate-in zoom-in-95 duration-500">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                    <p className="text-[10px] text-emerald-900/70 font-black leading-relaxed uppercase tracking-wider">Laudo Sincronizado: Os dados acima foram validados pelo gateway de procedência.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Valor de Repasse</h2>
                <p className="text-slate-500 font-medium">Defina sua margem para venda B2B rápida.</p>
              </div>
              <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
                <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Tabela FIPE (Ref)</p>
                    <p className="text-3xl font-black text-orange-900">
                      R$ {parseFloat(formData.fipe || "0").toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600 opacity-20" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Seu Valor de Venda</label>
                  <div className="relative group">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-200">R$</span>
                    <input 
                      type="number" 
                      inputMode="numeric" 
                      autoFocus 
                      className="w-full bg-white border border-slate-100 p-10 pl-20 rounded-[32px] text-5xl font-black text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all outline-none" 
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Finalização</h2>
                <p className="text-slate-500 font-medium">Fotos e status da cautelar.</p>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">Cautelar Sincronizada</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Vínculo com base oficial confirmado</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Exterior', 'Interior'].map((label) => (
                  <button key={label} className="aspect-square bg-white border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-2 hover:border-orange-400 transition-all hover:bg-orange-50/20 active:scale-95"><CameraIcon className="w-6 h-6 text-slate-300" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span></button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="h-28 bg-white border-t border-slate-100 flex items-center px-6 shrink-0 z-50">
        <div className="max-w-xl mx-auto w-full flex items-center gap-3">
          {step > 1 && (<button onClick={() => setStep(s => s - 1)} className="px-6 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95">Voltar</button>)}
          <button 
            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || loading || plateLoading} 
            onClick={() => step < 3 ? setStep(s => s + 1) : handleSubmit()} 
            className={`flex-1 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 ${((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid) || step === 3) && !loading && !plateLoading ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-300'}`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (<>{step === 3 ? 'Publicar Anúncio' : 'Próximo Passo'}<ChevronRight className="w-4 h-4" /></>)}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CreateListing;
