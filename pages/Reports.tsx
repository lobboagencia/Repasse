
import React from 'react';
import { Search, History, ShieldCheck, ShieldAlert, Filter, ExternalLink, Download } from 'lucide-react';

const Reports: React.FC = () => {
  const reports = [
    { id: 'REP-001', plate: 'ABC-1234', model: 'Toyota Corolla XEi', date: '25/10/2023', status: 'approved', score: 98 },
    { id: 'REP-002', plate: 'XYZ-9876', model: 'Jeep Compass Longitude', date: '22/10/2023', status: 'approved', score: 94 },
    { id: 'REP-003', plate: 'BRA-2E19', model: 'Honda Civic Touring', date: '18/10/2023', status: 'warning', score: 65 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Consultas</h2>
          </div>
          <p className="text-slate-500 text-sm md:text-base font-medium ml-5 md:ml-6">Gestão de procedência e históricos BIN.</p>
        </div>
        <button className="px-8 py-4 bg-orange-600 text-white rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-600/20 transition-all flex items-center gap-3 active:scale-95">
          <Search className="w-5 h-5" /> Nova Consulta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">Uso Mensal</p>
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-4xl font-black text-slate-900">12</p>
            <p className="text-slate-400 text-lg font-bold">/ 10</p>
          </div>
          <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-orange-600 w-full rounded-full"></div>
          </div>
          <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mt-6">Plano Pro: +2 extras inclusos</p>
        </div>
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 border-dashed flex flex-col items-center justify-center text-center group cursor-pointer hover:border-orange-300 transition-colors">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-orange-600 transition-colors">Precisando de mais?</p>
          <button className="text-xs font-black text-orange-600 uppercase tracking-widest hover:underline">Recarregar Créditos</button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[48px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <History className="w-5 h-5 text-slate-300" />
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Histórico Recente</h3>
           </div>
           <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl"><Filter className="w-4 h-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-black text-slate-400 border-b border-slate-100 tracking-widest">
                <th className="px-10 py-6">Veículo / Placa</th>
                <th className="px-10 py-6">Data</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1.5">{rep.model}</p>
                      <span className="text-[9px] font-mono font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{rep.plate}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-sm font-bold text-slate-500">{rep.date}</td>
                  <td className="px-10 py-8">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest w-fit border ${
                      rep.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {rep.status === 'approved' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                      {rep.status === 'approved' ? 'APROVADO' : 'ATENÇÃO'}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 text-slate-300 hover:text-orange-600 transition-all"><ExternalLink className="w-5 h-5" /></button>
                      <button className="p-3 text-slate-300 hover:text-orange-600 transition-all"><Download className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
