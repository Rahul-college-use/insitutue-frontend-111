import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, Bell, Search, Sliders, Command, EyeOff, Trash2, Layout, Moon, Sun, X
} from 'lucide-react';

// Decoupled Sidebar Module Integration Link
import Sidebar from './Sidebar';

// Subview Component Mount Point Links
import VerificationDesk from './VerificationDesk';
import EnrollmentsGrid from './EnrollmentsGrid';
import CourseAdd from './CourseAdd';
import CourseWorkshopDesk from './CourseWorkshopDesk';
import CourseManager from './CoursesManager';
import AdminStudentAttendanceDesk from './AdminStudentAttendanceDesk';
import { apiService } from '../../services/api';

export default function AdminDashboard({ setIsAuthenticated }) {
  // Navigation & Workspace Structural States
  const [activeSubView, setActiveSubView] = useState('registrations');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // ✅ NEW FEATURE: Particular Student Identity Navigation Routing States
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [attendanceCourseContextId, setAttendanceCourseContextId] = useState('');

  // Premium Layout Feature Interactivity Flags
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Core Operational Metrics Subsystem Frame
  const [statsLoading, setStatsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [systemStats, setSystemStats] = useState({
    totalStudents: 142,
    pendingApprovals: 8,
    activeRooms: 2,
    publishedCourses: 3
  });

  // Overlord System Policy Configurations
  const [intakeOpen, setIntakeOpen] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Core Mapped Programs Dynamic Database Array State
  const [coursesList, setCoursesList] = useState([]);

  // Fetch Live Course List Array Context on Mounting Handshake
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await apiService.getCourses();
        // const response = await fetch('http://localhost:3000/api/auth/coursesData'); // apiserver.getCourses() can be used if apiService is imported
        // const data = await response.json();
        setCoursesList(data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses mapping matrix:", err);
      }
    };
    fetchCourses();
  }, [refreshTrigger]);

  // Theme Controller Synchronizer Layer
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global Keyboard Shortcuts Subsystem listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyboardShortcuts = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsNotificationCenterOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleAdminLogout = () => {
    localStorage.clear();
    if (setIsAuthenticated) setIsAuthenticated(false);
    window.location.href = "/login";
  };

  const routeToCourseWorkshop = (courseId) => {
    setSelectedCourseId(courseId);
    setActiveSubView('course-workshop-desk');
    setIsMobileDrawerOpen(false);
  };

  // ✅ NEW FEATURE: Attendance routing trigger callback method
  const routeToStudentAttendanceDesk = (studentId, courseId) => {
    setSelectedStudentId(studentId);
    setAttendanceCourseContextId(courseId);
    setActiveSubView('student-attendance-desk');
    setIsMobileDrawerOpen(false); // Mobile layouts par drawer bundle close karne ke liye
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#070708] text-zinc-900 dark:text-[#f4f4f5] font-sans flex overflow-hidden relative selection:bg-zinc-200 dark:selection:bg-zinc-800 selection:text-black dark:selection:text-white transition-colors duration-200">

      {/* 🌌 GLASSMORPHISM ART BASE LAYER OVERLAYS */}
      <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#1c1c1f_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-b from-zinc-200/[0.15] dark:from-zinc-50/[0.03] to-transparent rounded-full blur-[130px] pointer-events-none" />

      {/* 🧭 INJECTED DECOUPLED SIDEBAR BLADE HOOK */}
      <Sidebar
        activeSubView={activeSubView}
        setActiveSubView={setActiveSubView}
        selectedCourseId={selectedCourseId}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobileDrawerOpen={isMobileDrawerOpen}
        setIsMobileDrawerOpen={setIsMobileDrawerOpen}
        coursesList={coursesList}
        routeToCourseWorkshop={routeToCourseWorkshop}
        handleAdminLogout={handleAdminLogout}
      />

      {/* ========================================================= */}
      {/* 🖥️ MAIN WORKSPACE PLATFORM                                 */}
      {/* ========================================================= */}
      <div className="flex-grow flex flex-col h-screen overflow-y-auto custom-scrollbar z-10 relative bg-zinc-50 dark:bg-[#070708] transition-colors duration-200">

        {/* TOP BAR MANAGEMENT COCKPIT */}
        <header className="p-4 bg-white/80 dark:bg-[#070708]/80 border-b border-zinc-200 dark:border-zinc-800/40 flex items-center justify-between gap-4 shrink-0 backdrop-blur-md z-30">

          {/* SEARCH TRIGGER SYSTEM ACTION LINK */}
          <div className="flex items-center gap-3 flex-grow max-w-md">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-500 dark:text-zinc-400 md:hidden cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition shadow-sm"
            >
              <Layout className="w-4 h-4" />
            </button>
            <div
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center gap-3 bg-zinc-50 dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/80 px-3 py-1.5 rounded-lg text-xs text-zinc-400 dark:text-zinc-500 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 transition group shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition" />
              <span className="font-medium truncate">Search catalogs, codes, matrices...</span>
              <kbd className="ml-auto bg-white dark:bg-zinc-900 px-1.5 py-0.5 text-[9px] font-mono rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hidden sm:block shadow-sm">⌘K</kbd>
            </div>
          </div>

          {/* SYSTEM THEME & NOTIFICATION TOOLS */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer h-8 w-8 flex items-center justify-center shadow-sm"
              title="Toggle Light/Dark Workspace Mode"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-zinc-600" />}
            </motion.button>

            <button
              onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition relative cursor-pointer shadow-sm"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            </button>
            <button
              onClick={triggerRefresh}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition h-8 w-8 flex items-center justify-center cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? 'animate-spin text-zinc-500' : ''}`} />
            </button>
          </div>
        </header>

        {/* PRIMARY SUBVIEW CONTAINER VIRTUAL ROUTER FRAME */}
        <main className="p-3 sm:p-6 lg:p-8 flex-grow">
          <div className="bg-white dark:bg-[#0c0c0e]/40 rounded-xl border border-zinc-200 dark:border-zinc-800/30 p-3 sm:p-6 min-h-[440px] shadow-sm dark:shadow-2xl backdrop-blur-md transition-colors duration-200">

            {activeSubView === 'registrations' && <VerificationDesk refreshTrigger={refreshTrigger} triggerRefresh={triggerRefresh} />}
            {activeSubView === 'enrollments' && <EnrollmentsGrid refreshTrigger={refreshTrigger} />}
            {activeSubView === 'course-add' && <CourseAdd setActiveSubView={setActiveSubView} triggerRefresh={triggerRefresh} />}

            {/* DYNAMIC BATCH CORE WORKSHOP ISOLATION CONSOLE MOUNT POINT */}
            {activeSubView === 'course-workshop-desk' && (
              <CourseWorkshopDesk
                selectedCourseId={selectedCourseId}
                coursesList={coursesList}
                triggerRefresh={triggerRefresh}
                // Forward function trigger down to hook table selection clicks
                routeToStudentAttendanceDesk={routeToStudentAttendanceDesk}
              />
            )}

            {/* ✅ NEW FEATURE ISOLATED ROUTER POINT: SINGLE USER DESK HUB */}
            {activeSubView === 'student-attendance-desk' && (
              <AdminStudentAttendanceDesk
                studentId={selectedStudentId}
                courseId={attendanceCourseContextId}
                onBack={() => {
                  // Admin ko seamlessly usi course registry console par return karega jahan se click hua tha
                  setActiveSubView('course-workshop-desk');
                }}
              />
            )}

            {activeSubView === 'course-manager' && (
              <CourseManager
                coursesList={coursesList}
                routeToCourseWorkshop={routeToCourseWorkshop}
                triggerRefresh={triggerRefresh}
              />
            )}

            {/* ========================================================= */}
            {/* OVERLORD GLOBAL SECTOR SYSTEM POLICY CONFIGURATION */}
            {/* ========================================================= */}
            {activeSubView === 'config-overlord' && (
              <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800/40 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto space-y-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800/50 pb-3">
                  <Sliders className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <h5 className="font-black text-zinc-800 dark:text-white text-xs font-mono tracking-wider uppercase">CORE_OVERLORD // SYSTEM_POLICIES</h5>
                </div>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-[#0c0c0e] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-0.5 text-[11px] sm:text-xs">
                      <h6 className="font-black text-zinc-800 dark:text-white">Student Onboarding Registration Gateway</h6>
                      <p className="text-zinc-500 dark:text-zinc-500 leading-normal font-medium">Globally suspend client application ingestion endpoints during batch synchronization freezes.</p>
                    </div>
                    <button onClick={() => setIntakeOpen(!intakeOpen)} className="w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 self-end sm:self-auto shadow-inner">
                      <div className={`w-4 h-4 rounded-full transition-transform duration-200 shadow-md ${intakeOpen ? 'translate-x-6 bg-zinc-900 dark:bg-zinc-100' : 'translate-x-0 bg-zinc-400 dark:bg-zinc-600'}`} />
                    </button>
                  </div>

                  <div className="bg-white dark:bg-[#0c0c0e] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-0.5 text-[11px] sm:text-xs">
                      <h6 className="font-black text-zinc-800 dark:text-white">Maintenance Interception Core Proxy</h6>
                      <p className="text-zinc-500 dark:text-zinc-500 leading-normal font-medium">Instantly force downstream active client environments into static recovery templates.</p>
                    </div>
                    <button onClick={() => setMaintenanceMode(!maintenanceMode)} className="w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 self-end sm:self-auto shadow-inner">
                      <div className={`w-4 h-4 rounded-full transition-transform duration-200 shadow-md ${maintenanceMode ? 'translate-x-6 bg-zinc-900 dark:bg-zinc-100' : 'translate-x-0 bg-zinc-400 dark:bg-zinc-600'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* 🚀 PREMIUM OVERLAYS: HUD SHORTCUT KEY COMMAND PALETTE    */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center pt-24 px-4"
            onClick={() => setIsCommandPaletteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -10 }}
              className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50 dark:bg-[#09090b]">
                <Command className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="Type a command keyword or configuration path..."
                  className="bg-transparent border-none outline-none text-xs text-zinc-900 dark:text-white w-full placeholder-zinc-400 dark:placeholder-zinc-600 font-medium"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setIsCommandPaletteOpen(false)} className="text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-2 max-h-60 overflow-y-auto font-mono text-[11px] divide-y divide-zinc-100 dark:divide-zinc-900 text-zinc-600 dark:text-zinc-300">
                <div onClick={() => { setActiveSubView('registrations'); setIsCommandPaletteOpen(false); }} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer flex items-center justify-between transition-colors">
                  <span>/navigate/verification-desk</span>
                  <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-600">Open Gateway Profiles</span>
                </div>
                <div onClick={() => { setActiveSubView('enrollments'); setIsCommandPaletteOpen(false); }} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer flex items-center justify-between transition-colors">
                  <span>/navigate/enrollments-grid</span>
                  <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-600">Open Main Matrix</span>
                </div>
                <div onClick={() => { setIntakeOpen(!intakeOpen); setIsCommandPaletteOpen(false); }} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer flex items-center justify-between transition-colors">
                  <span>/system/toggle-intake-portal</span>
                  <span className="font-sans font-bold text-zinc-500">{intakeOpen ? 'ACTIVE // SHUTDOWN' : 'OFFLINE // BOOT'}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 📢 PREMIUM OVERLAYS: GLASSMORPHISM NOTIFICATION STREAM   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isNotificationCenterOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="fixed top-16 right-4 w-80 bg-white/95 dark:bg-[#0c0c0e]/95 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl p-4 z-40 backdrop-blur-md space-y-3 font-sans"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-2">
              <span className="text-xs font-black uppercase text-zinc-800 dark:text-white tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-zinc-400" /> Notifications Stream
              </span>
              <button onClick={() => setIsNotificationCenterOpen(false)} className="text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar text-[11px] divide-y divide-zinc-100 dark:divide-zinc-900/50">
              <div className="pt-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold block">Profile Validation Influx</span>
                <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal font-medium">8 student enrollment registration forms are stacked in the verification pending loop queue.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}