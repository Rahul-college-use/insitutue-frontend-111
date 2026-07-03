import React, { useEffect, useState } from 'react';
import { Award, Briefcase, Calendar, CheckCircle2, UserCheck, Clock, Loader, AlertCircle } from 'lucide-react';
import { apiService } from '../../../services/api';

export default function MyInternship() {
  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternshipTrack = async () => {
      try {
        setLoading(true);
        const response = await apiService.getStoredUser();
        
        const userData = response?.user || response;
        
        if (userData?.enrolledCourses) {
          if (Array.isArray(userData.enrolledCourses) && userData.enrolledCourses.length > 0) {
            setActiveCourse(userData.enrolledCourses[0]);
          } else if (typeof userData.enrolledCourses === 'object' && userData.enrolledCourses !== null) {
            setActiveCourse(userData.enrolledCourses);
          }
        }
      } catch (error) {
        console.error("Error pulling active internship track:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternshipTrack();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center space-y-2 px-4">
          <Loader className="w-8 h-8 text-[#0066ff] animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-medium">Loading internship configurations...</p>
        </div>
      </div>
    );
  }

  if (!activeCourse) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-xl mx-auto text-center mt-12 space-y-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-100">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-900">No Active Internship Registered</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your profile is unlinked to an active engineering batch track. Please head to the marketplace catalog view to purchase and unlock your specific corporate technical assignment hub.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-4xl mx-auto">
      <h4 className="text-xl font-black text-slate-900 tracking-tight">My Internship Details</h4>

      {/* Main Internship Details Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block">
              {activeCourse.cert || "Verified Certification"}
            </span>
            <h3 className="text-lg font-black text-slate-900 pt-1 leading-snug">{activeCourse.courseName}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide pt-0.5">{activeCourse.meta}</p>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>

        {/* Clean Description Block */}
        <div className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Program Overview</span>
          {activeCourse.description}
        </div>

        <hr className="border-slate-100" />

        {/* Details Metadata Tracker Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/60 border border-slate-100">
            <UserCheck className="w-5 h-5 text-indigo-500 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Assigned Guide</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">Industrial Mentor Team</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/60 border border-slate-100">
            <Clock className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Compensation Model</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">Unpaid / Experience Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}