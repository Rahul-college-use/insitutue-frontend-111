import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Calendar, Clock, ArrowRight, Plus, Award, FileText, CheckCircle2
} from 'lucide-react';
import { apiService } from '../../../services/api';

export default function MainDashboard({ user, setActiveTab }) {
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState(null);

  // Single Object safe parsing
  const activeCourse = user?.enrolledCourses
    ? (Array.isArray(user.enrolledCourses) ? user.enrolledCourses[0] : user.enrolledCourses)
    : null;

  // Load dynamic global catalog mapping arrays safely (Sirf tabhi jab course enrolled na ho)
  const loadCatalogData = useCallback(async () => {
    if (activeCourse) return; 
    try {
      const allCourses = await apiService.getPrograms();
      setAvailableCourses(allCourses);
    } catch (err) {
      console.error("Catalog tracking load error:", err);
    }
  }, [activeCourse]);

  // Unified Effect Hook: Page refresh par database se attendance sync karega
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

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 space-y-6 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">

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

      {/* 2. CORE WORKSPACE CONTENT AREA (Full-Width Clean Layout) */}
      <div className="space-y-4 w-full">
        <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <BookOpen className="w-4 h-4 text-[#0066ff]" /> Your Workspace Status
        </h3>

        {!activeCourse ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-xs text-slate-400 font-medium w-full">
            No active enrollment found. Please select a course from catalog below.
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {/* Active Program Main Card */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between p-5 hover:border-slate-300 transition w-full">
              <div className="space-y-3">
                <span className="text-[9px] font-black text-[#0066ff] bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider w-fit block">
                  {activeCourse.cert || "Compliant Module"}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {activeCourse.courseName || activeCourse.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase mt-0.5">
                    {activeCourse.meta || "Specialization Track"}
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

            {/* 🏆 RESPONSIVE CERTIFICATE & ORDER LETTER BOXES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Box 1: Go to Certificate */}
              <div
                onClick={() => setActiveTab('certificates')}
                className="bg-gradient-to-br from-white to-blue-50/30 border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm truncate">Go to Certificate</h5>
                    <p className="text-[10px] text-slate-400 font-medium truncate">View or share your achievements</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
              </div>

              {/* Box 2: Order Letter */}
              <div
                onClick={() => setActiveTab('internship')}
                className="bg-gradient-to-br from-white to-indigo-50/30 border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm truncate">Order Letter</h5>
                    <p className="text-[10px] text-slate-400 font-medium truncate">Download official joining letter</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. LIVE AVAILABLE TRAINING CATALOG VIEW */}
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

    </div>
  );
}