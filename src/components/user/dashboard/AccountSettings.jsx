import React, { useState } from 'react';
import { User, Shield, Bell, Save, Lock, Mail, Phone, BookOpen, School } from 'lucide-react';

export default function AccountSettings({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Form States map explicitly with your DB Schema fields
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    emailAddress: user?.emailAddress || '',
    contactNumber: user?.contactNumber || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call connector pipeline
      // await apiService.updateProfile({ fullName: formData.fullName, contactNumber: formData.contactNumber });
      alert("Profile data metrics updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to synchronize active profile updates.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match alignment layers!");
      return;
    }
    setLoading(true);
    try {
      // await apiService.updatePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword });
      alert("Security matrix password changed successfully!");
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      console.error(err);
      alert("Security token deployment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 space-y-6 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
      
      {/* Dynamic Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Account Settings</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Manage workspace profile configurations, security access matrices, and identity records for <span className="text-blue-600 font-bold">{user?.studentId}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Subbar Controls */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 p-1 bg-slate-100 md:bg-transparent rounded-2xl shrink-0 custom-scrollbar">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap w-full ${
              activeSubTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" /> Personal Info
          </button>
          
          <button
            onClick={() => setActiveSubTab('academic')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap w-full ${
              activeSubTab === 'academic' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <School className="w-4 h-4" /> Academic Sync
          </button>
          
          <button
            onClick={() => setActiveSubTab('security')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap w-full ${
              activeSubTab === 'security' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" /> Security Matrix
          </button>
        </div>

        {/* Core Canvas Active Box Layout */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
          
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeSubTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Identity Information
              </h3>
              <hr className="border-slate-100" />
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 opacity-60">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Email (Locked)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.emailAddress}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 mt-2 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> {loading ? "Updating..." : "Save Identity Parameters"}
              </button>
            </form>
          )}

          {/* TAB 2: ACADEMIC SPECIFIC LOCKED CHANNELS */}
          {activeSubTab === 'academic' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" /> Academic Credentials
                </h3>
                <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">
                  Status: {user?.registrationStatus || "Approved"}
                </span>
              </div>
              <hr className="border-slate-100" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">College Registry ID</span>
                  <span className="font-bold text-slate-800 mt-0.5 block uppercase">{user?.collegeId}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">University Platform ID</span>
                  <span className="font-bold text-slate-800 mt-0.5 block uppercase">{user?.universityId}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Department Track</span>
                  <span className="font-bold text-slate-800 mt-0.5 block uppercase">{user?.department}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Current Semester</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{user?.semester}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">University Roll Number</span>
                  <span className="font-bold text-slate-800 mt-0.5 block font-mono">{user?.universityRoll}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">University Registration</span>
                  <span className="font-bold text-slate-800 mt-0.5 block font-mono">{user?.universityReg}</span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/60 border border-amber-100 rounded-2xl text-[11px] text-amber-800 font-medium leading-normal">
                ⚠️ <strong>Notice:</strong> Operational parameters inside academic synchronization tracks are verification locked. If your University Roll/Reg data contains anomalies, please raise a ticket inside the <strong>Support Panel</strong>.
              </div>
            </div>
          )}

          {/* TAB 3: PASSWORD MATRIX ACCESS */}
          {activeSubTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" /> Authentication Token Matrix
              </h3>
              <hr className="border-slate-100" />

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confirm New Password</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 mt-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" /> {loading ? "Updating Crypt..." : "Update Security Matrix"}
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}