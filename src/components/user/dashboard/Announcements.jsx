import React, { useEffect, useState, useCallback } from 'react';
import { Bell, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { apiService } from '../../../services/api';

export default function Announcements({ user }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      // 📡 Hit real-time database live-feed endpoint directly map with user documents array
      const data = await apiService.getAnnouncements(token, user?._id);      
      // const response = await fetch(`http://localhost:3000/api/auth/announcements/live-feed`, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();

      if (data && data.success) {
        setAnnouncements(data.announcements || []);
      } else {
        // Safe state reset if API is reachable but returns false response triggers
        setAnnouncements([]);
      }
    } catch (err) {
      console.error("Announcements fetch failure:", err);
      setError("Failed to synchronize campus feed grid streams.");
      setAnnouncements([]); // Clear array to prevent any dirty placeholder state leaks
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchLiveAnnouncements();
  }, [fetchLiveAnnouncements]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <Loader2 className="w-6 h-6 text-[#0066ff] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">
            Polling Live Bulletin Board...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 space-y-6 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar font-sans antialiased">
      
      {/* 1. MODULE HEADLINE GRID BRANDING PANEL */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">Official Campus Circulars</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Stay verified with explicit system updates published live by administrators.</p>
        </div>
      </div>

      {/* 2. REAL BROADCAST BULLETINS RENDER STACK */}
      <div className="space-y-4">
        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-2.5 text-xs text-rose-600 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {announcements.length === 0 ? (
          /* ✅ PERFECT RECOVERY GATEWAY: Triggers ONLY when database has 0 notices */
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-xs text-slate-400 font-bold shadow-sm">
            No campus circulars or institutional notice logs published to your channel grid stream yet.
          </div>
        ) : (
          /* 🚀 RENDER ABSOLUTE REAL MONGO DATABASE LOGS STREAM ONLY */
          announcements.map((al, idx) => {
            const uniqueKey = al._id || al.id || `real-announcement-card-${idx}`;
            return (
              <div 
                key={uniqueKey} 
                className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden hover:border-slate-300 transition-all duration-200 animate-in fade-in slide-in-from-top-2"
              >
                {/* Brand Visual accent bounding rail line edge */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#0066ff]" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-2">
                  <h5 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0066ff] shrink-0" /> {al.title}
                  </h5>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {al.date}
                  </span>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed pl-6 pr-2">
                  {al.body}
                </p>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}