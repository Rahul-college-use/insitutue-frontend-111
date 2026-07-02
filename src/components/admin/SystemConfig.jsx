import React, { useState } from 'react';
import { ToggleRight, ToggleLeft, Radio, UserPlus, Sliders, AlertOctagon } from 'lucide-react';

export default function SystemConfig() {
  const [gates, setGates] = useState({ allowRegistration: true, maintenanceMode: false });

  return (
    <div className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-5 animate-in fade-in">
      <div className="flex items-center gap-2 border-b border-slate-700/50 pb-3">
        <Sliders className="w-4 h-4 text-purple-400" />
        <h5 className="font-black text-white text-sm sm:text-base">Overlord Global Configuration</h5>
      </div>

      <div className="space-y-4">
        {/* Toggle 1 */}
        <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/40 flex items-center justify-between gap-4">
          <div className="space-y-0.5 text-xs">
            <h6 className="font-black text-white flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5 text-blue-400" /> Dynamic Student Intake Gateway</h6>
            <p className="text-slate-400 font-medium text-[11px]">Toggle this matrix block to control whether new applicants can submit the registration form.</p>
          </div>
          <button onClick={() => setGates({...gates, allowRegistration: !gates.allowRegistration})} className="focus:outline-none">
            {gates.allowRegistration ? <ToggleRight className="w-9 h-9 text-blue-500 cursor-pointer" /> : <ToggleLeft className="w-9 h-9 text-slate-600 cursor-pointer" />}
          </button>
        </div>

        {/* Toggle 2 */}
        <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/40 flex items-center justify-between gap-4">
          <div className="space-y-0.5 text-xs">
            <h6 className="font-black text-white flex items-center gap-1.5"><AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> Global Maintenance Lockout</h6>
            <p className="text-slate-400 font-medium text-[11px]">Redirects all student sessions to a secure staging asset pipeline during system patch upgrades.</p>
          </div>
          <button onClick={() => setGates({...gates, maintenanceMode: !gates.maintenanceMode})} className="focus:outline-none">
            {gates.maintenanceMode ? <ToggleRight className="w-9 h-9 text-rose-500 cursor-pointer" /> : <ToggleLeft className="w-9 h-9 text-slate-600 cursor-pointer" />}
          </button>
        </div>
      </div>
    </div>
  );
}