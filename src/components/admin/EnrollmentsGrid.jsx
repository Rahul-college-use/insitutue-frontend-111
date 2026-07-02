import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Loader2, Users, AlertCircle, ShieldCheck, 
  Search, ArrowDownToLine, Mail, Hash, Layers 
} from 'lucide-react';
import { apiService } from '../../services/api';

export default function EnrollmentsGrid({ refreshTrigger }) {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // ✅ EXACT WORKING API CONTEXT NODE
  // const url = "http://localhost:3000";

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const data = await apiService.getCourseMatrix(token);
        // const res = await fetch(`${url}/api/auth/admin/course-matrix`, {
        //   headers: { 
        //     "Content-Type": "application/json",
        //     "Authorization": `Bearer ${token}` 
        //   }
        // });
        // const data = await res.json();
        if (data.success) {
          setMatrix(data.matrix || []);
        }
      } catch (err) {
        console.error("Administrative matrix routing link error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatrix();
  }, [refreshTrigger]);

  // Integrated Local Workspace Filters Mapped to Search Payload
  const filteredMatrix = matrix.map(group => {
    const matchingStudents = group.students?.filter(student => 
      student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.universityRoll?.toString().includes(searchQuery)
    ) || [];
    
    return {
      ...group,
      students: matchingStudents,
      displayCount: matchingStudents.length
    };
  }).filter(group => group.students.length > 0 || searchQuery === '');

  // Premium Animated Skeleton Layer Rendering
  if (loading) {
    return (
      <div className="space-y-6 w-full animate-pulse">
        <div className="h-10 bg-[#0d0d11] border border-zinc-900 rounded-lg w-full max-w-xs" />
        {[1, 2].map((groupIndex) => (
          <div key={groupIndex} className="border border-zinc-900 bg-[#09090b]/40 rounded-xl overflow-hidden p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <div className="h-4 bg-zinc-800 rounded w-1/4" />
              <div className="h-6 bg-zinc-800 rounded-xl w-24" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((itemIndex) => (
                <div key={itemIndex} className="h-12 bg-[#0c0c0e] border border-zinc-900/60 rounded-lg w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 🔍 PREMIUM HUD SEARCH MODULE STRIP */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:max-w-xs flex items-center gap-2.5 bg-[#050507] border border-zinc-800 px-3 py-1.5 rounded-lg text-xs group transition">
          <Search className="w-3.5 h-3.5 text-zinc-600 group-focus-within:text-zinc-400 transition" />
          <input 
            type="text" 
            placeholder="Filter matrix rosters by name/roll..." 
            className="bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-600 w-full font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {matrix.length > 0 && (
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">
            ALLOCATION_PIPELINES // LIVE
          </span>
        )}
      </div>

      {/* CORE WORKSPACE ENTRY MATRIX ROUTER */}
      <div className="space-y-6">
        {filteredMatrix.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#09090b] border border-dashed border-zinc-800 rounded-xl p-16 text-center text-xs text-zinc-500 font-bold flex flex-col items-center justify-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-zinc-600" />
            <span>No localized industrial placement allocation metrics matched structural boundaries.</span>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredMatrix.map((group) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                key={group._id} 
                className="bg-[#09090b]/40 border border-zinc-800/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md"
              >
                
                {/* Section Header Strip Layout Node */}
                <div className="p-4 sm:p-5 bg-[#0c0c0e] border-b border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 font-bold text-white text-sm tracking-wide">
                    <BookOpen className="w-4 h-4 text-zinc-400 shrink-0" /> 
                    <span>{group.courseDetails?.courseName || "Academic Engineering Division Track"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Users className="w-3.5 h-3.5 text-zinc-500" /> 
                      Allocated: {searchQuery !== '' ? `${group.displayCount} of ${group.studentsCount}` : `${group.studentsCount || 0} Nodes`}
                    </span>
                  </div>
                </div>

                {/* Nested Glassmorphism Datatable Layout Container */}
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs min-w-[850px]">
                    <thead>
                      <tr className="bg-[#09090b]/20 border-b border-zinc-800/40 text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
                        <th className="py-3 px-6">Participant Legal Identity</th>
                        <th className="py-3 px-6">Department Stream Vector</th>
                        <th className="py-3 px-6">University Registry Identifiers</th>
                        <th className="py-3 px-6 text-right font-mono tracking-wider">STATE_SYNC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 font-semibold text-zinc-300">
                      {group.students?.map((student) => (
                        <tr key={student._id} className="hover:bg-zinc-900/20 transition-colors">
                          {/* Profile Data Bundle */}
                          <td className="py-3 px-6 space-y-0.5">
                            <div className="font-black text-white text-sm tracking-tight">{student.fullName}</div>
                            <div className="text-zinc-500 font-medium text-[11px] flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-zinc-600" /> {student.emailAddress}
                            </div>
                          </td>

                          {/* Academic Department Field */}
                          <td className="py-3 px-6 text-zinc-400 font-medium flex items-center gap-2 mt-2">
                            <Layers className="w-3.5 h-3.5 text-zinc-600" />
                            <span>{student.departmentName || student.department || "Universal Engineering Node"}</span>
                          </td>

                          {/* University Tracking Node Key */}
                          <td className="py-3 px-6 font-mono text-[11px] text-zinc-400">
                            <div className="flex items-center gap-1.5">
                              <Hash className="w-3 h-3 text-zinc-600" /> 
                              <span>{student.universityRoll || "GECJ-GENERIC-ID"}</span>
                            </div>
                          </td>

                          {/* Verified Sync Audit Status */}
                          <td className="py-3 px-6 text-right">
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/[0.02] border border-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" /> SYNC // OK
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}