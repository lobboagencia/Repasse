
import React, { useState } from 'react';
import { Mail, Lock, User, Building2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface RegisterProps {
  onRegister: (data: any) => void;
  onLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    dealership: '',
    email: '',
    password: '',
    cnpj: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <button 
          onClick={onLogin}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Login
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cadastro de Lojista</h2>
          <p className="text-slate-500 text-sm mt-2">Inicie sua operação de repasse em minutos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              required
              type="text" 
              placeholder="Seu nome completo"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              required
              type="text" 
              placeholder="Nome da Loja / Revenda"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={formData.dealership}
              onChange={e => setFormData({...formData, dealership: e.target.value})}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              required
              type="email" 
              placeholder="E-mail profissional"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              required
              type="password" 
              placeholder="Crie uma senha forte"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="text-[10px] font-bold text-orange-600 leading-relaxed uppercase tracking-wider">
              Ao se cadastrar, você concorda com nossos termos de uso B2B. Sua conta passará por uma verificação de segurança após o primeiro acesso.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2 group"
          >
            Criar Minha Conta
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-6 border-t border-slate-100 text-center">
          <button onClick={onLogin} className="text-xs text-slate-500 font-bold hover:text-orange-600">
            Já possui conta? Faça o Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
