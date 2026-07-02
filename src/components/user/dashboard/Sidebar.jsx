import React from 'react';
import {
  LayoutDashboard, User, GraduationCap, Calendar, FileText,
  BookOpen,  FileCheck, Shield, Award, Users, Bell, Headphones, Radio, CirclePlay
} from 'lucide-react';
import { CircleHelp } from 'lucide-react';
export default function Sidebar({ activeTab, setActiveTab, isExpanded, setIsExpanded }) {
  // ✅ FIXED: Categorized menu rows for clean scannability like standard hirezy framework panels
  const sectionedMenu = [
    {
      groupName: "Workspace",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
        { id: 'internship', label: 'My Internship', icon: <GraduationCap className="w-4 h-4" /> },
      ]
    },
    {
      groupName: "Learning Stream",
      items: [
        { id: 'live-classes', label: 'Live Classes', icon: <Radio className="w-4 h-4" /> },
        { id: 'recorded-lectures', label: 'Recorded Lectures', icon: <CirclePlay className="w-4 h-4" /> },
      ]
    },
    {
      groupName: "Compliance Logs",
      items: [
        { id: 'attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" /> },
        { id: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
      ]
    },
    {
      groupName: "Ecosystem",
      items: [
        { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" />, badge: true },
      ]
    }
  ];

  return (
    <aside className={`
      bg-white border-r border-slate-100 
      flex flex-col h-full shrink-0 select-none transition-all duration-300
      w-64 ${!isExpanded ? 'lg:w-20' : 'lg:w-64'} 
      overflow-hidden
    `}>

      {/* 1. Brand Identity Header */}
      <div className={`
        flex h-20 items-center border-b border-slate-50 gap-2 shrink-0 px-6
        ${!isExpanded ? 'lg:px-4 lg:justify-center' : 'lg:px-6 lg:justify-start'}
      `}>
        <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div className={`block ${!isExpanded ? 'lg:hidden' : 'lg:block'}`}>
          <div className="text-sm font-black text-slate-900 tracking-tight">
            Internship <span className="text-[#ff9900]">Place</span>
          </div>
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Learn. Intern. Grow.</div>
        </div>
      </div>

      {/* 2. Navigation Link Elements */}
      <nav className="flex-grow flex flex-col py-4 px-3 lg:px-2 gap-4 overflow-y-auto max-h-[calc(100vh-12rem)] custom-scrollbar">
        {sectionedMenu.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {/* Subsection header category tags context */}
            <span className={`text-[9px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1 ${!isExpanded ? 'lg:hidden' : 'block'}`}>
              {group.groupName}
            </span>
            
            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`
                    flex items-center gap-3 w-full
                    p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition relative whitespace-nowrap
                    ${!isExpanded ? 'lg:justify-center' : 'lg:justify-between'}
                    ${isActive
                      ? 'bg-blue-50 text-[#0066ff]'
                      : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-800'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0">{item.icon}</span>
                    <span className={`block ${!isExpanded ? 'lg:hidden' : 'lg:block'}`}>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`
                      w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0
                      ${!isExpanded ? 'absolute top-2 right-2 lg:static' : 'static'}
                    `} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 3. Need Help CTA Support Footer */}
      <div className="p-4 border-t border-slate-50 shrink-0 bg-white">
        {isExpanded ? (
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm text-[#0066ff]">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Need Help?</h5>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Our support team is here for you.</p>
            </div>
            <button onClick={() => setActiveTab('support')} className="w-full bg-[#0066ff] hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-sm">
              Contact Support →
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex justify-center">
            <button
              title="Support Center"
              onClick={() => setActiveTab('support')}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-[#0066ff] transition"
            >
              <Headphones className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}