import React, { useState, useEffect } from 'react';
import { Shield, Clock, UserCheck, AlertTriangle, RefreshCw } from 'lucide-react';

export default function SystemAuditor() {
  const [logs, setLogs] = useState([
    { id: 1, action: "CHAT_LOCKED", detail: "STAAD.Pro Civil room chat disabled", admin: "Root_Admin", time: "10 mins ago", type: "warning" },
    { id: 2, action: "STUDENT_APPROVED", detail: "Rahul Kumar (Roll: 101) Verified", admin: "Root_Admin", time: "1 hr ago", type: "success" },
    { id: 3, action: "COURSE_CREATED", detail: "Injected Full-Stack Node.js Track", admin: "System_Core", time: "3 hrs ago", type: "info" }
  ]);

  return (
    <div className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-6 shadow-xl backdrop-blur-md animate-in fade-in">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <h4 className="font-black text-white text-base">Security Audit Logs</h4>
        </div>
        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">System Live</span>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-slate-900/40 border border-slate-700/30 p-3.5 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-2 h-2 rounded-full ${
                log.type === 'warning' ? 'bg-amber-500' : log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
              }`} />
              <div>
                <p className="text-white font-black tracking-wide text-xs">{log.action}</p>
                <p className="text-slate-400 font-medium text-[11px] mt-0.5">{log.detail}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="block text-slate-300 text-[10px] font-mono">By: {log.admin}</span>
              <span className="text-slate-500 text-[9px] flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}