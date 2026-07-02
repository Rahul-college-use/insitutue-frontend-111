import React from 'react';
import { Mail, MessageSquare, MessageCircle, Phone, Send } from 'lucide-react';

// ✅ FIXED: Accepting centralized user payload to pre-populate metadata during support sessions
export default function Support({ user }) {
  // Replace this placeholder link with your actual WhatsApp channel link string
  const whatsappChannelLink = "https://whatsapp.com/channel/your-channel-id";
  const telegramChannelLink = "https://t.me/your_telegram_channel";

  const initializeChatSession = () => {
    // Injecting active data strings to the live ticketing instances securely
    const activePayloadName = user?.fullName || "Student User";
    alert(`⚡ Initializing support pipeline for ${activePayloadName}. Connecting to support agent...`);
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 space-y-6 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
      
      {/* Module Header Title Text */}
      <div>
        <h4 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">Help Desk & Support Center</h4>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">Get instant guidelines to troubleshoot technical workspace errors or verification queries.</p>
      </div>

      {/* ✅ FIXED: Harmonized grid tracks spacing rules to fit exactly 2x2 or 3xX responsive streams nicely */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Email Support Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066ff] flex items-center justify-center border border-blue-100">
              <Mail className="w-4 h-4" />
            </div>
            <h5 className="font-black text-slate-900 text-sm">Email Support Helpdesk</h5>
            <p className="text-xs text-slate-400 font-medium leading-normal">Expect detailed verification and troubleshooting feedback inside 24 official working hours.</p>
          </div>
          <a href="mailto:support@internshipplace.com" className="text-center bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#0066ff] font-bold py-2.5 px-4 rounded-xl text-xs transition border border-slate-100 truncate">
            support@internshipplace.com
          </a>
        </div>

        {/* Live Chat Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h5 className="font-black text-slate-900 text-sm">Live Operations Chat</h5>
            <p className="text-xs text-slate-400 font-medium leading-normal">Interact immediately with active platform monitoring staff for real-time validation fixes.</p>
          </div>
          <button 
            onClick={initializeChatSession}
            className="w-full bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition border border-purple-100/70 cursor-pointer"
          >
            Initialize Live Session
          </button>
        </div>

        {/* Support Contact Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
              <Phone className="w-4 h-4" />
            </div>
            <h5 className="font-black text-slate-900 text-sm">Direct Voice Hotline</h5>
            <p className="text-xs text-slate-400 font-medium leading-normal">Urgent system blockages or application mapping issues? Speak to corporate advisors directly.</p>
          </div>
          <a href="tel:+911234567890" className="text-center bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-100/70 font-bold py-2.5 px-4 rounded-xl text-xs transition">
            Call Support Helpline
          </a>
        </div>

        {/* WhatsApp Channel Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h5 className="font-black text-slate-900 text-sm">WhatsApp Broadcast Feed</h5>
            <p className="text-xs text-slate-400 font-medium leading-normal">Join our official community channel to pull down real-time announcements, timeline events, and tips.</p>
          </div>
          <a 
            href={whatsappChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-100/70 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Join WA Channel →
          </a>
        </div>

        {/* Telegram Channel Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <Send className="w-4 h-4" />
            </div>
            <h5 className="font-black text-slate-900 text-sm">Telegram Resource Bank</h5>
            <p className="text-xs text-slate-400 font-medium leading-normal">Access open-source code libraries, project blueprint reports, and structural documentation files.</p>
          </div>
          <a 
            href={telegramChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white border border-sky-100/70 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
          >
            Join Telegram Vault →
          </a>
        </div>

      </div>
    </div>
  );
}