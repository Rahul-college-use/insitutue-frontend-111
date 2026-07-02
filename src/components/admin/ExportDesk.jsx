import React from 'react';
import { FileSpreadsheet, Download, Layers, ShieldCheck } from 'lucide-react';

export default function ExportDesk() {
  const branches = ["Computer Science & Engineering", "Civil Engineering", "Mechanical Engineering", "ECE"];

  const handleBulkExport = (branch) => {
    alert(`📊 Formatting cryptographic Excel report sheets for [${branch}] student registers structure...`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
      <div className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-4">
        <div>
          <FileSpreadsheet className="w-6 h-6 text-emerald-400 mb-2" />
          <h5 className="font-black text-white text-sm sm:text-base">TPO Master Database Engine</h5>
          <p className="text-xs text-slate-400 font-medium leading-normal mt-1">Compile full student metadata schemas, verification timelines, and attendance registries directly into localized formats.</p>
        </div>
        <button onClick={() => handleBulkExport("All Branches")} className="w-fit bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Dump Master Sheet (CSV)
        </button>
      </div>

      <div className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-5 shadow-xl backdrop-blur-md space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Branch-Wise Slice</span>
        <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
          {branches.map((b, i) => (
            <div key={i} className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/30 flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="truncate max-w-[180px]">{b}</span>
              <button onClick={() => handleBulkExport(b)} className="text-blue-400 hover:text-white transition text-[11px] font-black uppercase flex items-center gap-1 cursor-pointer">
                Export <Download className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}