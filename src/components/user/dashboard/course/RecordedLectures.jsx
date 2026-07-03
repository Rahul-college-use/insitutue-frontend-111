import React, { useEffect, useState } from 'react';
import { Play, Clock, Loader, Video, ArrowLeft } from 'lucide-react';

export default function RecordedLectures({ user }) {
  const [playlist, setPlaylist] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [courseTitle, setCourseTitle] = useState("Industrial Training Spec");
  const [loading, setLoading] = useState(true);

  // 🎥 YouTube ID Extractor
  const extractYoutubeId = (urlStr) => {
    if (!urlStr) return '';
    const cleanUrl = urlStr.trim();
    if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('.')) return cleanUrl;
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/|live\/)|(?:(?:watch|\?v(?:i)?=|\&v(?:i)?=)))([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    return (match && match[1].length === 11) ? match[1] : cleanUrl;
  };

  // 🔄 Fetch playlist data straight from user model setup
  useEffect(() => {
    if (user?.enrolledCourses) {
      const targetCourse = Array.isArray(user.enrolledCourses) 
        ? user.enrolledCourses[0] 
        : user.enrolledCourses;

      if (targetCourse) {
        setCourseTitle(targetCourse.courseName || "Industrial Training Spec");
        setPlaylist(targetCourse.playlist || []);
      }
    }
    setLoading(false);
  }, [user]);

  // ⏭️ Next Lecture Logic
  const currentIdx = playlist.findIndex(item => item.title === currentVideo?.title);
  const hasNextVideo = currentIdx !== -1 && currentIdx < playlist.length - 1;

  const handleNextLecture = () => {
    if (hasNextVideo) {
      setCurrentVideo(playlist[currentIdx + 1]);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader className="w-8 h-8 text-[#0066ff] animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-medium">Loading Recorded Lectures...</p>
        </div>
      </div>
    );
  }

  const activeYtId = currentVideo ? extractYoutubeId(currentVideo.videoUrl || currentVideo.youtubeId) : '';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-7xl mx-auto transition-all duration-300">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h4 className="text-xl font-black text-slate-900 tracking-tight">Recorded Classroom Vault</h4>
          <p className="text-xs text-[#0066ff] font-bold mt-0.5">{courseTitle}</p>
        </div>
        
        {/* Buttons visible when video is playing */}
        {currentVideo && (
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <button 
              onClick={() => setCurrentVideo(null)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" /> Close Player
            </button>

            {hasNextVideo && (
              <button 
                onClick={handleNextLecture}
                className="flex items-center gap-2 text-xs font-bold text-white bg-[#0066ff] hover:bg-blue-700 px-4 py-2 rounded-xl transition shadow-sm shadow-blue-200"
              >
                Next Lecture →
              </button>
            )}
          </div>
        )}
      </div>

      {/* 🎬 ACTIVE VIDEO THEATER SCREEN NODE */}
      {currentVideo && (
        <div className="bg-slate-950 aspect-video w-full max-w-4xl mx-auto rounded-3xl relative overflow-hidden border border-slate-900 shadow-xl transition-all duration-500 animate-in fade-in zoom-in-95">
          {activeYtId ? (
            <iframe 
              className="absolute top-0 left-0 w-full h-full border-none rounded-3xl"
              src={`https://www.youtube.com/embed/${activeYtId}?autoplay=1&modestbranding=1&rel=0`}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          ) : (
            <div className="text-center text-slate-400 p-4 space-y-2 z-10">
              <Video className="w-8 h-8 text-[#0066ff] mx-auto animate-pulse" />
              <p className="text-xs sm:text-sm font-bold text-white">Stream layout breakdown exception.</p>
            </div>
          )}
        </div>
      )}

      {/* Title display just below the main active theater screen */}
      {currentVideo && (
        <div className="max-w-4xl mx-auto bg-blue-50/50 border border-blue-100/50 p-4 rounded-2xl">
          <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 block mb-1">Now Streaming</span>
          <h5 className="font-black text-slate-900 text-sm sm:text-base leading-snug">{currentVideo.title}</h5>
        </div>
      )}

      {/* 📦 LECTURES GRID LOG BOXES */}
      <div>
        <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
          Available Modules ({playlist.length})
        </h5>
        
        {playlist.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400 font-bold bg-white border border-slate-200/60 rounded-2xl">
            No published items found in your course configuration track.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlist.map((item, idx) => {
              const isVideoActive = currentVideo?.title === item.title;
              const isSomethingPlaying = currentVideo !== null;
              
              // 🧪 FIX: pointer-events-none ko hata diya taaki next cards par click ho sake
              const blurStyles = isSomethingPlaying && !isVideoActive 
                ? 'blur-[1.5px] opacity-50 scale-[0.98]' 
                : 'opacity-100 scale-100';

              const activeCardBorder = isVideoActive 
                ? 'border-[#0066ff] bg-blue-50/20 ring-2 ring-blue-600/10' 
                : 'border-slate-200/70 bg-white hover:border-slate-300 hover:shadow-md';

              return (
                <div 
                  key={item._id || item.id || idx}
                  onClick={() => setCurrentVideo(item)}
                  className={`border rounded-2xl p-4 flex flex-col justify-between gap-4 cursor-pointer transition-all duration-300 select-none ${activeCardBorder} ${blurStyles}`}
                >
                  <div className="space-y-2">
                    {/* Badge count number */}
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md inline-block ${
                      isVideoActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      Lecture {idx + 1}
                    </span>
                    
                    <h6 className={`text-sm font-black leading-snug tracking-tight line-clamp-2 ${
                      isVideoActive ? 'text-[#0066ff]' : 'text-slate-800'
                    }`}>
                      {item.title}
                    </h6>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1 shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-300" /> 
                      {item.duration || "Module Stream"}
                    </span>
                    
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center transition ${
                      isVideoActive ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                    }`}>
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}