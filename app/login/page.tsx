
"use client";

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Credenciais inválidas ou erro de conexão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-md w-full space-y-10 bg-white/70 backdrop-blur-xl p-10 md:p-12 rounded-[56px] shadow-2xl border border-white relative z-10">
        <div className="text-center space-y-8">
          <div className="w-20 h-20 bg-orange-600 rounded-[28px] flex items-center justify-center text-white font-black text-4xl italic mx-auto shadow-xl shadow-orange-600/20">R</div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">RepasseJá</h2>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">B2B Auto Liquidity Hub</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
          
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
                className="w-full bg-white border border-slate-100 rounded-[24px] pl-16 pr-6 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Senha</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-100 rounded-[24px] pl-16 pr-6 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-6 rounded-[24px] shadow-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 group active:scale-95 uppercase text-xs tracking-[0.2em]"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar no Hub'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
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
}
