import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Calendar, Clock, ArrowRight, Plus, Award, FileText, CheckCircle2,
  Receipt, BookMarked, Edit3, CalendarCheck, FileCheck, BarChart3, Trophy, ShieldCheck
} from 'lucide-react';
import { apiService } from '../../../services/api';
import {
  handlePrintConsentLetter,
  handlePrintAcceptanceLetter,
  handlePrintFeeReceipt,
  handlePrintDailyLog,
  handlePrintFeedback,
  handlePrintMarksheet,
  handlePrintCertificate,
  handlePrintDepartmentCertificate,
  handlePrintDeclaration
} from '../../../utils/printUtils';

export default function MainDashboard({ user, setActiveTab }) {
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Single Object safe parsing
  const activeCourse = user?.enrolledCourses
    ? (Array.isArray(user.enrolledCourses) ? user.enrolledCourses[0] : user.enrolledCourses)
    : null;

  // Load dynamic global catalog mapping arrays safely
  const loadCatalogData = useCallback(async () => {
    if (activeCourse) return;
    try {
      const allCourses = await apiService.getPrograms();
      setAvailableCourses(allCourses);
    } catch (err) {
      console.error("Catalog tracking load error:", err);
    }
  }, [activeCourse]);

  // Unified Effect Hook
  useEffect(() => {
    const verifyRealtimeAttendance = async () => {
      const currentCourseId = activeCourse?._id || activeCourse?.id;

      if (!currentCourseId) return;

      try {
        const res = await apiService.checkAttendanceStatus(currentCourseId);
        if (res && (res.hasCheckedIn === true || res.data?.hasCheckedIn === true || res.success === true)) {
          setCheckedIn(true);
        } else {
          setCheckedIn(false);
        }
      } catch (err) {
        console.error("Failed to sync attendance checkpoint status:", err);
      }
    };

    if (user) {
      loadCatalogData();
      verifyRealtimeAttendance();
    }
  }, [user, loadCatalogData, activeCourse]);

  const handleDailyCheckIn = async () => {
    const currentCourseId = activeCourse?._id || activeCourse?.id;
    if (!currentCourseId) return;

    try {
      setLoading(true);
      const result = await apiService.logCheckIn({ courseId: currentCourseId });
      if (result.success) {
        setCheckedIn(true);
        alert("Attendance marked successfully.");
      } else {
        alert(result.message || "Check-in failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit check-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async (courseId) => {
    try {
      setEnrollLoading(courseId);
      const res = await apiService.enrollUser(courseId);
      if (res && res.success) {
        alert("🎉 Successfully Enrolled!");
        window.location.reload();
      } else {
        alert(res.message || "Enrollment allocation failed.");
      }
    } catch (err) {
      alert("Network gateway registration drop.");
    } finally {
      setEnrollLoading(null);
    }
  };

  // Card click dispatcher
  const handleCardClick = (tabKey) => {
    switch (tabKey) {
      case 'consent-form':
        handlePrintConsentLetter(user);
        break;
      case 'internship':
        handlePrintAcceptanceLetter(user);
        break;
      case 'receipts':
        handlePrintFeeReceipt(user);
        break;
      case 'daily-log':
        handlePrintDailyLog(user);
        break;
      case 'feedback':
        handlePrintFeedback(user);
        break;
      case 'attendance':
        handlePrintDailyLog(user);
        break;
      case 'report':
        setShowReportModal(true);
        break;
      case 'marksheet':
        handlePrintMarksheet(user);
        break;
      case 'certificates':
        handlePrintCertificate(user);
        break;
      case 'dept-certificate':
        handlePrintDepartmentCertificate(user);
        break;
      case 'declaration':
        handlePrintDeclaration(user);
        break;
      default:
        setActiveTab(tabKey);
        break;
    }
  };

  // Grid Dashboard Cards Data with vibrant gradient styles
  const dashboardCards = [
    {
      title: 'Consent Form',
      description: 'Print consent form and sign it before submitting to your college',
      icon: FileText,
      gradient: 'from-emerald-500 to-green-600',
      tab: 'consent-form'
    },
    {
      title: 'Acceptance Letter',
      description: 'Official internship acceptance letter by optimark for your college',
      icon: FileCheck,
      gradient: 'from-sky-500 to-blue-600',
      tab: 'internship'
    },
    {
      title: 'Fee Receipt',
      description: 'Download and print internship fee payment receipt',
      icon: Receipt,
      gradient: 'from-indigo-500 to-purple-600',
      tab: 'receipts'
    },
    {
      title: 'Daily Log',
      description: 'Internship activity logbook for daily tasks and learnings',
      icon: BookMarked,
      gradient: 'from-blue-600 to-indigo-700',
      tab: 'daily-log'
    },
    {
      title: 'Feedback Form',
      description: 'Share your internship experience',
      icon: Edit3,
      gradient: 'from-amber-500 to-red-600',
      tab: 'feedback'
    },
    {
      title: 'Attendance Sheet',
      description: 'Download attendance record',
      icon: CalendarCheck,
      gradient: 'from-slate-700 to-slate-900',
      tab: 'attendance'
    },
    {
      title: 'Internship Report',
      description: 'Internship report template',
      icon: FileText,
      gradient: 'from-fuchsia-500 to-purple-600',
      tab: 'report'
    },
    {
      title: 'Marksheet',
      description: 'Assessment result',
      icon: BarChart3,
      gradient: 'from-indigo-600 to-violet-700',
      tab: 'marksheet'
    },
    {
      title: 'Certificate',
      description: 'Download certificate',
      icon: Trophy,
      gradient: 'from-emerald-500 to-teal-600',
      tab: 'certificates'
    },
    {
      title: 'Department Certificate',
      description: 'Department certificate',
      icon: Award,
      gradient: 'from-violet-600 to-purple-700',
      tab: 'dept-certificate'
    },
    {
      title: 'Student Declaration',
      description: 'Student declaration',
      icon: ShieldCheck,
      gradient: 'from-orange-500 to-red-600',
      tab: 'declaration'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 space-y-6 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">

      {/* 1. GREETING & ATTENDANCE CHECK-IN BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Workspace Hub</span>
          <h2 className="text-xl sm:text-2xl font-black mt-0.5">Welcome back, {user?.fullName || "Student"}!</h2>
          <p className="text-blue-100 text-xs mt-1">Ready to resume your industrial training modules today?</p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center gap-4 shrink-0 justify-between sm:justify-start">
          <div className="text-xs">
            <span className="block text-blue-200 font-medium">Today's Attendance</span>
            <span className="font-bold block mt-0.5 whitespace-nowrap">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
          {checkedIn ? (
            <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Present
            </div>
          ) : (
            <button
              onClick={handleDailyCheckIn}
              disabled={loading || !activeCourse}
              className="bg-white hover:bg-slate-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-xs transition shadow-sm focus:outline-none disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Logging..." : "Log Check-In"}
            </button>
          )}
        </div>
      </div>

      {/* 2. CORE WORKSPACE CONTENT AREA */}
      <div className="space-y-4 w-full">
        <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <BookOpen className="w-4 h-4 text-[#0066ff]" /> Your Workspace Status
        </h3>

        {!activeCourse ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-xs text-slate-400 font-medium w-full">
            No active enrollment found. Please select a course from catalog below.
          </div>
        ) : (
          <div className="space-y-5 w-full">
            {/* Active Program Main Card */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between p-5 hover:border-slate-300 transition w-full">
              <div className="space-y-3">
                <span className="text-[9px] font-black text-[#0066ff] bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider w-fit block">
                  {activeCourse.cert || "AICTE COMPLIANT"}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {activeCourse.courseName || activeCourse.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase mt-0.5">
                    {activeCourse.meta || "B.TECH / DIPLOMA"}
                  </p>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
                  {activeCourse.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Start: {activeCourse.courseStartDate ? new Date(activeCourse.courseStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Live Today"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 font-bold">Active</span>
                </div>
              </div>
            </div>

            {/* 3. COLORFUL DASHBOARD ACTION BOXES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {dashboardCards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleCardClick(card.tab)}
                    className={`bg-gradient-to-r ${card.gradient} text-white rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-36 border border-white/10`}
                  >
                    <div>
                      <IconComponent className="w-6 h-6 mb-2 opacity-90" />
                      <h4 className="font-extrabold text-base leading-snug">{card.title}</h4>
                    </div>
                    <p className="text-xs text-white/80 line-clamp-2 font-medium leading-tight">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. LIVE AVAILABLE TRAINING CATALOG VIEW */}
      {!activeCourse && availableCourses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100 w-full">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <ArrowRight className="w-4 h-4 text-emerald-500" /> Explore Available Specializations ({availableCourses.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {availableCourses.map((catalog) => (
              <div key={catalog._id} className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-slate-300 transition w-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {catalog.cert || "AICTE Approved"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {catalog.meta || "Specialization"}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1">
                    {catalog.courseName}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 font-medium leading-relaxed">
                    {catalog.description}
                  </p>
                </div>

                <button
                  disabled={enrollLoading === catalog._id}
                  onClick={() => handleEnrollment(catalog._id)}
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-2.5 rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {enrollLoading === catalog._id ? "Processing..." : <><Plus className="w-3.5 h-3.5" /> Fast Enroll Track</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. INTERNSHIP REPORT DOWNLOAD MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              📋
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Download Comprehensive Internship Report
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Generate and download your detailed 20+ page internship report for <span className="font-bold text-slate-800">{user.enrolledCourses.courseName}</span>.
              </p>
            </div>

            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700 leading-relaxed font-medium text-left">
              <span className="font-bold">Note:</span> The report includes 14 chapters, 20+ pages, comprehensive analysis, references, and appendices in professional academic format.
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  alert("Downloading 20+ Page Internship Report PDF...");
                  setShowReportModal(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                📥 Download 20+ Page Report
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <p className="text-[10px] text-slate-400">
              Includes: Cover Page, Certificate, Abstract, Literature Review, Methodology, Analysis, Conclusions, References, Appendices
            </p>
          </div>
        </div>
      )}

    </div>
  );
}