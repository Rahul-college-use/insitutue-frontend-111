import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, Search, Filter } from 'lucide-react';
import { apiService } from '../../services/api';

export default function AdminStudentAttendanceDesk({ studentId, courseId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [studentMeta, setStudentMeta] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stats, setStats] = useState({ present: 0, absent: 0, halfDay: 0, percentage: 0 });

  const fetchStudentDetailedLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.getAdminSingleStudentLogs(studentId, courseId);
      if (res && res.success) {
        setLogs(res.logs || []);
        setStudentMeta(res.student || null);
        const p = res.stats?.present || 0;
        const a = res.stats?.absent || 0;
        const hd = res.stats?.halfDay || 0;
        const total = p + a + hd;
        const pct = total > 0 ? Math.round(((p + (hd * 0.5)) / total) * 100) : 0;
        setStats({ present: p, absent: a, halfDay: hd, percentage: pct });
      }
    } catch (err) {
      console.error("Admin component network gateway down:", err);
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  useEffect(() => {
    if (studentId && courseId) fetchStudentDetailedLogs();
  }, [studentId, courseId, fetchStudentDetailedLogs]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.date.includes(searchTerm);
    const matchesFilter = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-2">
          <Clock className="w-6 h-6 text-zinc-400 animate-spin" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">SYNCHRONIZING_DESK_REGISTRY...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-zinc-900 dark:text-[#f4f4f5]">
      
      {/* 1. COMPACT DASH HEADER PROFILE CONTROL PANEL */}
      <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 transition text-zinc-500 dark:text-zinc-400 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight">{studentMeta?.fullName || "Rahul Kumar"}</h3>
              <span className="text-[9px] font-mono font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded uppercase">{studentMeta?.studentIndex || "U23303"}</span>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold flex items-center gap-1.5 mt-0.5">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" /> {studentMeta?.courseName || "Cybersecurity & Ethical Hacking"}
            </p>
          </div>
        </div>
        
        <div className="bg-zinc-50 dark:bg-[#111115] text-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800/80 text-right w-full sm:w-auto shrink-0 shadow-inner">
          <span className="text-[9px] uppercase font-mono font-black text-zinc-400 tracking-wider block">AGGREGATE_RATIO // RATE</span>
          <span className="text-sm font-mono font-black tracking-tighter">{stats.percentage}% Avg</span>
        </div>
      </div>

      {/* 2. OPERATIONAL PER-COURSE SCORE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/40 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20"><CheckCircle className="w-4 h-4" /></div>
          <div>
            <span className="block text-[9px] font-mono font-black text-zinc-400 uppercase tracking-wider">DAYS_PRESENT</span>
            <span className="text-sm font-black">{stats.present} Days</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/40 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20"><XCircle className="w-4 h-4" /></div>
          <div>
            <span className="block text-[9px] font-mono font-black text-zinc-400 uppercase tracking-wider">DAYS_ABSENT</span>
            <span className="text-sm font-black">{stats.absent} Days</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/40 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20"><AlertCircle className="w-4 h-4" /></div>
          <div>
            <span className="block text-[9px] font-mono font-black text-zinc-400 uppercase tracking-wider">HALF_DAYS</span>
            <span className="text-sm font-black">{stats.halfDay} Days</span>
          </div>
        </div>
      </div>

      {/* 3. HARDENED ATTENDANCE TIMELINE SEARCH MATRICES */}
      <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/40 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800/60 flex flex-col sm:flex-row gap-3 justify-between items-center bg-zinc-50/50 dark:bg-[#09090b]/50">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" placeholder="Filter date token (YYYY-MM-DD)..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 font-medium text-zinc-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 font-bold focus:outline-none text-zinc-700 dark:text-zinc-300"
            >
              <option value="All">All Audit Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 font-mono tracking-wide font-medium">NO_MATCHING_ATTENDANCE_ENTRIES_FOUND</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-zinc-50/60 dark:bg-[#08080a] border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-6">Timestamp Date</th>
                  <th className="py-3 px-6">Audit Status</th>
                  <th className="py-3 px-6">Clock In</th>
                  <th className="py-3 px-6">Clock Out</th>
                  <th className="py-3 px-6">Log Metadata Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/40 text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition">
                    <td className="py-3.5 px-6 text-zinc-900 dark:text-white font-bold">
                      {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider inline-block ${
                        log.status === 'Present' ? 'bg-emerald-500/10 text-emerald-500' :
                        log.status === 'Absent' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>{log.status}</span>
                    </td>
                    <td className="py-3.5 px-6 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">{log.clockIn || "--:--"}</td>
                    <td className="py-3.5 px-6 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">{log.clockOut || "--:--"}</td>
                    <td className="py-3.5 px-6 text-zinc-400 dark:text-zinc-500 font-medium text-[11px] max-w-[200px] truncate">{log.remarks || "Regular System Entry"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}