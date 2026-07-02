import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Sliders, PlusCircle, Power, Layout, X,BookOpen } from 'lucide-react';

// New Split Workshops Subsystem Link
import WorkshopsList from './WorkshopsList';

export default function Sidebar({
  activeSubView,
  setActiveSubView,
  selectedCourseId,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobileDrawerOpen,
  setIsMobileDrawerOpen,
  coursesList,
  routeToCourseWorkshop,
  handleAdminLogout
}) {
  return (
    <>
      {/* 🧭 DESKTOP FIXED COLLAPSIBLE BLADE SIDEBAR */}
      <aside className={`
        hidden md:flex bg-zinc-100 dark:bg-[#09090b] border-r border-zinc-200 dark:border-zinc-800/50 flex-col justify-between 
        transition-all duration-300 ease-in-out relative z-20 shrink-0 h-full
        ${isSidebarCollapsed ? 'w-20' : 'w-76'}
      `}>
        <div className="flex flex-col flex-grow overflow-y-auto custom-scrollbar p-4 space-y-8">

          {/* HEADER SECTOR */}
          <div className="flex items-center justify-between px-2">
            {!isSidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 tracking-widest block">HUD TERMINAL</span>
                <h2 className="text-xs font-black text-zinc-800 dark:text-white tracking-tight mt-0.5">OVERLORD CORE</h2>
              </motion.div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:text-black dark:hover:text-white text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 transition cursor-pointer shadow-sm"
            >
              <Layout className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SYSTEM CORE SECTORS */}
          <div className="space-y-1">
            {!isSidebarCollapsed && <span className="block text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2.5 px-2">CORE DESKS</span>}
            <button
              onClick={() => setActiveSubView('registrations')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer group ${activeSubView === 'registrations' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-black' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Terminal className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">Verification Desk</span>}
              </div>
            </button>
            <button
              onClick={() => setActiveSubView('enrollments')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer group ${activeSubView === 'enrollments' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-black' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Activity className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">Enrollments Grid</span>}
              </div>
            </button>
          </div>

          {/* 📂 ISOLATED DESKTOP WORKSHOPS LAYER */}
          <WorkshopsList 
            coursesList={coursesList}
            activeSubView={activeSubView}
            selectedCourseId={selectedCourseId}
            routeToCourseWorkshop={routeToCourseWorkshop}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {/* ENGINE UTILITY INJECTIONS */}
          <div className="space-y-1 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
            <button
              onClick={() => setActiveSubView('config-overlord')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center gap-3 cursor-pointer ${activeSubView === 'config-overlord' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-black' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              <Sliders className="w-4 h-4" /> {!isSidebarCollapsed && <span>System Config</span>}
            </button>
            <button
              onClick={() => setActiveSubView('course-add')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition items-center gap-3 cursor-pointer flex ${activeSubView === 'course-add' ? 'bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 text-white' : 'text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'}`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" /> {!isSidebarCollapsed && <span className="truncate">Add Course</span>}
            </button>
            <button
              onClick={() => setActiveSubView('course-manager')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition items-center gap-3 cursor-pointer flex ${activeSubView === 'course-manager' ? 'bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 text-white' : 'text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'}`}
            >
              <BookOpen className="w-4 h-4 shrink-0" /> {!isSidebarCollapsed && <span className="truncate">Courses Manager</span>}
            </button>
          </div>
        </div>

        {/* LOGOUT SECURE COMPONENT */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/40 bg-zinc-50 dark:bg-[#09090b]">
          <button onClick={handleAdminLogout} className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition text-xs font-black py-2 rounded-lg cursor-pointer font-mono shadow-sm">
            <Power className="w-3.5 h-3.5" /> {!isSidebarCollapsed && <span>DISCONNECT</span>}
          </button>
        </div>
      </aside>

      {/* 📱 PREMIUM OVERLAYS: COMPACT NAVIGATION MOBILE DRAWERS */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-zinc-800 z-50 p-5 flex flex-col justify-between md:hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-black tracking-widest text-zinc-400 dark:text-zinc-500">MOBILE DRAWER</h3>
                  <button onClick={() => setIsMobileDrawerOpen(false)} className="text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-1">
                  <button onClick={() => { setActiveSubView('registrations'); setIsMobileDrawerOpen(false); }} className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Verification Desk
                  </button>
                  <button onClick={() => { setActiveSubView('enrollments'); setIsMobileDrawerOpen(false); }} className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-3">
                    <Activity className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Enrollments Grid
                  </button>
                </div>
                
                {/* 📂 ISOLATED MOBILE DRAWERS WORKSHOPS LAYER */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/40">
                  <WorkshopsList 
                    coursesList={coursesList}
                    activeSubView={activeSubView}
                    selectedCourseId={selectedCourseId}
                    routeToCourseWorkshop={routeToCourseWorkshop}
                    isSidebarCollapsed={false} 
                  />
                </div>
                
              </div>
              <button onClick={handleAdminLogout} className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold py-2 rounded-lg text-xs tracking-wide cursor-pointer uppercase transition-colors">Disconnect Session</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}