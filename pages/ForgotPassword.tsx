
import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-bold mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Login
        </button>

        {!sent ? (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900">Recuperar Senha</h2>
              <p className="text-slate-500 text-sm mt-2">Enviaremos um link de recuperação para o seu e-mail profissional.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="Seu e-mail de cadastro"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button 
              onClick={() => setSent(true)}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar Link
            </button>
          </>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">E-mail Enviado!</h2>
            <p className="text-slate-500 text-sm">Confira sua caixa de entrada (e o spam) para redefinir sua senha.</p>
            <button 
              onClick={onBack}
              className="text-blue-600 font-bold hover:underline"
            >
              Voltar ao login agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
