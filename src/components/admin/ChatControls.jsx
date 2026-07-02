import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageSquare, ToggleRight, ToggleLeft, Trash2, Loader2, Radio, Megaphone, Send } from 'lucide-react';
import { apiService } from '../../services/api';

export default function ChatControls({ refreshTrigger, triggerRefresh }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // Announcement targeting local triggers
  const [activeNoticeCourse, setActiveNoticeCourse] = useState(null);
  const [noticeText, setNoticeText] = useState("");
  const [sendingNotice, setSendingNotice] = useState(false);

  const socketRef = useRef(null);
  // const url = 'http://localhost:3000';

  useEffect(() => {
    // ✅ FIXED: Relative proxy integration with websocket transport rules
    socketRef.current = io("/", {
      transports: ["polling", "websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    const loadCourses = async () => {
      try {
        setLoading(true);
        const list = await apiService.getPrograms();
        setCourses(list || []);
      } catch (err) {
        console.error("Failed to load admin course matrix:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [refreshTrigger]);

  const toggleChat = async (courseId, currentState) => {
    try {
      setActionId(courseId);
      const token = localStorage.getItem("token");
      const targetState = !currentState;
      const data = await apiService.toggleChat(courseId, targetState);
      // const res = await fetch(`${url}/api/auth/admin/toggle-chat/${courseId}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      //   body: JSON.stringify({ isChatEnabled: targetState })
      // });
      // const data = await res.json();
      if (data.success) {
        socketRef.current.emit("admin_toggle_chat", { courseId, isChatEnabled: targetState });
        triggerRefresh();
      }
    } catch (err) {
      console.error("Chat toggle mutation error:", err);
    } finally {
      setActionId(null);
    }
  };

  // 🚀 CORE DISPATCH ENGINE: SEND NOTIFICATION TO PARTICULER COURSE
  const handleSendCourseNotification = async (courseId) => {
    if (!noticeText.trim()) return;
    try {
      setSendingNotice(true);
      const token = localStorage.getItem("token");
      
      // 1. HTTP Request: Permanently write to MongoDB Cluster
      const data = await apiService.sendCourseNotification(courseId, noticeText);
      // const res = await fetch(`${url}/api/auth/admin/send-announcement`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      //   body: JSON.stringify({
      //     courseId,
      //     title: `Broadcast Alert: Node Update`,
      //     body: noticeText
      //   })
      // });
      // const data = await res.json();
      
      if (data.success) {
        // 2. ✅ FIXED REAL-TIME INTERACTION PIPE: 
        // This emits a structured socket event so both LiveChat AND Announcements Tab sync instantly!
        socketRef.current.emit("send_message", {
          courseId,
          user: "SYSTEM NOTICE MONITOR",
          text: `🚨 CRITICAL ANNOUNCEMENT: ${noticeText}`,
          isInstructor: true
        });

        alert("🎉 Notification successfully pushed to target course partition!");
        setNoticeText("");
        setActiveNoticeCourse(null);
        if (triggerRefresh) triggerRefresh();
      }
    } catch (error) {
      console.error(error);
      alert("Failed pushing layout notice payload");
    } finally {
      setSendingNotice(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-bold">
        <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {courses.map((course) => {
        const isChatOpen = course.isChatEnabled !== false;
        const isNoticeFormOpen = activeNoticeCourse === course._id;

        return (
          <div key={course._id} className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-5 shadow-xl backdrop-blur-md space-y-4">

            {/* Top Identity Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-grow">
                <h5 className="font-black text-white text-sm sm:text-base truncate">{course.courseName}</h5>
                <p className="text-[11px] text-slate-400 font-medium truncate max-w-xl">{course.description || "Active Node Track."}</p>
              </div>

              {/* Action Buttons Matrix */}
              <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end border-t border-slate-700/30 sm:border-none pt-2 sm:pt-0">
                
                {/* Particular Announcement Open Toggle Hotkey */}
                <button
                  onClick={() => setActiveNoticeCourse(isNoticeFormOpen ? null : course._id)}
                  className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 p-2 rounded-xl transition text-xs flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <Megaphone className="w-3.5 h-3.5" /> Direct Alert
                </button>

                <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${isChatOpen ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                  <Radio className="w-3 h-3" /> {isChatOpen ? "Live Chat" : "Suspended"}
                </span>

                <button 
                  onClick={() => toggleChat(course._id, isChatOpen)} 
                  className="focus:outline-none" 
                  disabled={actionId === course._id}
                >
                  {isChatOpen ? <ToggleRight className="w-9 h-9 text-blue-500 cursor-pointer" /> : <ToggleLeft className="w-9 h-9 text-slate-600 cursor-pointer" />}
                </button>
              </div>
            </div>

            {/* DYNAMIC NESTED FORM INJECTION BLOCK FOR PERSONAL COURSE ALERT */}
            {isNoticeFormOpen && (
              <div className="bg-slate-900/60 border border-slate-700/40 p-4 rounded-2xl flex gap-2 animate-in slide-in-from-top-2 duration-150">
                <input
                  type="text"
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  placeholder={`Send particular alert notification to ${course.courseName} students pipeline...`}
                  className="flex-grow bg-slate-950 px-3 py-2 border border-slate-700 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-white font-medium placeholder-slate-600"
                />
                <button
                  disabled={sendingNotice}
                  onClick={() => handleSendCourseNotification(course._id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl transition flex items-center justify-center disabled:opacity-40 cursor-pointer shrink-0"
                >
                  {sendingNotice ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}