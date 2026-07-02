import React, { useState, useEffect, useRef } from 'react';
import { Video, MessageSquare, Users, Info, Send, Hand, HelpCircle, FileText, Loader, Monitor, ExternalLink, Clock, AlertCircle } from 'lucide-react';
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

  const enrolledArray = user?.enrolledCourses || [];
  const activeCourse = enrolledArray.length > 0 ? enrolledArray[0] : (user?.enrolledCourse || null);
  const targetCourseId = activeCourse?._id || "general-class-room";
  const activeStudentName = user?.fullName || "Student Node";

  const liveClassData = activeCourse?.liveClass || null;
  const rawStreamLink = liveClassData?.link || activeCourse?.streamLink || '';
  const liveTopicTitle = liveClassData?.topic || activeCourse?.liveTopic || "Live Institutional Interaction Session";
  const scheduledTime = liveClassData?.scheduledAt ? new Date(liveClassData.scheduledAt).toLocaleString('en-IN') : null;

  const url = "http://localhost:3000"; 

  
  const getStreamEngineType = (url) => {
    if (!url) return 'obs';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('zoom.us')) return 'zoom';
    return 'obs';
  };

  const streamEngineType = getStreamEngineType(rawStreamLink);

  const extractYoutubeId = (url) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('.')) return cleanUrl;
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/|live\/)|(?:(?:watch|\?v(?:i)?=|\&v(?:i)?=)))([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    return (match && match[1].length === 11) ? match[1] : cleanUrl;
  };

  const liveSourcePayload = streamEngineType === 'youtube' ? extractYoutubeId(rawStreamLink) : rawStreamLink;

  useEffect(() => {
    setIframeError(false);
    
    // ✅ FIX: सॉकेट क्लाइंट को सीधे बैकएंड पोर्ट 3000 से बांध दिया गया है ताकि 5173 पर 404 ड्रॉप न हो
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
          setChatMessages(historyData.history || historyData.data || []);
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

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message");
        socketRef.current.off("chat_status_updated");
        socketRef.current.disconnect();
      }
    };
  }, [targetCourseId, activeStudentName, rawStreamLink]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeSubTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !isChatAllowed) return;

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

  if (loading) return <div className="w-full h-64 flex items-center justify-center"><Loader className="w-6 h-6 text-[#0066ff] animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-2 grid grid-cols-1 lg:grid-cols-3 gap-4 h-full lg:h-[calc(100vh-7rem)] overflow-hidden">
      
      {/* LEFT COLUMN: Player Gateways */}
      <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto pr-1 h-full custom-scrollbar">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

        <div className="bg-slate-950 aspect-video rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-900 shadow-md">
          {streamEngineType === 'youtube' && liveSourcePayload ? (
            !iframeError ? (
              <iframe 
                className="w-full h-full border-none rounded-3xl"
                src={`https://www.youtube.com/embed/${liveSourcePayload}?autoplay=1&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`}
                title="Live Stream Canvas"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                onError={() => setIframeError(true)}
              />
            ) : (
              <div className="text-center p-6 space-y-4">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
                <p className="text-sm font-black text-white">Stream Pipeline Blocked By Host</p>
                <a href={`https://www.youtube.com/watch?v=${liveSourcePayload}`} target="_blank" rel="noopener noreferrer" className="inline-flex bg-amber-500 text-black text-xs font-black px-5 py-2.5 rounded-xl">Launch Externally</a>
              </div>
            )
          ) : streamEngineType === 'zoom' && liveSourcePayload ? (
            <div className="text-center p-6 space-y-4">
              <Monitor className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
              <p className="text-sm font-black text-white">Zoom Cloud Room Ready</p>
              <a href={liveSourcePayload} target="_blank" rel="noopener noreferrer" className="inline-flex bg-blue-600 text-white text-xs font-black px-5 py-2.5 rounded-xl">Launch Live Zoom Workspace</a>
            </div>
          ) : (
            <div className="text-center text-slate-400 p-4 space-y-2">
              <Video className="w-8 h-8 text-[#0066ff] mx-auto animate-pulse" />
              <p className="text-sm font-bold text-white">Digital Lecture Pipeline Active</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button className="flex items-center justify-center gap-1.5 p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><Hand className="w-3.5 h-3.5 text-amber-500" /> Raise Hand</button>
          <button className="flex items-center justify-center gap-1.5 p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><HelpCircle className="w-3.5 h-3.5 text-[#0066ff]" /> Ask Question</button>
          <button className="flex items-center justify-center gap-1.5 p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><FileText className="w-3.5 h-3.5 text-emerald-500" /> Notes</button>
          <button className="flex items-center justify-center gap-1.5 p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><Users className="w-3.5 h-3.5 text-purple-500" /> Voice Req</button>
        </div>
      </div>

      {/* RIGHT COLUMN: Renders Chat Live Stream */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[450px] lg:h-full overflow-hidden min-w-0">
        <div className="flex border-b border-slate-100 p-2 gap-1 shrink-0 bg-slate-50/50">
          <button onClick={() => setActiveSubTab('chat')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${activeSubTab === 'chat' ? 'bg-white text-[#0066ff] shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`}><MessageSquare className="w-3.5 h-3.5" /> Live Chat</button>
          <button onClick={() => setActiveSubTab('info')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${activeSubTab === 'info' ? 'bg-white text-[#0066ff] shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`}><Info className="w-3.5 h-3.5" /> Details</button>
        </div>

        <div className="flex-grow flex flex-col overflow-hidden relative min-h-0">
          {activeSubTab === 'chat' && (
            <div className="flex flex-col h-full justify-between p-4 overflow-hidden">
              <div className="space-y-3 overflow-y-auto pr-1 flex-grow mb-2 custom-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-2xl border text-xs ${msg.isInstructor ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50/70 border-slate-100'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-black ${msg.isInstructor ? 'text-[#0066ff]' : 'text-slate-800'}`}>{msg.user} {msg.isInstructor && '• [Instructor]'}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{new Date(msg.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-600 font-semibold">{msg.text}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-100 bg-white shrink-0">
                <input type="text" value={message} disabled={!isChatAllowed} onChange={(e) => setMessage(e.target.value)} placeholder={isChatAllowed ? `Send live statement...` : "🔒 Chat locked."} className="flex-grow px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-700" />
                <button type="submit" disabled={!isChatAllowed} className="bg-[#0066ff] hover:bg-blue-700 text-white p-2.5 rounded-xl transition shrink-0"><Send className="w-3.5 h-3.5" /></button>
              </form>
            </div>
          )}
          {activeSubTab === 'info' && (
            <div className="space-y-4 p-4 text-slate-600 font-medium text-xs">
              <p className="text-slate-900 font-bold bg-slate-50 p-2 rounded-xl border">Broadcast Node: <span className="text-blue-600 uppercase font-black">{streamEngineType} Engine</span></p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}