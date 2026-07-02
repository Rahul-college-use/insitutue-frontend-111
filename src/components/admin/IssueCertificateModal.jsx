import React, { useState } from 'react';
import { X, Award, FileText, Link, Loader2, Send } from 'lucide-react';
import { apiService } from '../../services/api';

export default function IssueCertificateModal({ studentId, courseId, studentName, onClose, triggerRefresh }) {
  const [docType, setDocType] = useState('certificate'); // Default type selection
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl.trim()) {
      alert("Please provide a valid file asset URL.");
      return;
    }

    try {
      setLoading(true);
      
      // Backend core allocation route endpoint call
      const data = await apiService.issueCertificate({
        studentId,
        courseId,
        docType, // Passed down as 'offerLetter' or 'certificate' matching database updates
        fileUrl
      });
    //   const response = await fetch('http://localhost:3000/api/auth/admin/certificates/issue', {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${localStorage.getItem("token")}`
    //     },
    //     body: JSON.stringify({
    //       studentId,
    //       courseId,
    //       docType, // Passed down as 'offerLetter' or 'certificate' matching database updates
    //       fileUrl
    //     })
    //   });

    //   const data = await response.json();
      
      if (data.success) {
        alert(`🎉 Successfully issued credentials to ${studentName}!`);
        triggerRefresh();
        onClose();
      } else {
        alert(data.message || "Failed to allocate document registry.");
      }
    } catch (error) {
      console.error("Failed transmission loop:", error);
      alert("Network gateway registration drop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden text-zinc-900 dark:text-[#f4f4f5] font-sans animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Heading Block */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-[#09090b]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#0066ff]" />
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-800 dark:text-white">CREDENTIALS_DISPATCH_TUNNEL</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container Subsystem */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold">
          <div>
            <span className="text-[9px] font-mono font-black text-zinc-400 uppercase tracking-wider block mb-1">Target Candidate</span>
            <p className="text-sm font-black text-zinc-800 dark:text-white">{studentName}</p>
          </div>

          {/* Document Select Framework Options */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-black text-zinc-400 uppercase tracking-wider block">Select Document Type</label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDocType('offerLetter')}
                className={`py-2 px-3 border rounded-lg text-[11px] font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  docType === 'offerLetter' 
                    ? 'bg-blue-600 border-transparent text-white shadow-md' 
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Offer Letter
              </button>
              <button
                type="button"
                onClick={() => setDocType('certificate')}
                className={`py-2 px-3 border rounded-lg text-[11px] font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  docType === 'certificate' 
                    ? 'bg-blue-600 border-transparent text-white shadow-md' 
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Certificate
              </button>
            </div>
          </div>

          {/* Asset File Link Destination Target Input */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-black text-zinc-400 uppercase tracking-wider block">Document Asset File URL</label>
            <div className="relative mt-1">
              <Link className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="url" 
                placeholder="https://res.cloudinary.com/path-to-pdf.pdf"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-900 dark:text-white font-medium"
              />
            </div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal font-medium block mt-1">Provide public secure PDF link generated via Cloudinary cloud networks storage clusters.</span>
          </div>

          {/* Action Trigger Submit Control */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-blue-600 dark:bg-[#15151b] dark:hover:bg-blue-600 border border-transparent dark:border-zinc-800 text-white font-mono font-black py-2.5 rounded-lg tracking-wider text-[10px] uppercase transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Transmitting...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Broadcast Digital Document
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}