
import React from 'react';
import { Check, Star, Shield, Zap, TrendingUp, Users } from 'lucide-react';
import { PlanType } from '../types';

interface PlansProps {
  onSelectPlan: (plan: any) => void;
  currentPlan: PlanType;
}

const Plans: React.FC<PlansProps> = ({ onSelectPlan, currentPlan }) => {
  const plans = [
    {
      name: 'Free', price: 'R$ 0', description: 'Para quem está começando no repasse.',
      features: ['Até 3 anúncios simultâneos', 'Chat básico', 'Marketplace B2B', 'Notificações'],
      cta: 'Manter atual', highlight: false, type: PlanType.FREE
    },
    {
      name: 'Pro', price: 'R$ 297', description: 'Essencial para o lojista ativo.',
      features: ['Anúncios ilimitados', '10 Consultas cautelares/mês', 'Importação automática', 'Selo Verificado', 'Prioridade'],
      cta: 'Assinar Pro', highlight: true, type: PlanType.PRO
    },
    {
      name: 'Premium', price: 'R$ 897', description: 'Para operações de alto giro.',
      features: ['Consultas ilimitadas', 'Destaque fixo', 'Insights de AI', 'Suporte VIP', 'Multi-usuários'],
      cta: 'Assinar Premium', highlight: false, type: PlanType.PREMIUM
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Meu Plano</h2>
          </div>
          <p className="text-slate-500 text-sm md:text-base font-medium ml-5 md:ml-6">Escolha a escala ideal para sua operação de repasse.</p>
        </div>
        <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-100">
           <Star className="w-4 h-4 fill-orange-600" /> Upgrade de Performance
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative flex flex-col p-10 rounded-[48px] transition-all duration-700 hover:shadow-2xl ${plan.highlight ? 'bg-white border-4 border-orange-600 shadow-orange-600/10 scale-105 z-10' : 'bg-white border border-slate-100 shadow-sm'} ${currentPlan === plan.type ? 'opacity-60 ring-4 ring-emerald-500/20' : ''}`}>
            {plan.highlight && <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest">Mais Popular</span>}
            
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-2xl font-black tracking-tight ${plan.highlight ? 'text-orange-600' : 'text-slate-900'}`}>{plan.name}</h3>
                {currentPlan === plan.type && <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">Plano Atual</span>}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                {plan.price !== 'R$ 0' && <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">/mês</span>}
              </div>
              <p className="text-sm text-slate-400 font-medium mt-6 leading-relaxed">{plan.description}</p>
            </div>
            
            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1 rounded-lg ${plan.highlight ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-300'}`}><Check className="w-3.5 h-3.5" /></div>
                  <span className="text-sm text-slate-600 font-bold leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              disabled={currentPlan === plan.type}
              onClick={() => plan.type !== PlanType.FREE && onSelectPlan(plan)}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${currentPlan === plan.type ? 'bg-slate-100 text-slate-300' : plan.highlight ? 'bg-orange-600 text-white shadow-xl' : 'bg-slate-900 text-white shadow-lg'}`}
            >
              {currentPlan === plan.type ? 'Seu Plano' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[56px] p-10 md:p-12 text-white relative overflow-hidden group">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h3 className="text-2xl font-black tracking-tight">Vantagens B2B</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Shield, title: 'Segurança', text: 'Laudos integrados ao fluxo.' },
                { icon: Zap, title: 'Velocidade', text: 'Giro 3x mais rápido que FIPE.' },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center"><item.icon className="w-6 h-6" /></div>
                  <h4 className="text-lg font-black">{item.title}</h4>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[40px] border border-white/10 text-center">
             <Star className="w-12 h-12 text-orange-400 mx-auto mb-6" />
             <p className="text-xl font-black mb-2">Lojista Verificado</p>
             <p className="text-sm text-slate-400 font-medium mb-8">O selo de confiança para suas negociações.</p>
             <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Ver Requisitos</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[150px] rounded-full" />
      </div>
    </div>
  );
};

export default Plans;
