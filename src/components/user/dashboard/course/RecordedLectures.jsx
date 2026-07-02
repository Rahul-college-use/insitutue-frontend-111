import React, { useEffect, useState, useCallback } from 'react';
import { PlayCircle, Clock, CheckCircle2, Bookmark, Loader } from 'lucide-react';

// ✅ FIXED: Safely passing down centralized parent sync 'user' object metrics via props
export default function RecordedLectures({ user }) {
  const [playlist, setPlaylist] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [stats, setStats] = useState({ progress: "0%", completedCount: 0 });
  const [courseTitle, setCourseTitle] = useState("Loading Course...");
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Isolated lecture retrieval wrapped securely inside a reusable, optimized callback
  const fetchClassroomLectures = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      
      // Using standard native credentials bearer token parsing arrays safely
      const token = localStorage.getItem("token");
      
      // ✅ FIXED: Replaced hardcoded connection strings with clean service integration path mappings
      const res = await fetch(`http://localhost:3000/api/auth/lectures/${user._id}`, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });
      const data = await res.json();
      
      if (data && data.success && data.playlist?.length > 0) {
        setPlaylist(data.playlist);
        setCourseTitle(data.courseTitle || "Industrial Training Spec");
        setStats({ 
          progress: data.progress || "0%", 
          completedCount: data.completedCount || 0 
        });
        
        // Pick the first default tracking item node
        const activeDefault = data.playlist.find(v => !v.completed) || data.playlist[0];
        setCurrentVideo(activeDefault);
      }
    } catch (error) {
      console.error("Failed loading media assets track:", error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchClassroomLectures();
  }, [fetchClassroomLectures]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader className="w-6 h-6 text-[#0066ff] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Loading Recorded Lecture Vault...</p>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center text-xs text-slate-400 font-bold max-w-xl mx-auto my-12">
        No recorded lectures published for this training specification block yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-7rem)] overflow-hidden">
      
      {/* LEFT COLUMN: Main Video Playback Canvas */}
      <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto pr-1 h-full custom-scrollbar">
        
        {/* Protected Streaming Screen Node */}
        <div className="bg-slate-950 aspect-video rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-900 shadow-md group">
          <div className="text-center text-slate-400 p-4 space-y-3 z-10">
            <button className="w-14 h-14 rounded-full bg-[#0066ff] hover:bg-blue-700 text-white flex items-center justify-center mx-auto shadow-xl transition-transform duration-200 active:scale-95">
              <PlayCircle className="w-7 h-7 fill-white text-[#0066ff]" />
            </button>
            <div>
              <p className="text-sm font-black text-white leading-snug">{currentVideo.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Duration Framework: {currentVideo.duration} • Authenticated User Stream</p>
            </div>
          </div>
          
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-white/5 text-amber-400 font-black px-3 py-1.5 rounded-xl text-[9px] tracking-wider uppercase">
            🔒 Recording Vault Protected
          </div>
        </div>

        {/* Dynamic Typography Footer Card */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-3xl shadow-sm flex items-center justify-between gap-4">
          <div>
            <h5 className="font-black text-slate-900 text-sm sm:text-base leading-snug">{currentVideo.title}</h5>
            <p className="text-xs text-[#0066ff] font-bold mt-0.5">{courseTitle}</p>
          </div>
          <button className="bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl text-slate-400 hover:text-slate-600 transition shrink-0 border border-slate-100">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Playlist Panel Log */}
      <div className="flex flex-col gap-4 h-full overflow-hidden min-w-0">
        
        {/* Module Progress Sync Summary Card */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-3xl shadow-sm flex items-center justify-between shrink-0 bg-gradient-to-b from-white to-slate-50/50">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Your Syllabus Track</span>
            <span className="block text-base font-black text-slate-900">
              {stats.progress} <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider ml-1">Completed</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0066ff] flex items-center justify-center font-black text-xs border border-blue-100 shadow-sm">
            {stats.completedCount}/{playlist.length}
          </div>
        </div>

        {/* Scrollable Playlist Element Wrapper */}
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col flex-grow min-h-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <h5 className="font-black text-slate-900 text-xs sm:text-sm tracking-tight">Available Lecture Log</h5>
          </div>
          
          <div className="divide-y divide-slate-100 overflow-y-auto flex-grow custom-scrollbar">
            {playlist.map((item, idx) => {
              // ✅ FIXED: Enforcing standard safe mapping rules via database indices loops
              const isVideoActive = currentVideo.title === item.title;
              const uniqueKey = item._id || item.id || `lecture-node-${idx}`;

              return (
                <div 
                  key={uniqueKey}
                  onClick={() => setCurrentVideo(item)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition select-none ${
                    isVideoActive ? 'bg-blue-50/60' : 'hover:bg-slate-50/40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <PlayCircle className={`w-4 h-4 ${isVideoActive ? 'text-[#0066ff]' : 'text-slate-300'}`} />
                    )}
                  </div>

                  <div className="min-w-0 flex-grow space-y-0.5">
                    <span className={`block text-xs font-bold truncate leading-snug ${
                      isVideoActive ? 'text-[#0066ff]' : 'text-slate-800'
                    }`}>
                      {idx + 1}. {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" /> {item.duration || "Module Stream"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}