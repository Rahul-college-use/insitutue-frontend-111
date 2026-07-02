import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Loader2, Calendar, FileCheck, Layers, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { apiService } from '../../services/api';

export default function CourseAdd({ setActiveSubView, triggerRefresh }) {
  const [form, setForm] = useState({
    courseName: '', 
    description: '', 
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871',
    courseStartDate: '', 
    courseEndDate: '', 
    cert: 'AICTE Compliant', 
    meta: 'B.Tech / Diploma'
  });
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // ✅ EXACT WORKING URL CONTEXT NODE
  // const url = "http://localhost:3000";

  const triggerToast = (msg, isError = false) => {
    setToastMessage({ text: msg, error: isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // const token = localStorage.getItem("token");
      const data = await apiService.addCourse(form);
      // const res = await fetch(`${url}/api/auth/coursesAdd`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      //   body: JSON.stringify(form)
      // });
      // const data = await res.json();
      
      if (data.success) {
        triggerToast("🎉 New Training Track Injected Successfully!");
        triggerRefresh();
        
        // Short timeout allows the admin to read the toast before redirect routing happens
        setTimeout(() => {
          setActiveSubView('registrations'); 
        }, 1200);
      } else {
        triggerToast(data.message || "Pipeline rejection error.", true);
      }
    } catch (err) {
      triggerToast(`Pipeline Error: ${err.message}`, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-xl mx-auto bg-[#09090b]/40 border border-zinc-800/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative"
    >
      {/* 🔔 PREMIUM TOAST NOTIFICATION HUD */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md ${
              toastMessage.error 
                ? 'bg-rose-950/80 border-rose-800 text-rose-300' 
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-200'
            }`}
          >
            {toastMessage.error ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Module Title Section */}
      <div className="flex items-center gap-2.5 border-b border-zinc-800/60 pb-4 mb-5">
        <PlusCircle className="w-4 h-4 text-zinc-400" />
        <h4 className="font-mono font-black text-white text-xs uppercase tracking-widest">PUBLISH // TRAINING_TRACK</h4>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm font-semibold text-zinc-300">
        
        {/* Input 1: Course Title */}
        <div className="space-y-1.5">
          <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Official Course Name *</label>
          <input 
            required 
            type="text" 
            value={form.courseName} 
            onChange={(e) => setForm({...form, courseName: e.target.value})} 
            placeholder="e.g., Full-Stack Web Architecture & Cloud Operations" 
            className="w-full px-3.5 py-2.5 bg-[#050507] border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-600 text-white font-medium placeholder-zinc-700 transition-colors duration-150" 
          />
        </div>

        {/* Input 2: Syllabus Description */}
        <div className="space-y-1.5">
          <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Program Syllabus Description *</label>
          <textarea 
            required 
            rows={4} 
            value={form.description} 
            onChange={(e) => setForm({...form, description: e.target.value})} 
            placeholder="Outline training roadmap specifications, structural design blueprints, and production scope components clearly..." 
            className="w-full px-3.5 py-2.5 bg-[#050507] border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-600 text-white font-medium placeholder-zinc-700 transition-colors duration-150 resize-none leading-relaxed text-xs" 
          />
        </div>

        {/* Dual Input Grid: Dates Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-zinc-600" /> Batch Kickoff *
            </label>
            <input 
              required 
              type="date" 
              value={form.courseStartDate} 
              onChange={(e) => setForm({...form, courseStartDate: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#050507] border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-600 text-white font-medium transition-colors duration-150 [color-scheme:dark]" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-zinc-600" /> Termination Date *
            </label>
            <input 
              required 
              type="date" 
              value={form.courseEndDate} 
              onChange={(e) => setForm({...form, courseEndDate: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#050507] border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-600 text-white font-medium transition-colors duration-150 [color-scheme:dark]" 
            />
          </div>
        </div>

        {/* Dual Input Grid: Extra Meta/Compliance Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <FileCheck className="w-3 h-3 text-zinc-600" /> Compliance Label
            </label>
            <input 
              type="text" 
              value={form.cert} 
              onChange={(e) => setForm({...form, cert: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#050507] border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-600 text-white font-medium transition-colors duration-150" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-zinc-600" /> Categorization Vector
            </label>
            <input 
              type="text" 
              value={form.meta} 
              onChange={(e) => setForm({...form, meta: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#050507] border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-600 text-white font-medium transition-colors duration-150" 
            />
          </div>
        </div>

        {/* Submit Operations Button with Ripple Animation */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={submitting} 
          className="w-full bg-zinc-100 hover:bg-white text-black font-black disabled:opacity-40 py-3 rounded-xl transition duration-150 text-xs uppercase tracking-widest font-mono mt-4 shadow-xl flex items-center justify-center gap-1.5 cursor-pointer select-none"
        >
          {submitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> INJECTING_SPEC_NODE...
            </>
          ) : (
            "Inject Program Node"
          )}
        </motion.button>

      </form>
    </motion.div>
  );
}