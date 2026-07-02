import { useState, useEffect } from 'react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

export default function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Safely parsing nested JSON strings from Local Storage
    const tokenExists = !!localStorage.getItem('token');
    const isAdminUser = localStorage.getItem('isAdmin') === 'true';

    if (tokenExists) {
      if (isAdminUser) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
      return;
    }
    
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  }, [navigate]);

  const [formData, setFormData] = useState({
    emailAddress: '',
    password: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      const response = await apiService.loginUser(formData.emailAddress, formData.password);
      
      if (response && response.success === true && response.user) {
        // 1. Core storage variables setting
        localStorage.setItem("token", response.token);
        
        // Storing full structured stringified object profile
        localStorage.setItem("userData", JSON.stringify(response.user)); 
        
        // Ensure it saves absolute boolean strings 'true' or 'false'
        localStorage.setItem("isAdmin", response.user.isAdmin ? "true" : "false"); 

        // 2. Trigger parent routing state update instantly
        setIsAuthenticated(true);

        setStatusMsg({ success: true, text: "🎉 Secure Authentication Successful! Redirecting..." });
        
        setTimeout(() => {
          // Check the value inside the nested 'user' node object directly
          if (response.user.isAdmin === true || response.user.isAdmin === "true") {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }, 800);
      } else {
        setStatusMsg({ success: false, text: "❌ Authentication response mapping dropped." });
      }
    } catch (error) {
      setStatusMsg({ success: false, text: "❌ " + (error.message || "Invalid email or password") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 py-16 min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center font-sans antialiased text-slate-800">
      <div className="w-full max-w-4xl px-4">
        
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="w-12 h-12 bg-[#0066ff] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-blue-200 mb-3">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Student & Admin Login</h3>
            <p className="text-slate-500 text-xs mt-1">Access your verified industrial internship workplace panel</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required 
                  type="email" 
                  name="emailAddress" 
                  value={formData.emailAddress} 
                  onChange={handleInputChange} 
                  placeholder="name@college.edu" 
                  className="w-full text-sm pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff] transition" 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Password *</label>
                <a href="#" className="text-xs text-[#0066ff] font-semibold hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  required 
                  type={showPass ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  placeholder="••••••••" 
                  className="w-full text-sm pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0066ff] transition" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 select-none cursor-pointer p-0.5">
              <input type="checkbox" className="accent-[#0066ff] rounded h-3.5 w-3.5" />
              <span className="text-xs text-slate-500 font-medium">Keep me logged in on this device</span>
            </label>

            {statusMsg && (
              <div className={`p-3 rounded-lg text-xs font-bold text-center ${statusMsg.success ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {statusMsg.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={submitting} 
              className="w-full bg-[#0066ff] hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-sm transition disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                "Sign In to Workspace"
              )}
            </button>

            <div className="text-center pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">
                New to the platform?{' '}
                <button type="button" onClick={() => navigate('/register')} className="text-[#0066ff] font-bold hover:underline bg-transparent border-none cursor-pointer">
                  Create an account here
                </button>
              </span>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}