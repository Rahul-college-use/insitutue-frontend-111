import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Clock, Layers, Loader2, EyeOff, Command, Trash2, Video, Plus, ExternalLink, MessageSquare, Send,
  Download, Search, ShieldCheck, Mail, Smartphone, AlertTriangle, ChevronLeft, ChevronRight, Eye, Award, Monitor, AlertCircle, Edit2, X, AlertOctagon
} from 'lucide-react';
import { io } from 'socket.io-client';
import { apiService } from '../../services/api.js';
import IssueCertificateModal from './IssueCertificateModal';

export default function CourseWorkshopDesk({ selectedCourseId, coursesList, triggerRefresh, routeToStudentAttendanceDesk }) {
  const [allocatedStudents, setAllocatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purgingId, setPurgingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [modalContext, setModalContext] = useState(null);
  const [iframeError, setIframeError] = useState(false);

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

  const url = "http://localhost:3000 || https://internshipplace-bend.vercel.app/api/auth";
  const activeCourse = coursesList.find(c => c._id === selectedCourseId);

  // Stream Extraction Utilities
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

  // 🔄 Fetch Recorded Lectures
  const fetchRecordedLectures = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/api/auth/lectures/get/${selectedCourseId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("Fetched recorded lectures:", data);
      if (data.success) {
        setRecordedPlaylist(data.data || []);
      }
    } catch (err) {
      console.error("Failed loading recorded playlist:", err);
    }
  };
  console.log("Recorded Lectures Playlist:", recordedPlaylist,"total",recordedPlaylist.length);
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
        if (activeCourse?.liveClass) setActiveLiveClass(activeCourse.liveClass);

        // Fetch recorded videos list
        await fetchRecordedLectures();

      } catch (err) {
        console.error("Data pipeline load crash:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseRosterAndChat();

    socketRef.current.on("receive_message", (newMessage) => {
      setChatMessages((prev) => [...prev, newMessage]);
    });

    socketRef.current.on("chat_status_updated", (data) => {
      setIsChatAllowed(data.isChatEnabled);
    });

    socketRef.current.on("toggle_chat_status", (data) => {
      setIsChatAllowed(data.isChatEnabled);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message");
        socketRef.current.off("chat_status_updated");
        socketRef.current.off("toggle_chat_status");
        socketRef.current.disconnect();
      }
    };
  }, [selectedCourseId, triggerRefresh, activeCourse]);

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
      
      const data = await fetch(`${url}/api/auth/admin/toggleChat/courses/${selectedCourseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isChatEnabled: nextChatState })
      });

      if (!data.ok) throw new Error("Failed to toggle chat status on server.");
      setIsChatAllowed(nextChatState);

      if (socketRef.current) {
        socketRef.current.emit("toggle_chat_status", {
          courseId: selectedCourseId,
          isChatEnabled: nextChatState
        });
      }

      triggerToast(`Chat rooms successfully ${nextChatState ? 'Unlocked' : 'Locked'}`);
    } catch (err) {
      triggerToast("Failed to switch chat channel validation state.", true);
    }
  };

  const handlePostLiveClass = async (e) => {
    e.preventDefault();
    if (!liveTopic || !liveLink || !liveTime) {
      triggerToast("Please populate all parameters for the live class frame.", true);
      return;
    }
    try {
      setIsLiveSubmitting(true);
      const token = localStorage.getItem("token");
      await fetch(`${url}/api/auth/admin/courses/${selectedCourseId}/live-class`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ topic: liveTopic, link: liveLink, scheduledAt: liveTime })
      });
      const newLiveSession = { topic: liveTopic, link: liveLink, scheduledAt: liveTime };
      setActiveLiveClass(newLiveSession);
      setLiveTopic(''); setLiveLink(''); setLiveTime('');
      setIframeError(false);
      triggerToast("Live class transmission tunnel verified and posted!");
      if(triggerRefresh) triggerRefresh();
    } catch (err) {
      setActiveLiveClass({ topic: liveTopic, link: liveLink, scheduledAt: liveTime });
    } finally {
      setIsLiveSubmitting(false);
    }
  };

  // 🛑 END LIVE SESSION FUNCTIONALITY WITH WIPE BUFFER LOGIC
  const handleEndLiveClass = async () => {
    if (!window.confirm("🚨 Are you absolutely sure you want to completely end this live session and purge the classroom chat room buffer?")) return;
    try {
      setIsEndingLive(true);
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${url}/api/auth/admin/courses/end-class/${selectedCourseId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });
      
      const responseData = await res.json();
      
      if(res.ok || responseData.success) {
        // Clear States Locally
        setActiveLiveClass(null);
        setChatMessages([]);
        setIframeError(false);
        
        // Broadcast through socket if alive
        if (socketRef.current) {
          socketRef.current.emit("live_session_terminated", { courseId: selectedCourseId });
        }
        
        triggerToast("Live session safely closed and chat buffer successfully wiped.");
        if (triggerRefresh) triggerRefresh();
      } else {
        throw new Error(responseData.message || "Failed terminal response on server");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Failed terminating pipeline. Manual server override required.", true);
    } finally {
      setIsEndingLive(false);
    }
  };

  // 📝 RECORDED LECTURE ADD / EDIT SUBMIT
  const handleSaveRecordedLecture = async (e) => {
    e.preventDefault();
    if (!recFormData.title || !recFormData.videoUrl) {
      triggerToast("Please fill title and video URL.", true);
      return;
    }

    try {
      setIsRecSubmitting(true);
      const token = localStorage.getItem("token");
      const method = editingRecId ? "PUT" : "POST";
      const endpoint = editingRecId 
        ? `${url}/api/auth/lectures/${selectedCourseId}/edit/${editingRecId}`
        : `${url}/api/auth/lectures/${selectedCourseId}/add`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(recFormData)
      });
      const data = await res.json();

      if (data.success) {
        triggerToast(editingRecId ? "Lecture updated!" : "Lecture published successfully!");
        setRecFormData({ title: '', videoUrl: '', duration: '' });
        setEditingRecId(null);
        await fetchRecordedLectures(); 
      }
    } catch (err) {
      console.error(err);
      triggerToast("Failed to save recorded lecture.", true);
    } finally {
      setIsRecSubmitting(false);
    }
  };

  // 🗑️ RECORDED LECTURE DELETE
  const handleDeleteRecordedLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to completely delete this recorded lecture?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/api/auth/lectures/${selectedCourseId}/delete/${lectureId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Lecture deleted successfully!");
        await fetchRecordedLectures();
      }
    } catch (err) {
      console.error(err);
      triggerToast("Failed to delete lecture.", true);
    }
  };

  // 🛠️ SETUP EDIT MODE FOR RECORDED
  const startEditRecSequence = (item) => {
    setEditingRecId(item._id || item.id);
    setRecFormData({
      title: item.title,
      videoUrl: item.videoUrl || `https://youtube.com/watch?v=${item.youtubeId}`,
      duration: item.duration || ''
    });
  };

  const handlePurgeSequence = async (studentId, studentName) => {
    if (!window.confirm(`Are you absolutely sure you want to terminate ${studentName}?`)) return;
    try {
      setPurgingId(studentId);
      const token = localStorage.getItem("token");
      await fetch(`${url}/api/auth/admin/courses/${selectedCourseId}/purge/${studentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
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
    <div className="space-y-6 px-2 sm:px-4 md:px-6 animate-in fade-in duration-200 text-zinc-900 dark:text-zinc-100">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl text-xs font-bold ${toastMessage.error ? 'bg-rose-950 border-rose-800 text-rose-300' : 'bg-zinc-900 border-zinc-800 text-zinc-200'}`}>
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/40 pb-5">
        <div>
          <h3 className="text-xs font-mono font-black text-zinc-800 dark:text-white uppercase tracking-wider">WORKSPACE_CONSOLE // {activeCourse?.courseName}</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
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
          <button onClick={handleToggleChatStatus} className={`flex items-center justify-center gap-1.5 border px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0 ${isChatAllowed ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800' : 'bg-rose-600 text-white border-transparent'}`}>
            <EyeOff className="w-3.5 h-3.5" /> {isChatAllowed ? "Lock Live Chat" : "Unlock Live Chat"}
          </button>
        </div>
      </div>

      {/* 📺 VIDEO PLAYER PIPELINE PREVIEW FOR ADMIN */}
      {currentStreamLink && (
        <div className="space-y-3">
          <div className="w-full bg-slate-950 aspect-video rounded-xl relative overflow-hidden flex items-center justify-center border border-zinc-800 shadow-md">
            {streamEngineType === 'youtube' && liveSourcePayload ? (
              !iframeError ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-none rounded-xl"
                  src={`https://www.youtube.com/embed/${liveSourcePayload}?autoplay=0&mute=1&modestbranding=1&rel=0`}
                  title="Admin Live Stream Monitor"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onError={() => setIframeError(true)}
                />
              ) : (
                <div className="text-center p-4 space-y-2 z-10">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
                  <p className="text-xs font-black text-white">Stream Preview Terminated By Protocol</p>
                  <a href={`https://www.youtube.com/watch?v=${liveSourcePayload}`} target="_blank" rel="noopener noreferrer" className="inline-flex bg-amber-500 text-black text-[10px] font-black px-4 py-2 rounded-lg">Open Link Externally</a>
                </div>
              )
            ) : streamEngineType === 'zoom' && liveSourcePayload ? (
              <div className="text-center p-4 space-y-2 z-10">
                <Monitor className="w-10 h-10 text-blue-500 mx-auto" />
                <p className="text-xs font-black text-white">Zoom Session Active (No Embed Preview Available)</p>
                <a href={liveSourcePayload} target="_blank" rel="noopener noreferrer" className="inline-flex bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-lg">Enter Admin Zoom Space</a>
              </div>
            ) : (
              <div className="text-center text-zinc-400 p-4 space-y-1 z-10">
                <Video className="w-7 h-7 text-amber-500 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-white font-mono">EXTERNAL OBS TUNNEL ACTIVE</p>
              </div>
            )}
          </div>
          
          {/* RED DESIGNER END LIVE CLASS ACTION MATRIX BUTTON */}
          <div className="flex justify-end">
            <button 
              onClick={handleEndLiveClass}
              disabled={isEndingLive}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800/50 text-white font-mono font-bold px-4 py-2 rounded-xl text-xs uppercase shadow-lg shadow-rose-600/10 cursor-pointer transition-all"
            >
              {isEndingLive ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> TERMINATING SESSION...
                </>
              ) : (
                <>
                  <AlertOctagon className="w-3.5 h-3.5" /> End Live Session & Wipe Chat
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MULTI COLUMN MANAGEMENT HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Stream Management Tunnel Form */}
        <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-4 shadow-sm h-fit">
          <h4 className="text-xs font-black text-zinc-900 dark:text-white tracking-tight flex items-center"><Video className="w-3.5 h-3.5 text-amber-500 mr-1.5" /> INITIATE LIVE TUNNEL</h4>
          <form onSubmit={handlePostLiveClass} className="space-y-3 text-[11px]">
            <input type="text" placeholder="Session Topic Title" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg text-zinc-800 dark:text-zinc-200 outline-none" value={liveTopic} onChange={(e) => setLiveTopic(e.target.value)} />
            <input type="url" placeholder="Stream Target URL" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg text-zinc-800 dark:text-zinc-200 outline-none" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
            <input type="datetime-local" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg text-zinc-800 dark:text-zinc-200 outline-none" value={liveTime} onChange={(e) => setLiveTime(e.target.value)} />
            <button type="submit" className="w-full bg-amber-500 text-black font-black py-2 rounded-lg text-[10px] uppercase cursor-pointer" disabled={isLiveSubmitting}>{isLiveSubmitting ? "TRANSMITTING..." : "Transmit Stream Data"}</button>
          </form>
        </div>

        {/* 2. 📁 RECORDED LECTURE MANAGER WORKSPACE */}
        <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-4 shadow-sm h-fit">
          <h4 className="text-xs font-black text-zinc-900 dark:text-white tracking-tight flex items-center"><Video className="w-3.5 h-3.5 text-blue-500 mr-1.5" /> {editingRecId ? "EDIT RECORDED CLASS" : "UPLOAD RECORDED CLASS"}</h4>
          <form onSubmit={handleSaveRecordedLecture} className="space-y-3 text-[11px]">
            <input type="text" placeholder="Lecture Title / Topic" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg text-zinc-800 dark:text-zinc-200 outline-none" value={recFormData.title} onChange={(e) => setRecFormData({ ...recFormData, title: e.target.value })} />
            <input type="url" placeholder="YouTube Video URL" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg text-zinc-800 dark:text-zinc-200 outline-none" value={recFormData.videoUrl} onChange={(e) => setRecFormData({ ...recFormData, videoUrl: e.target.value })} />
            <div className="flex gap-2">
              <input type="text" placeholder="Duration (e.g. 45:10)" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg text-zinc-800 dark:text-zinc-200 outline-none" value={recFormData.duration} onChange={(e) => setRecFormData({ ...recFormData, duration: e.target.value })} />
              {editingRecId && (
                <button type="button" onClick={() => { setEditingRecId(null); setRecFormData({ title: '', videoUrl: '', duration: '' }); }} className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 p-2 rounded-lg"><X className="w-3.5 h-3.5" /></button>
              )}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-2 rounded-lg text-[10px] uppercase cursor-pointer" disabled={isRecSubmitting}>
              {editingRecId ? "Update Recording" : "Publish Recording"}
            </button>
          </form>

          {/* Current Course Recorded List Minimal Hook */}
          <div className="max-h-[120px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900 border border-zinc-100 dark:border-zinc-900 rounded-lg custom-scrollbar">
            {recordedPlaylist.length === 0 ? (
              <p className="text-center text-zinc-400 py-4 text-[10px] uppercase font-mono">No lectures uploaded</p>
            ) : (
              recordedPlaylist.map((item, index) => (
                <div key={item._id || index} className="p-2 flex items-center justify-between text-[11px] hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                  <p className="truncate font-medium text-zinc-700 dark:text-zinc-300 pr-2">{index + 1}. {item.title}</p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => startEditRecSequence(item)} className="p-1 text-zinc-400 hover:text-blue-500 transition"><Edit2 className="w-3 h-3" /></button>
                    <button onClick={() => handleDeleteRecordedLecture(item._id || item.id)} className="p-1 text-zinc-400 hover:text-rose-500 transition"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. 💬 LIVE ADMIN CHAT FEED MONITOR */}
        <div className="bg-[#09090b] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col justify-between h-[340px]">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase text-zinc-500 block">LIVE_CHAT_STREAM_BUFFER</span>
            <h4 className="text-xs font-black text-white mt-0.5 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-blue-500" /> CLASSROOM FEED MONITOR</h4>
          </div>

          <div className="my-3 flex-grow overflow-y-auto pr-1 space-y-2 custom-scrollbar text-[11px]">
            {chatMessages.length === 0 ? (
              <div className="text-center text-zinc-600 py-12 uppercase">[Buffer clean // Awaiting statements]</div>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i} className={`p-2 rounded-xl border ${msg.isInstructor ? 'bg-blue-950/20 border-blue-900 text-blue-400' : 'bg-zinc-900 border-zinc-800 text-zinc-300'}`}>
                  <div className="flex justify-between font-mono text-[9px] text-zinc-500 mb-0.5">
                    <span className="font-bold">{msg.user}</span>
                    <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString()}</span>
                  </div>
                  <p className="font-sans font-medium">{msg.text}</p>
                </div>
              ))
            )}
            <div ref={adminChatEndRef} />
          </div>

          <form onSubmit={handleAdminSendMessage} className="flex gap-2 pt-2 border-t border-zinc-900">
            <input type="text" value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} placeholder="Type instructor statement..." className="flex-grow px-3 py-2 text-xs bg-[#050507] border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition shrink-0 cursor-pointer"><Send className="w-3.5 h-3.5" /></button>
          </form>
        </div>

      </div>

      {/* ROSTER MANAGEMENT WITH RESPONSIVE TABLE WRAPPER */}
      <div className="space-y-3">
        <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200 dark:border-zinc-800/20 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800/50 text-zinc-400 bg-zinc-50 dark:bg-[#0c0c0e] text-[9px] font-mono uppercase tracking-widest">
                  <th className="p-4">UID / ROLL</th>
                  <th className="p-4">Candidate Identity</th>
                  <th className="p-4">Department Spec</th>
                  <th className="p-4 text-right">Action Matrix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold">
                {currentRosterPage.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-zinc-400 font-mono">NO_STUDENTS_MATCHING_CRITERIA</td>
                  </tr>
                ) : (
                  currentRosterPage.map((student) => (
                    <tr key={student._id} className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="p-4 font-mono text-blue-600 dark:text-blue-400">{student.universityRoll || student._id?.substring(0, 8).toUpperCase()}</td>
                      <td className="p-4 font-black text-zinc-900 dark:text-white">{student.fullName}</td>
                      <td className="p-4 text-zinc-400">{student.department || "Computer Science Engineering"}</td>
                      <td className="p-4 flex items-center justify-end gap-2 shrink-0">
                        <button
                          onClick={() => routeToStudentAttendanceDesk(student._id, selectedCourseId)}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-blue-600 text-white dark:bg-zinc-800 dark:hover:bg-blue-600 border border-transparent rounded text-[10px] font-mono uppercase tracking-wide cursor-pointer flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3" /> Audit Desk
                        </button>
                        <button
                          onClick={() => setModalContext({ id: student._id, name: student.fullName })}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/80 border border-transparent dark:border-zinc-800 rounded text-[10px] font-mono uppercase tracking-wide cursor-pointer flex items-center gap-1 transition"
                        >
                          <Award className="w-3 h-3" /> Issue Docs
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION TOOL BAR MATRIX */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 text-[11px] pt-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 cursor-pointer text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-zinc-400">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 cursor-pointer text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {modalContext && (
        <IssueCertificateModal
          studentId={modalContext.id}
          studentName={modalContext.name}
          courseId={selectedCourseId}
          onClose={() => setModalContext(null)}
          triggerRefresh={triggerRefresh}
        />
      )}

    </div>
  );
}