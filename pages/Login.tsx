
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';

interface LoginProps {
  onLogin: (data?: any) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Aqui você chamaria sua API de Auth real
      onLogin({
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
        dealership: 'Minha Concessionária',
        plan: 'FREE',
        reputation: 5.0,
        avatar: `https://ui-avatars.com/api/?name=${email}&background=f97316&color=fff`
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-md w-full space-y-10 glass p-10 md:p-12 rounded-[56px] shadow-2xl border border-white/50 relative z-10 animate-in zoom-in-95 duration-700">
        <div className="text-center space-y-8">
          <div className="w-20 h-20 bg-orange-600 rounded-[28px] flex items-center justify-center text-white font-black text-4xl italic mx-auto shadow-xl shadow-orange-600/20">R</div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">RepasseJá</h2>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Subtitulo</p>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-mail Corporativo</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com.br"
                className="w-full bg-white/50 border border-slate-100 rounded-[24px] pl-16 pr-6 py-5 text-sm font-bold focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/20 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Senha de Acesso</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/50 border border-slate-100 rounded-[24px] pl-16 pr-6 py-5 text-sm font-bold focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-2 pt-2">
            <button type="button" onClick={onForgotPassword} className="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-orange-600">Esqueceu a senha?</button>
            <button type="button" onClick={onRegister} className="text-[10px] text-orange-600 font-black uppercase tracking-widest hover:text-orange-700">Criar conta</button>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-black py-6 rounded-[24px] shadow-2xl shadow-slate-900/10 hover:bg-orange-600 hover:shadow-orange-600/20 transition-all flex items-center justify-center gap-3 group active:scale-95 uppercase text-xs tracking-[0.2em]"
          >
            Entrar no Hub
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-8 border-t border-slate-50 text-center">
          <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-400" /> Acesso Restrito a Lojistas
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
