import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Clock, Layers, Loader2, EyeOff, Command, Trash2, Video, Plus, ExternalLink, MessageSquare, Send,
  Download, Search, ShieldCheck, Mail, Smartphone, AlertTriangle, ChevronLeft, ChevronRight, Eye, Award
} from 'lucide-react';
import { io } from 'socket.io-client';
import { apiService } from '../../services/api.js';
import IssueCertificateModal from './IssueCertificateModal'; // Ensure this component is imported properly

export default function CourseWorkshopDesk({ selectedCourseId, coursesList, triggerRefresh, routeToStudentAttendanceDesk }) {
  const [allocatedStudents, setAllocatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purgingId, setPurgingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [modalContext, setModalContext] = useState(null); // ✅ Tracks active credentials modal target student

  // 🎥 LIVE CLASSES HUB STATES
  const [liveTopic, setLiveTopic] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [liveTime, setLiveTime] = useState('');
  const [activeLiveClass, setActiveLiveClass] = useState(null);
  const [isLiveSubmitting, setIsLiveSubmitting] = useState(false);

  // 💬 LIVE CHAT STATES
  const [adminMessage, setAdminMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatAllowed, setIsChatAllowed] = useState(true);
  
  const socketRef = useRef(null);
  const adminChatEndRef = useRef(null);
  
  // Pagination Matrix Bounds
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const url = "http://localhost:3000"; // ✅ Backend server base URL
  const activeCourse = coursesList.find(c => c._id === selectedCourseId);

  const triggerToast = (msg, isError = false) => {
    setToastMessage({ text: msg, error: isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (!selectedCourseId) return;

    // ✅ Socket connection setup targeted directly at Port 3000 backend proxy layer
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
        
        // 1. Fetch Students
        const res = await fetch(`${url}/api/auth/admin/courses/${selectedCourseId}/students`, {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setAllocatedStudents(data.data || []);

        // 2. Fetch Chat History (Synced with active database chat records)
        const historyData = await apiService.chathistory(selectedCourseId);
        if (historyData && historyData.success) {
          setChatMessages(historyData.history || historyData.data || []);
          if (historyData.isChatEnabled !== undefined) setIsChatAllowed(historyData.isChatEnabled);
        }

        // 3. Join Socket Classroom Room
        socketRef.current.emit("join_classroom", { courseId: selectedCourseId, user: "Instructor Overlord" });
        if (activeCourse?.liveClass) setActiveLiveClass(activeCourse.liveClass);

      } catch (err) {
        console.error("Data pipeline load crash:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseRosterAndChat();

    // Listen to real-time communication messages stream
    socketRef.current.on("receive_message", (newMessage) => {
      setChatMessages((prev) => [...prev, newMessage]);
    });

    socketRef.current.on("chat_status_updated", (data) => {
      setIsChatAllowed(data.isChatEnabled);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message");
        socketRef.current.off("chat_status_updated");
        socketRef.current.disconnect();
      }
    };
  }, [selectedCourseId, triggerRefresh, activeCourse]);

  useEffect(() => {
    adminChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ✅ ADMIN MESSAGING STATEMENT BROADCAST TRIGGER
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

  // ✅ CHAT CHANNEL LOCK/UNLOCK TOGGLE METHOD
  const handleToggleChatStatus = async () => {
    try {
      const nextChatState = !isChatAllowed;
      const token = localStorage.getItem("token");
      
      await fetch(`${url}/api/auth/admin/courses/${selectedCourseId}/toggle-chat`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ isChatEnabled: nextChatState })
      });
      
      setIsChatAllowed(nextChatState);
      // Inform all users inside the classroom via active connection channels
      socketRef.current.emit("toggle_chat_status", { courseId: selectedCourseId, isChatEnabled: nextChatState });
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
      setActiveLiveClass({ topic: liveTopic, link: liveLink, scheduledAt: liveTime });
      setLiveTopic(''); setLiveLink(''); setLiveTime('');
      triggerToast("Live class transmission tunnel verified and posted!");
    } catch (err) {
      setActiveLiveClass({ topic: liveTopic, link: liveLink, scheduledAt: liveTime });
    } finally {
      setIsLiveSubmitting(false);
    }
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
    <div className="space-y-6 animate-in fade-in duration-200 text-zinc-900 dark:text-zinc-100">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl text-xs font-bold ${toastMessage.error ? 'bg-rose-950 border-rose-800 text-rose-300' : 'bg-zinc-900 border-zinc-800 text-zinc-200'}`}>
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/40 pb-5">
        <div>
          <h3 className="text-xs font-mono font-black text-zinc-800 dark:text-white uppercase tracking-wider">WORKSPACE_CONSOLE // {activeCourse?.courseName}</h3>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          {/* SEARCH FIELD BAR */}
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
          <button onClick={handleToggleChatStatus} className="flex items-center justify-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0">
            <EyeOff className="w-3.5 h-3.5" /> {isChatAllowed ? "Lock Live Chat" : "Unlock Live Chat"}
          </button>
        </div>
      </div>

      {/* RESPONSIVE LAYOUT ENGINE GRID PLATFORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stream Link Post Box */}
        <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-4 shadow-sm">
          <h4 className="text-xs font-black text-zinc-900 dark:text-white tracking-tight"><Video className="w-3.5 h-3.5 text-amber-500 inline mr-1" /> INITIATE LIVE TUNNEL</h4>
          <form onSubmit={handlePostLiveClass} className="space-y-3 text-[11px]">
            <input type="text" placeholder="Session Topic Title" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg text-zinc-800 dark:text-zinc-200 outline-none" value={liveTopic} onChange={(e) => setLiveTopic(e.target.value)} />
            <input type="url" placeholder="Stream Target URL" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg text-zinc-800 dark:text-zinc-200 outline-none" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
            <input type="datetime-local" className="w-full bg-zinc-50 dark:bg-[#050507] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg text-zinc-800 dark:text-zinc-200 outline-none" value={liveTime} onChange={(e) => setLiveTime(e.target.value)} />
            <button type="submit" className="w-full bg-amber-500 text-black font-black py-2 rounded-lg text-[10px] uppercase cursor-pointer" disabled={isLiveSubmitting}>{isLiveSubmitting ? "TRANSMITTING..." : "Transmit Stream Data"}</button>
          </form>
        </div>

        {/* 💬 LIVE ADMIN CHAT FEED MONITOR */}
        <div className="lg:col-span-2 bg-[#09090b] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col justify-between h-[320px]">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase text-zinc-500 block">LIVE_CHAT_STREAM_BUFFER</span>
            <h4 className="text-xs font-black text-white mt-0.5 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-blue-500" /> CLASSROOM FEED MONITOR</h4>
          </div>

          <div className="my-3 flex-grow overflow-y-auto pr-1 space-y-2 custom-scrollbar text-[11px]">
            {chatMessages.length === 0 ? (
              <div className="text-center text-zinc-600 py-12 uppercase">[Buffer clean // Awaiting incoming statements]</div>
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
            <input type="text" value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} placeholder="Type instructor statement to broadcast..." className="flex-grow px-3 py-2 text-xs bg-[#050507] border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition shrink-0 cursor-pointer"><Send className="w-3.5 h-3.5" /></button>
          </form>
        </div>

      </div>

      {/* ROSTER MANAGEMENT */}
      <div className="space-y-3">
        <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200 dark:border-zinc-800/20 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse text-xs min-w-[650px]">
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
                    <td className="p-4 font-mono text-blue-600 dark:text-blue-400">{student.universityRoll || student._id?.substring(0,8).toUpperCase()}</td>
                    <td className="p-4 font-black text-zinc-900 dark:text-white">{student.fullName}</td>
                    <td className="p-4 text-zinc-400">{student.department || "Computer Science Engineering"}</td>
                    <td className="p-4 flex items-center justify-end gap-2 shrink-0">
                      
                      {/* ✅ INJECTED TRIGGER 1: View Attendance Audit Desk button */}
                      <button 
                        onClick={() => routeToStudentAttendanceDesk(student._id, selectedCourseId)}
                        className="px-2.5 py-1 bg-zinc-900 hover:bg-blue-600 text-white dark:bg-zinc-800 dark:hover:bg-blue-600 border border-transparent rounded text-[10px] font-mono uppercase tracking-wide cursor-pointer flex items-center gap-1 transition"
                      >
                        <Eye className="w-3 h-3" /> Audit Desk
                      </button>

                      {/* 🎯 INJECTED TRIGGER 2: Issue Credentials Modal toggle link */}
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

        {/* PAGINATION TOOL BAR MATRIX */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 text-[11px] pt-1">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 cursor-pointer text-zinc-500"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-zinc-400">Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 cursor-pointer text-zinc-500"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ✅ DYNAMIC CERTIFICATES DOCUMENT CORRIDOR POPUP MODAL HOOK */}
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