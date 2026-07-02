import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader, BookOpen, Calendar, Clock, Bell, CheckCircle2, AlertCircle, ArrowRight, Plus
} from 'lucide-react';
import { apiService } from '../../../services/api';

export default function MainDashboard({ user }) {
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState(null);

  // Derive the active enrolled list up-front
  const enrolledList = user?.enrolledCourses || [];

  // Load dynamic global catalog mapping arrays safely
  const loadCatalogData = useCallback(async () => {
    try {
      const allCourses = await apiService.getPrograms();
      // Filter out courses that the student has already enrolled in
      const enrolledIds = user?.enrolledCourses?.map(c => c._id || c.id) || [];
      const filtered = allCourses.filter(c => !enrolledIds.includes(c._id));
      setAvailableCourses(filtered);
    } catch (err) {
      console.error("Catalog tracking load error:", err);
    }
  }, [user]);

  // Unified Effect Hook: Page refresh par database se attendance sync karega
  useEffect(() => {
    const verifyRealtimeAttendance = async () => {
      // Pehle enrolled course ki ID uthayenge status check karne ke liye
      const currentCourseId = enrolledList[0]?._id || enrolledList[0]?.id;
      
      if (!currentCourseId) {
        console.log("No active enrolled course found to check attendance status.");
        return;
      }

      try {
        console.log("Verifying attendance check-in status from DB for course:", currentCourseId);
        const res = await apiService.checkAttendanceStatus(currentCourseId);
        console.log("Attendance API Response received:", res);

        // Safe status check logic (Handles all variations of response wrappers)
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
  }, [user, loadCatalogData]);

  const handleDailyCheckIn = async () => {
    const currentCourseId = enrolledList[0]?._id || enrolledList[0]?.id;

    if (!currentCourseId) {
      alert("No active training module found to check into.");
      return;
    }

    try {
      setLoading(true);
      console.log("Calling logCheckIn for course:", currentCourseId);

      const result = await apiService.logCheckIn({ courseId: currentCourseId });
      console.log("Server response:", result);

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
        alert("🎉 Successfully Enrolled! Please refresh or wait for admin activation.");
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
    <div className="max-w-5xl mx-auto p-2 sm:p-4 space-y-8 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">

      {/* 1. GREETING & ATTENDANCE CHECK-IN BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Workspace Hub</span>
          <h2 className="text-xl sm:text-2xl font-black mt-0.5">Welcome back, {user?.fullName || "Student"}!</h2>
          <p className="text-blue-100 text-xs mt-1">Ready to resume your industrial training modules today?</p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center gap-4 shrink-0 justify-between sm:justify-start">
          <div className="text-xs">
            <span className="block text-blue-200 font-medium">Today's Attendance</span>
            <span className="font-bold block mt-0.5">
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
              disabled={loading}
              className="bg-white hover:bg-slate-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-xs transition shadow-sm focus:outline-none disabled:opacity-50"
            >
              {loading ? "Logging..." : "Log Check-In"}
            </button>
          )}
        </div>
      </div>

      {/* 2. CORE WORKSPACE CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Double-Column Section: Active Programs Only */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <BookOpen className="w-4 h-4 text-[#0066ff]" /> Your Active Programs ({enrolledList.length})
          </h3>

          {enrolledList.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-xs text-slate-400 font-medium">
              No program specializations linked to this active workspace pipeline registry.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledList.map((course) => (
                <div key={course._id || course.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
                  <div className="p-5 space-y-3">
                    <span className="text-[9px] font-black text-[#0066ff] bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider w-fit block">
                      {course.cert || "Compliant Module"}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {course.courseName || course.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase mt-0.5">
                        {course.meta || "Specialization Track"}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Start: {course.courseStartDate ? new Date(course.courseStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "Live Today"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 font-bold">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Column: Live Notifications Board */}
        <div className="space-y-4">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <Bell className="w-4 h-4 text-[#0066ff]" /> Live Notice Board
          </h3>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl flex gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h5 className="font-bold text-amber-900">Project Synopsis Deadline</h5>
                <p className="text-amber-700 mt-0.5 font-medium leading-normal">Please compile your team deployment structures and submit them before the deadline.</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h5 className="font-bold text-blue-900">Live Mentorship Session</h5>
                <p className="text-blue-700 mt-0.5 font-medium leading-normal">Next architecture and Git review meeting links will be posted inside Live Classes module.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LIVE AVAILABLE TRAINING CATALOG VIEW */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <ArrowRight className="w-4 h-4 text-emerald-500" /> Explore Available Specializations ({availableCourses.length})
        </h3>

        {availableCourses.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium pl-1">You are fully up-to-date with all catalog programs.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCourses.map((catalog) => (
              <div key={catalog._id} className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-slate-300 transition">
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
                  {enrollLoading === catalog._id ? (
                    "Processing..."
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Fast Enroll Track
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}