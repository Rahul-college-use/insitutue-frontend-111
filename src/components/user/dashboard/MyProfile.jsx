import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Phone, Heart, GraduationCap, ShieldCheck 
} from 'lucide-react';
import { apiService } from '../../../services/api';

export default function MyProfile({ user: propUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      return;
    }

    const profileData = async () => {
      try {
        const response = await apiService.getStoredUser();
        if (response?.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Failed to load profile component:", error);
      }
    };
    profileData();
  }, [propUser]);

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[200px] font-sans">
        <div className="text-slate-400 font-medium text-sm animate-pulse">
          Loading personal profile registry...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar font-sans antialiased text-slate-800">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-black text-slate-900 tracking-tight">
          My Account Profile
        </h4>
      </div>

      {/* Main Identity Banner Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-blue-50 text-[#0066ff] rounded-full flex items-center justify-center border-4 border-blue-100/40 shadow-sm shrink-0">
            <User className="w-10 h-10" />
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-black text-slate-900">
              {user.fullName}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
              <span className="text-[10px] font-bold text-[#0066ff] bg-blue-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                ID: {user.studentId || "PENDING VERIFICATION"}
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md uppercase">
                {user.gender}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Status Tag */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-left">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registration Status</span>
            <span className={`text-xs font-black flex items-center gap-1.5 mt-0.5 ${
              user.registrationStatus === 'Approved' ? 'text-emerald-600' : 
              user.registrationStatus === 'Rejected' ? 'text-rose-600' : 'text-amber-500'
            }`}>
              <ShieldCheck className="w-4 h-4 shrink-0" /> {user.registrationStatus || "Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Personal & Contact Information */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Mail className="w-3.5 h-3.5" /> Contact Details
          </h3>
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Email Address</span>
              <span className="font-bold text-slate-800 break-all">{user.emailAddress}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Phone Number</span>
              <span className="font-bold text-slate-800">📞 {user.contactNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Father / Parent Name</span>
              <span className="font-bold text-slate-800">{user.parentName}</span>
            </div>
          </div>
        </div>

        {/* 2. Academic Information */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Academic Registry
          </h3>
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">University / College Node</span>
              {/* ✅ DYNAMIC: Directly use name parameters if stored, otherwise fallback to standard uppercase IDs */}
              <span className="font-bold text-slate-800 leading-tight block mt-0.5">
                {user.collegeName || user.collegeId?.toUpperCase()}
                <span className="text-slate-400 text-xs font-normal block mt-0.5">
                  ({user.universityName || user.universityId?.toUpperCase()})
                </span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Department</span>
                <span className="font-bold text-slate-800">{user.departmentName || user.department?.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Current Semester</span>
                <span className="font-bold text-slate-800">{user.semester}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">University Roll</span>
                <span className="font-mono font-bold text-slate-700 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded w-max mt-0.5 block">
                  {user.universityRoll}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Registration No.</span>
                <span className="font-mono font-bold text-slate-700 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded w-max mt-0.5 block">
                  {user.universityReg}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Emergency Contact Protocol */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Heart className="w-3.5 h-3.5 text-red-500" /> Emergency Protocol
          </h3>
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Emergency Contact Name</span>
              <span className="font-bold text-slate-800">{user.emergencyName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Relationship Tier</span>
              <span className="font-bold text-slate-800 bg-rose-50 text-rose-600 border border-rose-100/50 px-2 py-0.5 rounded-md w-max mt-0.5 block">
                {user.relationship}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Emergency Hotline Phone</span>
              <span className="font-bold text-[#ff3300] flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 shrink-0" /> {user.emergencyPhone}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}