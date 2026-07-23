import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Clock, Layers, Loader2, EyeOff, Command, Trash2, Video, Plus, ExternalLink, MessageSquare, Send,
  Download, Search, ShieldCheck, Mail, Smartphone, AlertTriangle, ChevronLeft, ChevronRight, Eye, Award, Monitor, AlertCircle, Edit2, X, AlertOctagon, FileText, CheckSquare, Square
} from 'lucide-react';
import { io } from 'socket.io-client';
import { apiService } from '../../services/api.js';

export default function CourseWorkshopDesk({ selectedCourseId, coursesList, triggerRefresh, routeToStudentAttendanceDesk }) {
  const [allocatedStudents, setAllocatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purgingId, setPurgingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [iframeError, setIframeError] = useState(false);
  
  // 📥 AUTO GENERATION ENGINE TRACKER & BULK STATE SELECTION MATRIX
  const [generatingDocsId, setGeneratingDocsId] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // 🎥 LIVE CLASSES HUB STATES
  const [liveTopic, setLiveTopic] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [liveTime, setLiveTime] = useState('');
  const [activeLiveClass, setActiveLiveClass] = useState(null);
  const [isLiveSubmitting, setIsLiveSubmitting] = useState(false);
  const [isEndingLive, setIsEndingLive] = useState(false);

  // 📂 RECORDED LECTURES STATES
  const [recordedPlaylist, setRecordedPlaylist] = useState([]);
  const [recFormData, setRecFormData] = useState({ title: '', videoUrl: '', duration: '' });
  const [editingRecId, setEditingRecId] = useState(null);
  const [isRecSubmitting, setIsRecSubmitting] = useState(false);

  // 💬 LIVE CHAT STATES
  const [adminMessage, setAdminMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatAllowed, setIsChatAllowed] = useState(true);

  const socketRef = useRef(null);
  const adminChatEndRef = useRef(null);

  // Pagination Matrix Bounds
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const url = "http://localhost:3000";
  const activeCourse = coursesList.find(c => c._id === selectedCourseId);

  const getStreamEngineType = (url) => {
    if (!url) return 'obs';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('zoom.us')) return 'zoom';
    return 'obs';
  };

  const extractYoutubeId = (url) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('.')) return cleanUrl;
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/|live\/)|(?:(?:watch|\?v(?:i)?=|\&v(?:i)?=)))([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    return (match && match[1].length === 11) ? match[1] : cleanUrl;
  };

  const currentStreamLink = activeLiveClass?.link || activeCourse?.liveClass?.link || activeCourse?.streamLink || '';
  const streamEngineType = getStreamEngineType(currentStreamLink);
  const liveSourcePayload = streamEngineType === 'youtube' ? extractYoutubeId(currentStreamLink) : currentStreamLink;

  const triggerToast = (msg, isError = false) => {
    setToastMessage({ text: msg, error: isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ⚡ AUTOMATED PIPELINE RESOLVER (ISSUE NEW ROUTINE)
  const handleAutoGenerateCertificate = async (studentId, studentName) => {
    try {
      setGeneratingDocsId(studentId);
      const token = localStorage.getItem("token");
      
      const payload = {
        studentId,
        courseSubject: activeCourse?.courseName || "Professional Development Program",
        score: 93,
        certificateNo: `IP-${selectedCourseId.substring(0,4).toUpperCase()}-${Date.now().toString().slice(-6)}`
      };

      const response = await fetch(`${url}/api/auth/admin/certificateRoutes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Compilation runtime error.");
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl, '_blank');
      triggerToast(`Certificate processed successfully for ${studentName}!`);
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      triggerToast(err.message || "Auto generation tunnel failed.", true);
    } finally {
      setGeneratingDocsId(null);
    }
  };

  // 👁️ VIEW DIRECTIVE FOR ALREADY ISSUED DOCUMENTS
  const handleViewCertificate = async (studentId, studentName) => {
    try {
      setGeneratingDocsId(studentId);
      const token = localStorage.getItem("token");
      
      // Request target parsing directly using payload endpoints
      const response = await fetch(`${url}/api/auth/admin/certificateRoutes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId,
          courseSubject: activeCourse?.courseName,
          score: 93,
          certificateNo: "PREVIEW_MODE_TRIGGER" 
        })
      });

      if (!response.ok) throw new Error("Could not fetch printable document view.");

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl, '_blank');
      triggerToast(`Viewing document bundle for ${studentName}`);
    } catch (err) {
      triggerToast(err.message, true);
    } finally {
      setGeneratingDocsId(null);
    }
  };

  // 🚀 BULK BATCH GENERATION MATRIX EXECUTOR
  const handleBulkIssueCertificates = async () => {
    if (selectedStudentIds.length === 0) return;
    try {
      setIsBulkProcessing(true);
      const token = localStorage.getItem("token");
      let successCount = 0;

      triggerToast(`Starting batch processing for ${selectedStudentIds.length} candidate nodes...`);

      for (const studentId of selectedStudentIds) {
        const payload = {
          studentId,
          courseSubject: activeCourse?.courseName || "Professional Development Program",
          score: 93,
          certificateNo: `IP-${selectedCourseId.substring(0,4).toUpperCase()}-${Math.random().toString().slice(-6)}`
        };

        const res = await fetch(`${url}/api/auth/admin/certificateRoutes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) successCount++;
      }

      triggerToast(`Batch operations complete: Successfully updated ${successCount} profiles.`);
      setSelectedStudentIds([]);
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      triggerToast("Fatal failure encountered during sequential bulk loop.", true);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllPage = (pageItems) => {
    const pageIds = pageItems.map(item => item._id);
    const allSelected = pageIds.every(id => selectedStudentIds.includes(id));
    
    if (allSelected) {
      setSelectedStudentIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedStudentIds(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  const handlePlaceholderOfferLetter = (studentName) => {
    triggerToast(`Offer Letter dynamic script hook initialized for ${studentName}.`);
  };

  const fetchRecordedLectures = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/api/auth/lectures/get/${selectedCourseId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setRecordedPlaylist(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!selectedCourseId) return;
    setIframeError(false);

    socketRef.current = io(url, {
      transports: ['websocket'],
      upgrade: false,
      forceNew: true,
      autoConnect: true
    });

    const fetchCourseRosterAndChat = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`${url}/api/auth/admin/courses/${selectedCourseId}/students`, {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setAllocatedStudents(data.data || []);

        const historyData = await apiService.chathistory(selectedCourseId);
        if (historyData && historyData.success) {
          setChatMessages(historyData.history || historyData.data || []);
          if (historyData.isChatEnabled !== undefined) setIsChatAllowed(historyData.isChatEnabled);
        }

        socketRef.current.emit("join_classroom", { courseId: selectedCourseId, user: "Instructor Overlord" });
        await fetchRecordedLectures();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseRosterAndChat();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [selectedCourseId, triggerRefresh]);

  useEffect(() => {
    adminChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleAdminSendMessage = (e) => {
    e.preventDefault();
    if (!adminMessage.trim()) return;

    const adminPayload = {
      courseId: selectedCourseId,
      user: "Admin / Instructor",
      text: adminMessage,
      isInstructor: true,
      createdAt: new Date().toISOString()
    };

    socketRef.current.emit("send_message", adminPayload);
    setAdminMessage('');
  };

  const handleToggleChatStatus = async () => {
    try {
      const nextChatState = !isChatAllowed;
      const token = localStorage.getItem("token");
      
      await fetch(`${url}/api/auth/admin/toggleChat/courses/${selectedCourseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ isChatEnabled: nextChatState })
      });
      setIsChatAllowed(nextChatState);
      triggerToast(`Chat rooms successfully ${nextChatState ? 'Unlocked' : 'Locked'}`);
    } catch (err) {
      triggerToast("Validation error changing chat states.", true);
    }
  };

  const handlePostLiveClass = async (e) => {
    e.preventDefault();
    if (!liveTopic || !liveLink || !liveTime) return triggerToast("Fill all field tokens.", true);
    try {
      setIsLiveSubmitting(true);
      const token = localStorage.getItem("token");
      await fetch(`${url}/api/auth/admin/courses/${selectedCourseId}/live-class`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ topic: liveTopic, link: liveLink, scheduledAt: liveTime })
      });
      setActiveLiveClass({ topic: liveTopic, link: liveLink, scheduledAt: liveTime });
      setLiveTopic(''); setLiveLink(''); setLiveTime('');
      triggerToast("Live class transmission active!");
    } catch (err) {
      triggerToast("Error publishing live tunnel context.", true);
    } finally {
      setIsLiveSubmitting(false);
    }
  };

  const handleEndLiveClass = async () => {
    if (!window.confirm("🚨 Are you sure you want to completely end this live session?")) return;
    try {
      setIsEndingLive(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/api/auth/admin/courses/end-class/${selectedCourseId}`, { method: "POST", headers: { "Authorization": `Bearer ${token}` } });
      if(res.ok) {
        setActiveLiveClass(null);
        setChatMessages([]);
        triggerToast("Live tunnel context terminated.");
      }
    } catch (err) {
      triggerToast("Error stopping pipeline.", true);
    } finally {
      setIsEndingLive(false);
    }
  };

  const handleSaveRecordedLecture = async (e) => {
    e.preventDefault();
    if (!recFormData.title || !recFormData.videoUrl) return triggerToast("Form missing metrics.", true);
    try {
      setIsRecSubmitting(true);
      const token = localStorage.getItem("token");
      const method = editingRecId ? "PUT" : "POST";
      const endpoint = editingRecId ? `${url}/api/auth/lectures/${selectedCourseId}/edit/${editingRecId}` : `${url}/api/auth/lectures/${selectedCourseId}/add`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(recFormData)
      });
      const data = await res.json();
      if (data.success) {
        setRecFormData({ title: '', videoUrl: '', duration: '' });
        setEditingRecId(null);
        await fetchRecordedLectures();
        triggerToast("Lecture matrix updated successfully!");
      }
    } catch (err) {
      triggerToast("Failed writing stream asset.", true);
    } finally {
      setIsRecSubmitting(false);
    }
  };

  const handleDeleteRecordedLecture = async (lectureId) => {
    if (!window.confirm("Purge recording?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${url}/api/auth/lectures/${selectedCourseId}/delete/${lectureId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      await fetchRecordedLectures();
      triggerToast("Deleted recorded asset.");
    } catch (err) {
      triggerToast("Deletion failure.", true);
    }
  };

  const handlePurgeSequence = async (studentId, studentName) => {
    if (!window.confirm(`Drop candidate ${studentName}?`)) return;
    try {
      setPurgingId(studentId);
      const token = localStorage.getItem("token");
      await fetch(`${url}/api/auth/admin/courses/${selectedCourseId}/purge/${studentId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      setAllocatedStudents(prev => prev.filter(s => s._id !== studentId));
      triggerToast(`Successfully dropped ${studentName}`);
    } catch (err) {
      console.error(err);
    } finally {
      setPurgingId(null);
    }
  };

  const filteredRoster = allocatedStudents.filter(student =>
    student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.universityRoll?.toString().includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredRoster.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRosterPage = filteredRoster.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <div className="p-8 text-center text-xs font-mono text-zinc-400">LOADING_WORKSPACE_METRICS...</div>;

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 text-zinc-900 dark:text-zinc-100 w-full box-border overflow-x-hidden">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl text-xs font-bold ${toastMessage.error ? 'bg-rose-950 border-rose-800 text-rose-300' : 'bg-zinc-900 border-zinc-800 text-zinc-200'}`}>
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER CONTROLS */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800/40 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xs font-mono font-black text-zinc-800 dark:text-white uppercase tracking-wider">WORKSPACE_CONSOLE // {activeCourse?.courseName}</h3>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center w-full md:w-auto">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs pl-9 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 font-medium text-zinc-900 dark:text-white"
            />
          </div>
          <button onClick={handleToggleChatStatus} className="flex items-center justify-center gap-1.5 border px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800">
            <EyeOff className="w-3.5 h-3.5" /> {isChatAllowed ? "Lock Chat Feed" : "Unlock Chat Feed"}
          </button>
          
          {selectedStudentIds.length > 0 && (
            <button 
              onClick={handleBulkIssueCertificates}
              disabled={isBulkProcessing}
              className="flex items-center justify-center gap-1.5 bg-amber-500 text-black px-3 py-1.5 rounded-lg text-[11px] font-black transition cursor-pointer tracking-tight shadow-md disabled:opacity-50"
            >
              {isBulkProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
              Issue Batch ({selectedStudentIds.length})
            </button>
          )}
        </div>
      </div>

      {/* VIDEO PREVIEW MONITOR */}
      {currentStreamLink && (
        <div className="space-y-3 w-full">
          <div className="w-full bg-slate-950 aspect-video rounded-xl relative overflow-hidden flex items-center justify-center border border-zinc-800 shadow-md">
            {streamEngineType === 'youtube' && liveSourcePayload ? (
              !iframeError ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-none rounded-xl"
                  src={`https://www.youtube.com/embed/${liveSourcePayload}?autoplay=0&mute=1&modestbranding=1&rel=0`}
                  title="Admin Monitor"
                  allowFullScreen
                  onError={() => setIframeError(true)}
                />
              ) : (
                <div className="text-center p-4 space-y-2 z-10">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
                  <a href={`https://www.youtube.com/watch?v=${liveSourcePayload}`} target="_blank" rel="noopener noreferrer" className="inline-flex bg-amber-500 text-black text-[10px] font-black px-4 py-2 rounded-lg">Open Link Externally</a>
                </div>
              )
            ) : (
              <div className="text-center text-zinc-400 p-4 space-y-1 z-10">
                <Video className="w-7 h-7 text-amber-500 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-white font-mono">EXTERNAL OBS TUNNEL ACTIVE</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button onClick={handleEndLiveClass} disabled={isEndingLive} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 text-white font-mono font-bold px-4 py-2 rounded-xl text-xs uppercase cursor-pointer">
              {isEndingLive ? "TERMINATING..." : "End Session & Wipe Buffer"}
            </button>
          </div>
        </div>
      )}

      {/* THREE COLUMN GRID INTERFACE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-4 shadow-sm h-fit w-full box-border">
          <h4 className="text-xs font-black text-zinc-900 dark:text-white flex items-center"><Video className="w-3.5 h-3.5 text-amber-500 mr-1.5" /> INITIATE LIVE TUNNEL</h4>
          <form onSubmit={handlePostLiveClass} className="space-y-3 text-[11px]">
            <input type="text" placeholder="Session Topic Title" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg outline-none" value={liveTopic} onChange={(e) => setLiveTopic(e.target.value)} />
            <input type="url" placeholder="Stream Target URL" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg outline-none" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
            <input type="datetime-local" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg outline-none" value={liveTime} onChange={(e) => setLiveTime(e.target.value)} />
            <button type="submit" className="w-full bg-amber-500 text-black font-black py-2 rounded-lg uppercase cursor-pointer" disabled={isLiveSubmitting}>Transmit Stream Data</button>
          </form>
        </div>

        <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-4 shadow-sm h-fit w-full box-border">
          <h4 className="text-xs font-black text-zinc-900 dark:text-white flex items-center"><Video className="w-3.5 h-3.5 text-blue-500 mr-1.5" /> RECORDING MANAGEMENT</h4>
          <form onSubmit={handleSaveRecordedLecture} className="space-y-3 text-[11px]">
            <input type="text" placeholder="Lecture Title / Topic" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg outline-none" value={recFormData.title} onChange={(e) => setRecFormData({ ...recFormData, title: e.target.value })} />
            <input type="url" placeholder="YouTube Video URL" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg outline-none" value={recFormData.videoUrl} onChange={(e) => setRecFormData({ ...recFormData, videoUrl: e.target.value })} />
            <input type="text" placeholder="Duration (e.g. 45:10)" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg outline-none" value={recFormData.duration} onChange={(e) => setRecFormData({ ...recFormData, duration: e.target.value })} />
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-2 rounded-lg uppercase cursor-pointer" disabled={isRecSubmitting}>Publish Recording</button>
          </form>
        </div>

        <div className="bg-[#09090b] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col justify-between h-[320px] md:col-span-2 lg:col-span-1 w-full box-border">
          <h4 className="text-xs font-black text-white flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-blue-500" /> FEED MONITOR</h4>
          <div className="my-3 flex-grow overflow-y-auto pr-1 space-y-2 text-[11px] max-h-[200px] custom-scrollbar">
            {chatMessages.map((msg, i) => (
              <div key={i} className="p-2 rounded-xl border bg-zinc-900 border-zinc-800 text-zinc-300">
                <span className="font-mono text-[9px] font-bold block text-zinc-500">{msg.user}</span>
                <p className="font-sans font-medium">{msg.text}</p>
              </div>
            ))}
            <div ref={adminChatEndRef} />
          </div>
          <form onSubmit={handleAdminSendMessage} className="flex gap-2 pt-2 border-t border-zinc-900">
            <input type="text" value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} placeholder="Type statement..." className="flex-grow px-3 py-2 text-xs bg-[#050507] border border-zinc-800 rounded-lg text-zinc-300 outline-none" />
            <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-lg cursor-pointer"><Send className="w-3.5 h-3.5" /></button>
          </form>
        </div>
      </div>

      {/* ADVANCED BATCH SELECTION ROSTER MANAGEMENT TABLE */}
      <div className="w-full overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#09090b]/40 shadow-sm box-border">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs min-w-[950px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800/50 text-zinc-400 bg-zinc-50 dark:bg-[#0c0c0e] text-[9px] font-mono uppercase tracking-widest">
                <th className="p-4 w-12 text-center">
                  <button 
                    onClick={() => toggleSelectAllPage(currentRosterPage)}
                    className="text-zinc-400 hover:text-white transition cursor-pointer outline-none"
                  >
                    {currentRosterPage.length > 0 && currentRosterPage.every(item => selectedStudentIds.includes(item._id)) ? (
                      <CheckSquare className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4">UID / ROLL</th>
                <th className="p-4">Candidate Identity</th>
                <th className="p-4">Department Spec</th>
                <th className="p-4 text-center">Dynamic Processing Hub</th>
                <th className="p-4 text-right">Action Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold">
              {currentRosterPage.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-zinc-400 font-mono">NO_STUDENTS_MATCHING_CRITERIA</td>
                </tr>
              ) : (
                currentRosterPage.map((student) => (
                  <tr key={student._id} className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 text-center w-12">
                      <button 
                        onClick={() => toggleSelectStudent(student._id)}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer outline-none"
                      >
                        {selectedStudentIds.includes(student._id) ? (
                          <CheckSquare className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 font-mono text-blue-600 dark:text-blue-400">{student.universityRoll || student._id?.substring(0, 8).toUpperCase()}</td>
                    <td className="p-4 font-black text-zinc-900 dark:text-white">{student.fullName}</td>
                    <td className="p-4 text-zinc-400">{student.department || "Computer Science Engineering"}</td>
                    
                    {/* ACCREDITATION PIPELINE ACTION HUBS */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800/60">
                        <button
                          disabled={generatingDocsId !== null}
                          onClick={() => handleAutoGenerateCertificate(student._id, student.fullName)}
                          className="px-2.5 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition text-zinc-800 dark:text-zinc-200 font-bold"
                        >
                          <Plus className="w-2.5 h-2.5 text-emerald-500" />
                          Issue Cert
                        </button>

                        <button
                          disabled={generatingDocsId !== null}
                          onClick={() => handleViewCertificate(student._id, student.fullName)}
                          className="px-2.5 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition text-zinc-800 dark:text-zinc-200 font-bold"
                        >
                          <Eye className="w-2.5 h-2.5 text-blue-500" />
                          View
                        </button>
                        
                        <button
                          onClick={() => handlePlaceholderOfferLetter(student.fullName)}
                          className="px-2.5 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition text-zinc-400"
                        >
                          <FileText className="w-2.5 h-2.5 text-purple-500" />
                          Offer Letter
                        </button>
                      </div>
                    </td>

                    <td className="p-4 flex items-center justify-end gap-2 shrink-0">
                      <button
                        onClick={() => routeToStudentAttendanceDesk(student._id, selectedCourseId)}
                        className="px-2.5 py-1 bg-zinc-900 hover:bg-blue-600 text-white dark:bg-zinc-800 border border-transparent rounded text-[10px] font-mono uppercase cursor-pointer flex items-center gap-1 transition"
                      >
                        <Eye className="w-3 h-3" /> Audit Desk
                      </button>
                      <button
                        disabled={purgingId === student._id}
                        onClick={() => handlePurgeSequence(student._id, student.fullName)}
                        className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:bg-rose-600 hover:text-white rounded text-[10px] uppercase cursor-pointer transition disabled:opacity-50"
                      >
                        {purgingId === student._id ? "Dropping..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION INTERFACES */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 text-[11px] pt-1">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-1 rounded bg-white dark:bg-zinc-900 border disabled:opacity-40 cursor-pointer text-zinc-500"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <span className="font-mono text-zinc-400">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-1 rounded bg-white dark:bg-zinc-900 border disabled:opacity-40 cursor-pointer text-zinc-500"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
      )}
    </div>
  );
}