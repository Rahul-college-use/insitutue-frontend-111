import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/user/dashboard/Sidebar';
import Topbar from '../components/user/dashboard/Topbar';
import MainDashboard from '../components/user/dashboard/MainDashboard';
import Attendance from '../components/user/dashboard/Attendance';
import MyProfile from '../components/user/dashboard/MyProfile';
import MyInternship from '../components/user/dashboard/MyInternship';
import Certificates from '../components/user/dashboard/Certificates';
import Announcements from '../components/user/dashboard/Announcements';
import Support from '../components/user/dashboard/Support';
import LiveClasses from '../components/user/dashboard/course/LiveClasses';
import RecordedLectures from '../components/user/dashboard/course/RecordedLectures';
import CoursePurchaseCatalog from '../components/user/dashboard/CoursePurchaseCatalog';
import { apiService } from '../services/api';

export default function DashboardPage({ setIsAuthenticated }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fresh runtime token parser connection pipeline
  const fetchdata = useCallback(async () => {
    try {
      const user = await apiService.getStoredUser();
      if (user && user.user) {
        setCurrentUser(user.user);

        // 🔒 SAFETY REDIRECTION ENGINE: Agar login karne wala admin hai, toh use clear target mapping route par redirect karo!
        if (user.user.isAdmin === true) {
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      }
    } catch (error) {
      console.error("Failed to synchronize active workspace profile data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const tokenExists = !!localStorage.getItem('token');
    if (!tokenExists) {
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
      return;
    }
    fetchdata();
  }, [navigate, setIsAuthenticated, fetchdata]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-slate-950 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">
            Synchronizing Student Workspace Profile...
          </p>
        </div>
      </div>
    );
  }

  // Enrollment identity evaluation
  const hasPurchasedCourse = currentUser && currentUser.isEnrolled === true;

  return (
    <div className="w-full h-screen bg-slate-50/50 flex overflow-hidden font-sans text-slate-800 antialiased relative">

      {/* Mobile Sidebar Overlap Layer Backdrop */}
      {sidebarExpanded && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      {/* 1. SIDEBAR CONTAINER (STUDENT CONTEXT ONLY) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:z-auto lg:static h-full shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarExpanded ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {console.log("Has Purchased Course:", !hasPurchasedCourse,[activeTab, 'dashboard', 'profile', 'support'].includes(activeTab))};
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            // Un-enrolled members gateway guard verification rails
            if (!hasPurchasedCourse && !['dashboard', 'profile', 'support'].includes(tab)) {
              alert("Please enroll in a program specialization to unlock this workspace panel.");
              return;
            }
            setActiveTab(tab);
            setSidebarExpanded(false);
          }}
          isExpanded={true}
          setIsExpanded={setSidebarExpanded}
        />
      </div>

      {/* 2. CORE VIEWPORT CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0 h-full overflow-hidden">

        {/* Dynamic Context Header Topbar */}
        <Topbar
          setIsAuthenticated={setIsAuthenticated}
          onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
          sidebarExpanded={sidebarExpanded}
          user={currentUser}
        />

        {/* Active Child Elements Canvas Router Switches */}
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto bg-slate-50/40 custom-scrollbar">
          {activeTab === 'dashboard' && !hasPurchasedCourse ? (
            <CoursePurchaseCatalog
              user={currentUser}
              onPurchaseSuccess={fetchdata}

            />

          ) : (
            <>
              {activeTab === 'dashboard' && <MainDashboard user={currentUser} />}
              {activeTab === 'profile' && <MyProfile user={currentUser} />}
              {activeTab === 'internship' && <MyInternship user={currentUser} />}
              {activeTab === 'attendance' && <Attendance user={currentUser} />}
              {activeTab === 'certificates' && <Certificates user={currentUser} />}
              {activeTab === 'announcements' && <Announcements user={currentUser} />}
              {activeTab === 'support' && <Support user={currentUser} />}
              {activeTab === 'live-classes' && <LiveClasses user={currentUser} />}
              {activeTab === 'recorded-lectures' && <RecordedLectures user={currentUser} />}
              {/* {console.log("Active Tab State:", currentUser, activeTab)}; */}

              {/* Secure fallback tracking check layout state validation blocks */}
              {!['dashboard', 'profile', 'internship', 'attendance', 'certificates', 'announcements', 'support', 'live-classes', 'recorded-lectures'].includes(activeTab) && (
                <div className="flex items-center justify-center h-full text-slate-400 font-medium text-sm p-6 text-center border border-dashed border-slate-200 rounded-3xl bg-white">
                  Section content for tracking path stream "{activeTab}" is initializing...
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </div>
  );
}