import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Clock, CheckCircle, Loader2, XCircle, Check, X, 
  AlertTriangle, Search, Filter, RefreshCw, Smartphone, Mail, GraduationCap, ArrowUpDown
} from 'lucide-react';
import { apiService } from '../../services/api';

export default function VerificationDesk({ refreshTrigger, triggerRefresh }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); 
  
  // Premium Layout Feature States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc'); // Sorting by registration timeline
  const [toastMessage, setToastMessage] = useState(null);

  // const url = "http://localhost:3000";

  // Temporary UI notifications replacing crude window alerts
  const triggerToast = (msg, isError = false) => {
    setToastMessage({ text: msg, error: isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const token = localStorage.getItem("token");
        const data = await apiService.getStudents(token);

        // const res = await fetch(`${url}/api/auth/admin/students`, {
        //   headers: { 
        //     "Content-Type": "application/json",
        //     "Authorization": `Bearer ${token}` 
        //   }
        // });
        
        // const data = await res.json();
        
        if (data.success) {
          setStudents(data.students || []);
        } else {
          setErrorMessage(data.message || "Unauthorized Access Context!");
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Network interface handshake dropped.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [refreshTrigger]);

  const handleStatusMutation = async (studentId, nextStatus) => {
    try {
      setActionId(studentId);
      // const token = localStorage.getItem("token");
      const data = await apiService.updateStudentStatus(studentId, nextStatus);
      // const res = await fetch(`${url}/api/auth/admin/student-status/${studentId}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      //   body: JSON.stringify({ status: nextStatus })
      // });
      // const data = await res.json();
      // console.log("Status mutation response:", data);
      if (data.success) {
        triggerToast(`Roster node updated: Candidate state is now ${nextStatus}`);
        triggerRefresh();
      } else {
        triggerToast(data.message || "Mutation execution failed", true);
      }
    } catch (err) {
      triggerToast("Error parsing status handshake parameters", true);
    } finally {
      setActionId(null);
    }
  };

  // Advanced Sorting, Searching & Filtering Implementations
  const filteredStudents = students
    .filter(student => {
      const matchQuery = student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         student.universityRoll?.toString().includes(searchQuery);
      const matchFilter = statusFilter === 'All' ? true : student.registrationStatus === statusFilter;
      return matchQuery && matchFilter;
    })
    .sort((a, b) => {
      return sortOrder === 'asc' 
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.fullName ? b.fullName.localeCompare(a.fullName) : 0;
    });

  const pending = students.filter(s => s.registrationStatus === 'Pending').length;
  const approved = students.filter(s => s.registrationStatus === 'Approved').length;

  // Premium Animated Skeleton Loading Placeholder
  if (loading) {
    return (
      <div className="space-y-6 w-full animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#0d0d11] border border-zinc-900 rounded-xl" />
          ))}
        </div>
        <div className="h-12 bg-[#0d0d11] border border-zinc-900 rounded-xl w-full" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-[#0d0d11]/60 border border-zinc-900/40 rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl p-8 text-center max-w-md mx-auto my-12 shadow-2xl backdrop-blur-md">
        <XCircle className="w-8 h-8 text-rose-500/80 mx-auto mb-3" />
        <h4 className="font-mono font-black text-white text-xs tracking-widest uppercase">SECURE // AUTH_FAILURE</h4>
        <p className="text-xs text-zinc-400 mt-2 font-medium leading-relaxed">{errorMessage}</p>
        <p className="text-[11px] text-zinc-600 mt-4 leading-normal">Your admin session key context signature may have expired. Re-authenticate through the access portal gateway.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      
      {/* 🔔 PREMIUM TOAST NOTIFICATION DISPATCHER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md ${
              toastMessage.error 
                ? 'bg-rose-950/80 border-rose-800 text-rose-300' 
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-200'
            }`}
          >
            {toastMessage.error ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📊 1. PREMIUM METRIC TIMELINE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -2 }} className="bg-[#09090b] border border-zinc-800/40 rounded-xl p-4 flex items-center gap-4 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">TOTAL_MAPPED</span>
            <span className="text-sm font-black text-white block mt-0.5">{students.length} Candidates</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }} className="bg-[#09090b] border border-zinc-800/40 rounded-xl p-4 flex items-center gap-4 transition-colors"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${pending > 0 ? 'bg-amber-500/5 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
            <Clock className={`w-4 h-4 ${pending > 0 ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <span className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">PENDING_AUDIT</span>
            <span className={`text-sm font-black block mt-0.5 ${pending > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>{pending} Records</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }} className="bg-[#09090b] border border-zinc-800/40 rounded-xl p-4 flex items-center gap-4 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
            <CheckCircle className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <span className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">LIVE_VERIFIED</span>
            <span className="text-sm font-black text-white block mt-0.5">{approved} Profiles</span>
          </div>
        </motion.div>
      </div>

      {/* 🔍 2. ADVANCED FILTERS, SORTING, & SEARCH MATRIX BAR */}
      <div className="bg-[#09090b] border border-zinc-800/40 p-3 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:max-w-xs flex items-center gap-2.5 bg-[#050507] border border-zinc-800 px-3 py-1.5 rounded-lg text-xs group transition">
          <Search className="w-3.5 h-3.5 text-zinc-600 group-focus-within:text-zinc-400 transition" />
          <input 
            type="text" 
            placeholder="Search by name or roll number..." 
            className="bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-600 w-full font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          {/* Status Select Box */}
          <div className="flex items-center gap-1.5 bg-[#050507] border border-zinc-800 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 font-medium">
            <Filter className="w-3 h-3 text-zinc-600" />
            <select 
              className="bg-transparent border-none outline-none text-zinc-300 font-bold cursor-pointer pr-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All" className="bg-[#0c0c0e]">All Stages</option>
              <option value="Pending" className="bg-[#0c0c0e]">Pending</option>
              <option value="Approved" className="bg-[#0c0c0e]">Approved</option>
              <option value="Rejected" className="bg-[#0c0c0e]">Rejected</option>
            </select>
          </div>

          {/* Alpha Sorting Toggle Trigger */}
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-[#050507] border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Sort Alphabetic Direction"
          >
            <ArrowUpDown className="w-3 h-3 text-zinc-500" />
            <span className="font-mono uppercase text-[10px]">{sortOrder.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* 📑 3. ISOLATED LEDGER DATA LAYERS MATRIX */}
      <div className="bg-[#09090b]/40 border border-zinc-800/20 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          {filteredStudents.length === 0 ? (
            <div className="p-16 text-center text-xs text-zinc-500 font-bold flex flex-col items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-zinc-700" />
              <span>No corresponding matching candidate records identified inside this view bucket scope.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-[#0c0c0e] border-b border-zinc-800/50 text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
                  <th className="py-3.5 px-6">Candidate Bio Profile</th>
                  <th className="py-3.5 px-6">Department Metrics</th>
                  <th className="py-3.5 px-6">University Metadata</th>
                  <th className="py-3.5 px-6">State Channel</th>
                  <th className="py-3.5 px-6 text-right">Administrative Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 text-xs text-zinc-300 font-semibold">
                <AnimatePresence initial={false}>
                  {filteredStudents.map((student) => {
                    const currentStatus = student.registrationStatus;
                    return (
                      <motion.tr 
                        layout
                        key={student._id} 
                        className="hover:bg-zinc-900/20 transition-colors"
                      >
                        {/* Candidate Bio */}
                        <td className="py-4 px-6 space-y-1">
                          <div className="font-black text-white text-sm tracking-tight">{student.fullName}</div>
                          <div className="text-zinc-400 font-mono text-[11px] flex items-center gap-1.5">
                            <Smartphone className="w-3 h-3 text-zinc-600" /> {student.contactNumber}
                          </div>
                          <div className="text-zinc-500 text-[11px] font-medium flex items-center gap-1.5 truncate max-w-[220px]">
                            <Mail className="w-3 h-3 text-zinc-600" /> {student.emailAddress}
                          </div>
                        </td>

                        {/* Department/Academic Spec */}
                        <td className="py-4 px-6 space-y-1.5">
                          <div className="text-zinc-300 text-xs font-bold flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{student.departmentName || student.department}</span>
                          </div>
                          <span className="inline-block text-[9px] font-mono font-bold tracking-wider uppercase text-zinc-500 bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded">
                            TERM // SEM_{student.semester}
                          </span>
                        </td>

                        {/* University Tracking Identifiers */}
                        <td className="py-4 px-6 font-mono text-[11px] text-zinc-500 space-y-1">
                          <div className="flex items-center gap-1.5">Roll: <span className="text-zinc-300 font-bold font-sans">{student.universityRoll}</span></div>
                          <div className="flex items-center gap-1.5">Reg: <span className="text-zinc-300 font-bold font-sans">{student.universityReg}</span></div>
                        </td>

                        {/* Operational Matrix Registry State Status Badge */}
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider inline-block ${
                            currentStatus === 'Approved' ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/10' : 
                            currentStatus === 'Rejected' ? 'bg-rose-500/5 text-rose-400 border border-rose-500/10' : 'bg-amber-500/5 text-amber-400 border border-amber-500/10'
                          }`}>{currentStatus}</span>
                        </td>

                        {/* Dynamic Action Control Interface Layer (Upgraded for Multi-directional Toggle) */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex gap-2 justify-end items-center">
                            
                            {/* Render Approve button if status is NOT Approved */}
                            {currentStatus !== 'Approved' && (
                              <button 
                                disabled={actionId !== null} 
                                onClick={() => handleStatusMutation(student._id, 'Approved')} 
                                className="bg-zinc-100 hover:bg-white text-black disabled:opacity-30 px-2.5 py-1.5 rounded-lg text-[11px] font-black transition flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                {actionId === student._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve
                              </button>
                            )}

                            {/* Render Reject button if status is NOT Rejected */}
                            {currentStatus !== 'Rejected' && (
                              <button 
                                disabled={actionId !== null} 
                                onClick={() => handleStatusMutation(student._id, 'Rejected')} 
                                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-950 disabled:opacity-30 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            )}

                            {/* NEW: Render Pending/Reset button if status is ALREADY Approved or Rejected */}
                            {currentStatus !== 'Pending' && (
                              <button 
                                disabled={actionId !== null} 
                                onClick={() => handleStatusMutation(student._id, 'Pending')} 
                                className="bg-zinc-900 hover:bg-zinc-800 border border-dashed border-zinc-700 text-amber-500 hover:text-amber-400 hover:border-amber-500 disabled:opacity-30 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition flex items-center gap-1 cursor-pointer"
                                title="Revert back to Pending Audit state"
                              >
                                <Clock className="w-3 h-3" /> Revert Pending
                              </button>
                            )}

                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}