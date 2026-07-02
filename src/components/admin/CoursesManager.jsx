import React, { useState } from 'react';
import { 
  Layers, Code, Users, Settings, Trash2, AlertCircle, X, ArrowUpRight
} from 'lucide-react';
import { apiService } from '../../services/api';
export default function CourseManager({ coursesList, routeToCourseWorkshop, triggerRefresh }) {
  // States for delete safety configuration panel
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Trigger prompt for system safety layer
  const promptDeleteSequence = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  // Close prompt context safely
  const abortDeleteSequence = () => {
    setCourseToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Execute actual database API handshake over network matrix
  const executeDeleteHandshake = async () => {
    if (!courseToDelete) return;
    
    setIsDeleting(true);
    try {
      const data = await apiService.deleteCourse(courseToDelete._id);
      // const response = await fetch(`http://localhost:3000/api/auth/admin/courses/${courseToDelete._id}/delete`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // });

      if (data.success) {
        // Force state data refresh context across parent containers
        triggerRefresh();
        abortDeleteSequence();
      } else {
        console.error("Server refused core deletion handshakes packet instruction.");
        alert("Failed to destroy matrix cell node. Check api proxy router authorizations.");
      }
    } catch (err) {
      console.error("Failed to transmit destroy signal down network pipeline matrix:", err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (!coursesList || coursesList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10 min-h-[300px]">
        <AlertCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-600 animate-pulse mb-3" />
        <h4 className="text-xs font-mono font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">NO_ACTIVE_NODES</h4>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-600 font-medium mt-1">No mapping data available inside the matrix cluster.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      
      {/* SECTION BANNER META */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 tracking-widest block">DATABASE // INDEX</span>
          <h3 className="text-sm font-black text-zinc-900 dark:text-white tracking-tight mt-0.5">DEPLOYED CATALOG MATRICES</h3>
        </div>
        <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold shadow-sm">
          COUNT // {coursesList.length}
        </span>
      </div>

      {/* BOX GRID RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coursesList.map((course) => {
          return (
            <div 
              key={course._id}
              className="group relative bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-lg"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-zinc-200 dark:bg-zinc-800 group-hover:bg-zinc-900 dark:group-hover:bg-zinc-400 transition-colors rounded-t-xl" />

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 shadow-inner">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 tracking-wider uppercase font-bold">
                    {course.code || "LIVE_SYS"}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white tracking-tight leading-snug truncate">
                    {course.courseName}
                  </h4>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium line-clamp-2 leading-relaxed min-h-[32px]">
                    {course.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900/60 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5"><Code className="w-3 h-3 text-zinc-400" /> MATRIX ID</span>
                  <span className="text-zinc-400 dark:text-zinc-600 font-bold">{course._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5"><Users className="w-3 h-3 text-zinc-400" /> INSTANCES</span>
                  <span className="text-zinc-900 dark:text-zinc-200 font-black">{course.enrolledCount || 0} Clients</span>
                </div>
              </div>

              {/* BOX FOOTER CONTROL DECK UPGRADED WITH DIRECT TRASH CAN DESTRUCT ICON TRIGGER */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-2">
                <button 
                  onClick={() => routeToCourseWorkshop(course._id)}
                  className="flex-grow flex items-center justify-center gap-1.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-black py-1.5 px-3 rounded-lg text-[11px] font-bold tracking-tight transition cursor-pointer shadow-sm"
                >
                  <span>Enter Workshop</span>
                  <ArrowUpRight className="w-3 h-3 shrink-0" />
                </button>
                
                {/* UPGRADED DELETE OPTION HOOK INSIDE SYSTEM ACTIONS GRID */}
                <button 
                  onClick={() => promptDeleteSequence(course)}
                  title="Purge Node Matrix Layer From Core Database"
                  className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 dark:text-zinc-500 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 hover:border-rose-200 dark:hover:border-rose-950 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* ⚠️ SYSTEM SAFETY OVERLAY CONSOLE MODAL SHEET PANEL        */}
      {/* ========================================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-sm w-full p-5 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono text-[10px] font-black tracking-widest">
                <AlertCircle className="w-4 h-4" /> CORE_MATRIX_PURGE_SEQUENCE
              </div>
              <button onClick={abortDeleteSequence} className="text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-black text-zinc-900 dark:text-white">Are you absolutely certain?</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                You are forcing a permanent destruction command targeting course:
                <span className="block font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 px-2 py-1.5 rounded font-black text-zinc-800 dark:text-zinc-200 mt-2 truncate text-[10px]">
                  {courseToDelete?.courseName} ({courseToDelete?.code || "LIVE_SYS"})
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
              <button 
                onClick={abortDeleteSequence}
                disabled={isDeleting}
                className="w-1/2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold py-1.5 rounded-lg text-xs cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition shadow-sm"
              >
                Abort
              </button>
              <button 
                onClick={executeDeleteHandshake}
                disabled={isDeleting}
                className="w-1/2 bg-rose-600 text-white font-mono font-black py-1.5 rounded-lg text-xs cursor-pointer hover:bg-rose-700 active:bg-rose-800 transition shadow-sm flex items-center justify-center gap-1.5"
              >
                {isDeleting ? "PURGING..." : "EXECUTE_DELETE"}
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}