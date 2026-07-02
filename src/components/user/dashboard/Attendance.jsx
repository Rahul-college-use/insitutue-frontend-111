import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, CheckCircle, XCircle, AlertCircle, FileSpreadsheet, FileText, Loader } from 'lucide-react';
import { apiService } from '../../../services/api'; // Make sure this path matches your project structure

export default function Attendance({ user }) {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, halfDay: 0 });
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Using user.id instead of user._id and adding proper fetch structure
  const fetchAttendanceRegistry = useCallback(async () => {
    const currentUserId = user?.id || user?._id;
    if (!currentUserId) {
      console.log("No valid user identity found to fetch registry.");
      return;
    }

    try {
      setLoading(true);
      
      // ✅ FIXED: Making actual network request using your apiService 
      // (Or replace with your direct fetch/axios matching endpoint)
      const data = await apiService.getAttendanceLogs(currentUserId);
      console.log("Attendance history registry logs parsed:", data);

      if (data && data.success) {
        setLogs(data.logs || []);
        setStats(data.stats || { present: 0, absent: 0, halfDay: 0 });
      }
    } catch (error) {
      console.error("Failed to load historical database attendance:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?._id]); // ✅ FIXED: Track correct identifier dependencies

  useEffect(() => {
    fetchAttendanceRegistry();
  }, [fetchAttendanceRegistry]);

  const triggerExcelExport = () => {
    alert("Generating Excel spreadsheet format download package...");
  };

  const triggerPdfExport = () => {
    alert("Compiling PDF cryptographic report layout printout...");
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader className="w-6 h-6 text-[#0066ff] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Compiling Attendance Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 space-y-6 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
      
      {/* Top Action Block Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/60 shadow-sm">
        <div>
          <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0066ff]" /> Industrial Attendance Register
          </h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Track your mandatory session updates and sync logs</p>
        </div>
        
        {/* Action Triggers */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={triggerExcelExport} 
            className="flex-1 sm:flex-none bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100/70 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button 
            onClick={triggerPdfExport} 
            className="flex-1 sm:flex-none bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100/70 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Attendance Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Days Present</span>
            <span className="text-base font-black text-slate-900">{stats.present} Days</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Days Absent</span>
            <span className="text-base font-black text-slate-900">{stats.absent} Days</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Half Days</span>
            <span className="text-base font-black text-slate-900">{stats.halfDay} Days</span>
          </div>
        </div>
      </div>

      {/* Logs Table Wrapper */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 font-bold">
              No historical log tokens registered to this account calendar instance.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Clock In</th>
                  <th className="py-4 px-6">Clock Out</th>
                  <th className="py-4 px-6">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700 font-semibold">
                {logs.map((log, i) => {
                  const safeKey = log._id || log.id || `attendance-row-${i}`;
                  return (
                    <tr key={safeKey} className="hover:bg-slate-50/30 transition">
                      <td className="py-4 px-6 text-slate-900 font-bold">
                        {log.date ? new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-block ${
                          log.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                          log.status === 'Absent' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                        }`}>{log.status}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">{log.clockIn || "--:--"}</td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">{log.clockOut || "--:--"}</td>
                      <td className="py-4 px-6 text-slate-400 font-medium text-xs truncate max-w-[180px]">{log.remarks || "Regular Logs"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}