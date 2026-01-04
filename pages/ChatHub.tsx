
import React, { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical, MessageSquare, ArrowLeft, Search, Zap, DollarSign, X, CheckCheck, Info, PhoneCall } from 'lucide-react';
import { Chat, Message, User, ProposalStatus, Notification } from '../types';

interface ChatHubProps {
  currentUser: User;
  chats: Chat[];
  onUpdateChat: (chatId: string, messages: Message[]) => void;
  onTriggerNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const ChatHub: React.FC<ChatHubProps> = ({ currentUser, chats, onUpdateChat, onTriggerNotification }) => {
  const [selectedChatId, setSelectedChatId] = useState<string>(chats[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalValue, setProposalValue] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [viewingChat, setViewingChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedChat = chats.find(c => c.id === selectedChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      text: inputText,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    onUpdateChat(selectedChat.id, [...selectedChat.messages, newMessage]);
    setInputText('');
  };

  const handleSendProposal = () => {
    if (!proposalValue || !selectedChat) return;
    
    const valueNum = Number(proposalValue);
    const minAcceptable = selectedChat.vehicle.price * 0.85; // Lógica de Negócio: Bloqueia ofertas < 85% do valor pedido

    if (valueNum < minAcceptable) {
      onTriggerNotification({
        title: "Oferta Muito Baixa",
        message: "O sistema bloqueou esta oferta por estar muito abaixo da média de mercado para repasse.",
        type: 'system'
      });
      return;
    }

    const proposalMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      text: `Oferta B2B: R$ ${valueNum.toLocaleString('pt-BR')}`,
      timestamp: new Date().toISOString(),
      type: 'proposal',
      payload: { value: valueNum, status: ProposalStatus.PENDING, vehicle: selectedChat.vehicle }
    };
    
    onUpdateChat(selectedChat.id, [...selectedChat.messages, proposalMessage]);
    setShowProposalModal(false);
    setProposalValue('');
    
    onTriggerNotification({
      title: "Oferta Enviada",
      message: `Sua proposta de R$ ${valueNum.toLocaleString('pt-BR')} foi notificada ao lojista.`,
      type: 'proposal'
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-transparent">
      {/* HEADER PADRONIZADO DO CHATHUB */}
      <div className="mb-8 space-y-2 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Negociações</h2>
        </div>
        <p className="text-slate-500 text-sm md:text-base font-medium ml-5 md:ml-6">Gestão centralizada de ofertas e giro de estoque.</p>
      </div>

      <div className="flex-1 flex bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden relative">
        <div className={`${isMobileView && viewingChat ? 'hidden' : 'flex'} w-full lg:w-96 border-r border-slate-100 flex-col bg-slate-50/20`}>
          <div className="p-8 border-b border-slate-100 bg-white">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-600" />
                <input type="text" placeholder="Buscar negociação..." className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-orange-50" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => {setSelectedChatId(chat.id); if (isMobileView) setViewingChat(true);}}
                className={`p-5 rounded-3xl cursor-pointer transition-all active:scale-95 ${selectedChatId === chat.id ? 'bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100' : 'hover:bg-white/50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-black text-slate-900 truncate pr-4">{chat.participant.dealership}</p>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                    {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">{chat.vehicle.model}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${isMobileView && !viewingChat ? 'hidden' : 'flex'} flex-1 flex-col h-full bg-slate-50/50 relative`}>
          {selectedChat ? (
            <>
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                  {isMobileView && <button onClick={() => setViewingChat(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><ArrowLeft className="w-5 h-5" /></button>}
                  <div className="w-12 h-12 rounded-[20px] bg-slate-900 flex items-center justify-center font-black text-white shadow-lg shadow-slate-900/10">
                    {selectedChat.participant.dealership.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{selectedChat.participant.dealership}</h4>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Ativo Agora</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="hidden sm:flex p-3 bg-slate-50 text-slate-400 rounded-xl"><PhoneCall className="w-5 h-5" /></button>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {selectedChat.messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-5 rounded-[28px] shadow-sm ${
                      msg.senderId === currentUser.id ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center gap-1.5 mt-2 justify-end ${msg.senderId === currentUser.id ? 'text-slate-400' : 'text-slate-300'}`}>
                        <span className="text-[8px] font-black uppercase tracking-widest">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.senderId === currentUser.id && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-8 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="flex gap-2">
                    <button onClick={() => setShowProposalModal(true)} className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-500/10 active:scale-95">
                      <Zap className="w-4 h-4" /> Proposta
                    </button>
                    <button className="px-6 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 active:scale-95">Solicitar Laudo</button>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <input 
                      type="text" 
                      placeholder="Sua proposta ou mensagem..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-orange-500/5 outline-none transition-all"
                    />
                    <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="w-24 h-24 bg-orange-50 rounded-[40px] flex items-center justify-center text-orange-600 border border-orange-100">
                <MessageSquare className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Negociações</h3>
                <p className="text-slate-400 text-sm max-w-xs font-medium">Selecione uma mesa ativa para gerenciar suas propostas e giro de estoque.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showProposalModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-sm rounded-[48px] shadow-2xl p-10 space-y-8 animate-in zoom-in-95">
             <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Enviar Oferta</h3>
               <button onClick={() => setShowProposalModal(false)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl active:scale-90 transition-all"><X className="w-5 h-5" /></button>
             </div>
             <div className="space-y-4">
                <div className="space-y-2 text-center">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Valor de Mesa</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-200">R$</span>
                    <input 
                      type="number"
                      autoFocus
                      className="w-full bg-slate-50 border border-slate-100 rounded-[28px] p-8 pl-16 text-4xl font-black text-slate-900 focus:ring-4 focus:ring-orange-500/5 outline-none text-center"
                      value={proposalValue}
                      onChange={(e) => setProposalValue(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                   <Info className="w-5 h-5 text-orange-600 shrink-0" />
                   <p className="text-[10px] text-orange-900/70 font-bold leading-relaxed">Sua proposta será enviada diretamente à mesa do lojista.</p>
                </div>
             </div>
             <button onClick={handleSendProposal} disabled={!proposalValue} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50">Confirmar e Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHub;
