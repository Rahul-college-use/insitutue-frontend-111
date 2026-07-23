import React, { useState, useEffect, useRef } from 'react';
import { Video, MessageSquare, Users, Info, Send, Hand, HelpCircle, FileText, Loader, Monitor, ExternalLink, Clock, AlertCircle, Lock } from 'lucide-react';
import { io } from 'socket.io-client';
import { apiService } from '../../../../services/api.js';

export default function LiveClasses({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatAllowed, setIsChatAllowed] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // 1. Core user variables initialization
const rawEnrolled = user?.enrolledCourses;

// Force it into an array format regardless of how the backend sent it
const enrolledArray = Array.isArray(rawEnrolled) 
  ? rawEnrolled 
  : (rawEnrolled ? [rawEnrolled] : []);

// Safely extract active course
const activeCourse = enrolledArray.length > 0 
  ? enrolledArray[0] 
  : (user?.enrolledCourse || null);

// Use the real object database ID if it exists, otherwise fall back safely
const targetCourseId = activeCourse?._id || "general-class-room";
const activeStudentName = user?.fullName || "Student Node";

// console.log("enrolledArray:", enrolledArray, "array length:", enrolledArray.length, "activeCourse:", activeCourse, "targetCourseId:", targetCourseId);
 // 2. Data extraction order (Pehle liveClassData ko check karein, uske baad link ko)
  const liveClassData = activeCourse?.liveClass || null;
  const rawStreamLink = liveClassData?.link || activeCourse?.streamLink || '';
  const liveTopicTitle = liveClassData?.topic || activeCourse?.liveTopic || "Not Live Institutional Interaction Session";
  const scheduledTime = liveClassData?.scheduledAt ? new Date(liveClassData.scheduledAt).toLocaleString('en-IN') : null;

  const isLinkLoaded = !!rawStreamLink;
  const isChatCurrentlyAllowed = isChatAllowed && isLinkLoaded;

  const url = "http://localhost:3000";
  // const url = "https://internshipplace-bend.vercel.app";

  // 3. Helper Functions
  const getStreamEngineType = (linkUrl) => {
    if (!linkUrl) return 'obs';
    if (linkUrl.includes('youtube.com') || linkUrl.includes('youtu.be')) return 'youtube';
    if (linkUrl.includes('zoom.us')) return 'zoom';
    return 'obs';
  };

  const streamEngineType = getStreamEngineType(rawStreamLink);

  const extractYoutubeId = (linkUrl) => {
    if (!linkUrl) return '';
    const cleanUrl = linkUrl.trim();
    if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('.')) return cleanUrl;
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/|live\/)|(?:(?:watch|\?v(?:i)?=|\&v(?:i)?=)))([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    return (match && match[1].length === 11) ? match[1] : cleanUrl;
  };

  // 4. Live Source Payload (Kyuki ab database me full URL save ho rha hai, toh id nikalne ke liye)
  const liveSourcePayload = streamEngineType === 'youtube' ? extractYoutubeId(rawStreamLink) : rawStreamLink;

  // 5. Debugging Logger
  

  // 6. Socket pipelines and API sync
  useEffect(() => {
    setIframeError(false);

    socketRef.current = io(url, {
      transports: ['websocket'],
      upgrade: false,
      forceNew: true,
      autoConnect: true
    });

    const syncClassroomPipelines = async () => {
      if (!targetCourseId) return;
      try {
        setLoading(true);
        const historyData = await apiService.chathistory(targetCourseId);
        if (historyData && historyData.success) {
          // Agar class active nahi hai ya link nahi hai, toh purani chat load nahi hogi
          if (isLinkLoaded) {
            setChatMessages(historyData.history || historyData.data || []);
          } else {
            setChatMessages([]);
          }
          
          if (historyData.isChatEnabled !== undefined) {
            setIsChatAllowed(historyData.isChatEnabled);
          }
        }
        socketRef.current.emit("join_classroom", { courseId: targetCourseId, user: activeStudentName });
      } catch (error) {
        console.error("Chat sync exception:", error);
      } finally {
        setLoading(false);
      }
    };

    syncClassroomPipelines();

    socketRef.current.on("receive_message", (newMessage) => {
      setChatMessages((prev) => [...prev, newMessage]);
    });

    socketRef.current.on("chat_status_updated", (data) => {
      setIsChatAllowed(data.isChatEnabled);
    });

    socketRef.current.on("toggle_chat_status", (data) => {
      setIsChatAllowed(data.isChatEnabled);
    });

    // 🔥 Real-time Clear Chat Socket Listener (Jab instructor end karega tab instant UI se wipe hoga)
    socketRef.current.on("clear_chat_ui", () => {
      setChatMessages([]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message");
        socketRef.current.off("chat_status_updated");
        socketRef.current.off("toggle_chat_status");
        socketRef.current.off("clear_chat_ui");
        socketRef.current.disconnect();
      }
    };
  }, [targetCourseId, activeStudentName, rawStreamLink, isLinkLoaded]);

  // Smooth scroll to chat end
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeSubTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !isChatCurrentlyAllowed) return;

    const chatPayload = {
      courseId: targetCourseId,
      user: activeStudentName,
      text: message,
      isInstructor: false,
      createdAt: new Date().toISOString()
    };

    socketRef.current.emit("send_message", chatPayload);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader className="w-6 h-6 text-[#0066ff] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 grid grid-cols-1 lg:grid-cols-3 gap-4 h-full lg:h-[calc(100vh-6rem)] overflow-y-auto lg:overflow-hidden">

      {/* LEFT COLUMN: Player Gateways */}
      <div className="lg:col-span-2 flex flex-col gap-3 h-auto lg:h-full lg:overflow-y-auto pr-0 lg:pr-1 custom-scrollbar">

        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider animate-pulse inline-block">● LIVE STREAM PLATFORM</span>
              {scheduledTime && <span className="text-zinc-500 font-mono text-[10px] flex items-center gap-1"><Clock className="w-3 h-3" /> {scheduledTime}</span>}
            </div>
            <h4 className="text-base font-black text-slate-900 mt-1">{activeCourse?.courseName || "General Broadcast Room"}</h4>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Topic: {liveTopicTitle}</p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded border border-zinc-200 h-fit w-fit uppercase">{activeCourse?.code || "LIVE"}</span>
        </div>

        <div className="bg-slate-950 aspect-video w-full rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-900 shadow-md">
          {streamEngineType === 'youtube' && liveSourcePayload ? (
            !iframeError ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full border-none rounded-2xl"
                src={`https://www.youtube.com/embed/${liveSourcePayload}?autoplay=1&mute=1&modestbranding=1&rel=0`}
                title="Live Stream Canvas"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={() => setIframeError(true)}
              />
            ) : (
              <div className="text-center p-4 space-y-3 z-10">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
                <p className="text-xs sm:text-sm font-black text-white">Stream Pipeline Blocked By Host</p>
                <a href={`https://www.youtube.com/watch?v=${liveSourcePayload}`} target="_blank" rel="noopener noreferrer" className="inline-flex bg-amber-500 text-black text-[11px] font-black px-4 py-2 rounded-xl">Launch Externally</a>
              </div>
            )
          ) : streamEngineType === 'zoom' && liveSourcePayload ? (
            <div className="text-center p-4 space-y-3 z-10">
              <Monitor className="w-10 h-10 text-blue-500 mx-auto animate-bounce" />
              <p className="text-xs sm:text-sm font-black text-white">Zoom Cloud Room Ready</p>
              <a href={liveSourcePayload} target="_blank" rel="noopener noreferrer" className="inline-flex bg-blue-600 text-white text-[11px] font-black px-4 py-2 rounded-xl">Launch Live Zoom Workspace</a>
            </div>
          ) : (
            <div className="text-center text-slate-400 p-4 space-y-2 z-10">
              <Video className="w-8 h-8 text-[#0066ff] mx-auto animate-pulse" />
              <p className="text-xs sm:text-sm font-bold text-white">Waiting for Live Stream Connection...</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-slate-200 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><Hand className="w-3.5 h-3.5 text-amber-500" /> Raise Hand</button>
          <button className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-slate-200 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><HelpCircle className="w-3.5 h-3.5 text-[#0066ff]" /> Ask Question</button>
          <button className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-slate-200 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><FileText className="w-3.5 h-3.5 text-emerald-500" /> Notes</button>
          <button className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-slate-200 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><Users className="w-3.5 h-3.5 text-purple-500" /> Voice Req</button>
        </div>
      </div>

      {/* RIGHT COLUMN: Renders Chat Live Stream */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[400px] lg:h-full overflow-hidden min-w-0">
        <div className="flex border-b border-slate-100 p-2 gap-1 shrink-0 bg-slate-50/50">
          <button onClick={() => setActiveSubTab('chat')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${activeSubTab === 'chat' ? 'bg-white text-[#0066ff] shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`}><MessageSquare className="w-3.5 h-3.5" /> Live Chat</button>
          <button onClick={() => setActiveSubTab('info')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${activeSubTab === 'info' ? 'bg-white text-[#0066ff] shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`}><Info className="w-3.5 h-3.5" /> Details</button>
        </div>

        <div className="flex-grow flex flex-col overflow-hidden relative min-h-0">
          {activeSubTab === 'chat' && (
            <div className="flex flex-col h-full justify-between p-3 sm:p-4 overflow-hidden">
              <div className="space-y-3 overflow-y-auto pr-1 flex-grow mb-2 custom-scrollbar">
                {/* 🔥 Layer Validation: Agar link load nahi hai toh UI par messages empty dikhenge */}
                {isLinkLoaded && chatMessages.length > 0 ? (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border text-xs ${msg.isInstructor ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50/70 border-slate-100'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-black ${msg.isInstructor ? 'text-[#0066ff]' : 'text-slate-800'}`}>{msg.user} {msg.isInstructor && '• [Instructor]'}</span>
                        <span className="text-[9px] text-slate-400 font-bold">{new Date(msg.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-600 font-semibold">{msg.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 gap-2">
                    <Lock className="w-8 h-8 text-slate-300" />
                    <p className="text-xs font-bold">Class is not active. Chat is cleared.</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-100 bg-white shrink-0">
                <div className="relative flex-grow flex items-center">
                  <input
                    type="text"
                    value={message}
                    disabled={!isChatCurrentlyAllowed}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      !isLinkLoaded
                        ? "🔒 Waiting for live stream link..."
                        : isChatAllowed
                          ? "Send live statement..."
                          : "🔒 Chat locked by Instructor."
                    }
                    className="w-full pl-3 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-700 disabled:opacity-70 disabled:bg-slate-100"
                  />
                  {!isChatCurrentlyAllowed && (
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3" />
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!isChatCurrentlyAllowed}
                  className="bg-[#0066ff] hover:bg-blue-700 text-white p-2.5 rounded-xl transition shrink-0 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
          {activeSubTab === 'info' && (
            <div className="space-y-4 p-4 text-slate-600 font-medium text-xs">
              <p className="text-slate-900 font-bold bg-slate-50 p-2 rounded-xl border">Broadcast Node: <span className="text-blue-600 uppercase font-black">{streamEngineType} Engine</span></p>
              <p className="text-slate-900 font-bold bg-slate-50 p-2 rounded-xl border">Topic: <span className="text-blue-600 font-black">{liveTopicTitle}</span></p>
              {scheduledTime && (
                <p className="text-slate-900 font-bold bg-slate-50 p-2 rounded-xl border">Scheduled Time: <span className="text-blue-600 font-black">{scheduledTime}</span></p>
              )}
              <p className="text-slate-900 font-bold bg-slate-50 p-2 rounded-xl border">Course Code: <span className="text-blue-600 font-black">{activeCourse?.code || "LIVE"}</span></p>
              <p className="text-slate-900 font-bold bg-slate-50 p-2 rounded-xl border">Instructor: <span className="text-blue-600 font-black">{activeCourse?.instructor || "Institutional Node"}</span></p>
              <p className="text-slate-900 font-bold bg-slate-50 p-2 rounded-xl border">Chat Status: <span className={`font-black ${isChatAllowed ? 'text-green-600' : 'text-red-600'}`}>{isChatAllowed ? 'Enabled' : 'Locked by Instructor'}</span></p>
              <p className="text-slate-900 font-bold bg-slate-50 p-2 rounded-xl border">Description: <span className="text-blue-600 font-black">{activeCourse?.description || "No description available"}</span></p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}