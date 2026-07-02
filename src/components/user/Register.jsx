import { useState, useEffect } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register({ setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenExists = !!localStorage.getItem('token');
    if (tokenExists) {
      const isAdminUser = localStorage.getItem('isAdmin') === 'true';
      if (isAdminUser) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
      return;
    }
    window.scrollTo(0, 0);
  }, [navigate]);

  // Master Form State
  const [formData, setFormData] = useState({
    fullName: '', gender: 'Male', parentName: '', contactNumber: '', emailAddress: '',
    universityId: '', collegeId: '', degreeCategory: 'btech_diploma', department: '',
    semester: '1st Semester', session: '', universityRoll: '', universityReg: '',
    emergencyName: '', emergencyPhone: '', relationship: 'Father',
    password: '', confirmPassword: '', agreeTerms: false
  });

  // API Dropdown Option States
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Loading States
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // UI States
  const [showPass, setShowPass] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Load initial static values (Universities)
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      setLoadingUniversities(true);
      try {
        const univs = await apiService.getUniversities();
        if (isMounted) setUniversities(univs || []);
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        if (isMounted) setLoadingUniversities(false);
      }
    };
    loadInitialData();
    return () => { isMounted = false; };
  }, []);

  // Cascading Rule: Refetch Colleges when University OR Degree Category updates
  useEffect(() => {
    let isMounted = true;
    const syncColleges = async () => {
      if (!formData.universityId || !formData.degreeCategory) {
        if (isMounted) setColleges([]);
        return;
      }
      setLoadingColleges(true);
      try {
        const list = await apiService.getFilteredColleges(formData.universityId, formData.degreeCategory);
        console.log(list)
        if (isMounted) {
          setColleges(list || []);
          setFormData(prev => ({ ...prev, collegeId: '' }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingColleges(false);
      }
    };
    syncColleges();
    return () => { isMounted = false; };
  }, [formData.universityId, formData.degreeCategory]);

  // Sync Departments when Category Updates
  useEffect(() => {
    let isMounted = true;
    const syncDepts = async () => {
      try {
        const list = await apiService.getDepartmentsByCategory(formData.degreeCategory);
        if (isMounted) {
          setDepartments(list || []);
          setFormData(prev => ({ ...prev, department: '' }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    syncDepts();
    return () => { isMounted = false; };
  }, [formData.degreeCategory]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setStatusMsg({ success: false, text: "❌ Passwords do not match!" });
      return;
    }
    if (!formData.agreeTerms) {
      setStatusMsg({ success: false, text: "⚠️ You must agree to the terms and conditions." });
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);
    try {
      const orderData = await apiService.registerUser(formData);

      if (orderData && orderData.success === true) {
        // ✅ FIXED: Storing the tokens explicitly into storage arrays before layout triggers
        localStorage.setItem("token", orderData.token);
        localStorage.setItem("userData", JSON.stringify(orderData.user));
        localStorage.setItem("isAdmin", "false"); // Registers default as student context

        // Trigger safe reactive parent auth state updates
        setIsAuthenticated(true);

        setStatusMsg({ success: true, text: "🎉 Account initialized successfully! Redirecting to workspace..." });
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1200);
      } else {
        setStatusMsg({ success: false, text: `Registration failed: ${orderData.message || "Unknown error"}` });
      }
    } catch (err) {
      setStatusMsg({ success: false, text: "❌ Registration pipeline dropped. Connection failure." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 py-12 min-h-screen flex flex-col justify-center items-center font-sans antialiased text-slate-800">
      <div className="w-full max-w-4xl px-4">

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Student Registration</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Complete your registration for UGC-mandated internship program</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">

          {/* SECTION 1: PERSONAL INFO */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-md space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0066ff] flex items-center justify-center text-xs font-black">1</span>
              Personal Information
            </h4>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Full Name *</label>
              <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full name as per records" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff] transition" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0066ff]">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Parent/Guardian Name *</label>
                <input required type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} placeholder="Enter parent or guardian name" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Contact Number *</label>
                <input required type="tel" name="contactNumber" minLength={10} maxLength={10} value={formData.contactNumber} onChange={handleInputChange} placeholder="Your phone number" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff]" />
                <span className="text-[10px] text-slate-400 mt-1 block">10-digit mobile number</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Email Address *</label>
                <input required type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} placeholder="Your email address" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff]" />
              </div>
            </div>
          </div>

          {/* SECTION 2: ACADEMIC INFO */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-md space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0066ff] flex items-center justify-center text-xs font-black">2</span>
              Academic Information
            </h4>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">University Name *</label>
              <div className="relative">
                <select required name="universityId" value={formData.universityId} onChange={handleInputChange} className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0066ff]">
                  <option value="">Select your university</option>
                  {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                {loadingUniversities && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-blue-600" />}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">Degree Category Selection *</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`border p-3 rounded-lg flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold transition ${formData.degreeCategory === 'btech_diploma' ? 'border-[#0066ff] bg-blue-50/50 text-[#0066ff]' : 'border-slate-200 text-slate-600'}`}>
                  <input type="radio" name="degreeCategory" value="btech_diploma" checked={formData.degreeCategory === 'btech_diploma'} onChange={handleInputChange} className="accent-[#0066ff]" />
                  B.Tech / Diploma
                </label>
                <label className={`border p-3 rounded-lg flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold transition ${formData.degreeCategory === 'ugc' ? 'border-[#0066ff] bg-blue-50/50 text-[#0066ff]' : 'border-slate-200 text-slate-600'}`}>
                  <input type="radio" name="degreeCategory" value="ugc" checked={formData.degreeCategory === 'ugc'} onChange={handleInputChange} className="accent-[#0066ff]" />
                  UGC (BCA / B.Sc / B.Com)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">College Name *</label>
              <div className="relative">
                <select required name="collegeId" value={formData.collegeId} onChange={handleInputChange} disabled={!formData.universityId} className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0066ff] disabled:bg-slate-50 disabled:text-slate-400">
                  <option value="">{!formData.universityId ? "Please select a university first" : "Select your college"}</option>
                  {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {loadingColleges && <Loader2 className="absolute right-8 top-3 w-4 h-4 animate-spin text-blue-600" />}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Degree *</label>
                <input type="text" name="degreeDisplay" value={formData.degreeCategory === 'btech_diploma' ? "Technical Degree" : "UGC General Degree"} disabled className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-semibold" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Department/Stream *</label>
                <select required name="department" value={formData.department} onChange={handleInputChange} className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0066ff]">
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Class/Semester *</label>
                <select name="semester" value={formData.semester} onChange={handleInputChange} className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0066ff]">
                  {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'].map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Academic Session *</label>
                <input required type="text" name="session" value={formData.session} onChange={handleInputChange} placeholder="e.g., 2023-2027" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">University Roll Number *</label>
                <input required type="text" name="universityRoll" value={formData.universityRoll} onChange={handleInputChange} placeholder="Enter university roll number" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">University Registration Number *</label>
                <input required type="text" name="universityReg" value={formData.universityReg} onChange={handleInputChange} placeholder="Enter registration number" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff]" />
              </div>
            </div>
          </div>

          {/* SECTION 3: EMERGENCY CONTACT */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-md space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0066ff] flex items-center justify-center text-xs font-black">3</span>
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Emergency Contact Name *</label>
                <input required type="text" name="emergencyName" value={formData.emergencyName} onChange={handleInputChange} placeholder="Name of contact" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Emergency Contact Number *</label>
                <input required type="tel" name="emergencyPhone" minLength={10} maxLength={10} value={formData.emergencyPhone} onChange={handleInputChange} placeholder="Emergency phone number" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff]" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Relationship with Emergency Contact *</label>
              <select name="relationship" value={formData.relationship} onChange={handleInputChange} className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0066ff]">
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
                <option value="Sibling">Sibling</option>
              </select>
            </div>
          </div>

          {/* SECTION 4: ACCOUNT SECURITY */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-md space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0066ff] flex items-center justify-center text-xs font-black">4</span>
              Account Security
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Password *</label>
                <div className="relative">
                  <input required type={showPass ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="Create strong password" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff]" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Minimum 8 characters</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Confirm Password *</label>
                <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your password" className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff]" />
              </div>
            </div>
          </div>

          <label className="flex items-start gap-2.5 select-none cursor-pointer p-1">
            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} className="mt-1 accent-[#0066ff] shrink-0" />
            <span className="text-[11px] sm:text-xs text-slate-500 leading-normal">
              I agree to the <a href="#" className="text-[#0066ff] underline">Terms of Service</a> and <a href="#" className="text-[#0066ff] underline">Privacy Policy</a>. I understand that the internship organization details, roll number verification, and other administrative fields will be managed by the platform administrators.
            </span>
          </label>

          {statusMsg && (
            <div className={`p-3.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 ${statusMsg.success ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {statusMsg.text}
            </div>
          )}

          <button type="submit" disabled={submitting} className="w-full bg-[#0066ff] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-sm transition disabled:opacity-40">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Application...
              </>
            ) : (
              "Complete Registration"
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400 font-medium">
              Already have an account? <button type="button" onClick={() => navigate('/login')} className="text-[#0066ff] font-bold hover:underline bg-transparent border-none cursor-pointer">Sign in here</button>
            </span>
          </div>

        </form>
      </div>
    </div>
  );
}