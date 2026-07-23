import React, { useState } from 'react';
import { apiService } from '../../../services/api';
import { Award, Download, ShieldCheck, Lock, Loader2, FileText } from 'lucide-react';

export default function Certificates({ user }) {
  const [downloadingType, setDownloadingType] = useState(null); // Tracks 'certificate' or 'offerLetter'

  // Validation gates alignment matching backend roles
  const isApprovedByAdmin = user?.isCertificateApproved === true || user?.registrationStatus === 'Approved';

  const handleDownloadSequence = async (docType) => {
    if (!isApprovedByAdmin) return;
    const targetUserId = user?.id || user?._id;
    if (!targetUserId) return;

    try {
      setDownloadingType(docType);
      
      // Fetch response containing raw url from our updated backend
      const data = await apiService.downloadCertificate(targetUserId, docType);

      if (!data.success) {
        throw new Error(data.message || "Document asset package missing.");
      }

      // Opens the secure URL directly in a new browser tab instantly!
      window.open(data.url, '_blank', 'noopener,noreferrer');

    } catch (error) {
      console.error("Redirection failure block:", error);
      alert("❌ Document asset link is restricted or expired. Please contact administration.");
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 h-[calc(100vh-4rem)] md:h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar text-zinc-900 dark:text-[#f4f4f5] box-border">
      
      {/* Module Title Header Block */}
      <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/80 p-4 sm:p-5 rounded-xl shadow-sm">
        <h4 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 text-zinc-800 dark:text-white">
          <Award className="w-5 h-5 text-[#0066ff]" /> Earned Credentials Vault
        </h4>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">Review, verify, and secure your certified program credentials.</p>
      </div>

      {/* STACKED CONTAINER FRAMEWORK */}
      <div className="space-y-4 sm:space-y-6">

        {/* 🥇 BLOCK 1: MASTER GRADUATION CERTIFICATE */}
        {isApprovedByAdmin ? (
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-[#0d0d11] dark:to-[#09090b] rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-xl relative overflow-hidden animate-in fade-in duration-200 w-full box-border">
            <div className="absolute top-0 right-0 -z-10 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-10 pointer-events-none" />
            
            <div className="flex items-start gap-3 sm:gap-4 relative z-10 w-full md:w-auto">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white/10 dark:bg-zinc-800/40 flex items-center justify-center border border-white/10 dark:border-zinc-700/50 shrink-0 text-amber-400 shadow-inner">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="text-sm sm:text-base font-black tracking-tight text-white truncate">Official Course Graduation Certification</h4>
                <p className="text-zinc-400 text-[10px] sm:text-[11px] font-mono break-all">Verified ID: CRT-CE-2026-{(user?.id || user?._id || "99120").slice(-6).toUpperCase()}</p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-wide">
                    <ShieldCheck className="w-3 h-3" /> Blockchain Authenticated
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleDownloadSequence('certificate')}
              disabled={downloadingType !== null}
              className="w-full md:w-auto bg-[#0066ff] hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 mt-2 md:mt-0"
            >
              {downloadingType === 'certificate' ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Downloading...</>
              ) : (
                <><Download className="w-4 h-4" /> Download Certificate</>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0c0c0e] border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-3 shadow-sm animate-in fade-in duration-200 w-full box-border">
            <Lock className="w-4 h-4 text-zinc-400" />
            <h5 className="font-black text-zinc-800 dark:text-white text-xs sm:text-sm uppercase font-mono tracking-tight">Graduation Diploma Locked</h5>
            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 px-3 py-1 rounded-lg uppercase tracking-wider">⏳ Status: Awaiting Admin Approval</div>
          </div>
        )}

        {/* 🥈 BLOCK 2: INTERNSHIP OFFER LETTER */}
        {isApprovedByAdmin ? (
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-sm relative overflow-hidden transition-colors w-full box-border">
            <div className="flex items-start gap-3 sm:gap-4 w-full md:w-auto">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 text-blue-500 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="text-sm sm:text-base font-black tracking-tight text-zinc-800 dark:text-white truncate">Official Industrial Deployment Offer Letter</h4>
                <p className="text-zinc-400 dark:text-zinc-500 text-[10px] sm:text-[11px] font-mono break-all">Reference Code: OFL-CE-2026-{(user?.id || user?._id || "99120").slice(-4).toUpperCase()}</p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md uppercase tracking-wide">
                    Verified Influx Node
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleDownloadSequence('offerLetter')}
              disabled={downloadingType !== null}
              className="w-full md:w-auto bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-mono font-black py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 transition border border-transparent dark:border-zinc-700 mt-2 md:mt-0"
            >
              {downloadingType === 'offerLetter' ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Extracting...</>
              ) : (
                <><Download className="w-3.5 h-3.5" /> Download Offer Letter</>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0c0c0e] border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-3 shadow-sm animate-in fade-in duration-200 w-full box-border">
            <Lock className="w-4 h-4 text-zinc-400" />
            <h5 className="font-black text-zinc-800 dark:text-white text-xs sm:text-sm uppercase font-mono tracking-tight">Offer Letter Gate Active</h5>
            <div className="text-[10px] font-bold text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-3 py-1 rounded-lg uppercase tracking-wider">🔒 Registry Locked</div>
          </div>
        )}

      </div>
    </div>
  );
}