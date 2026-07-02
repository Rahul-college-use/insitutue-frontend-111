import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Component layout imports from one directory level up
import Hero from '../components/Hero';
import Features from '../components/Features';
import ProgramCard from '../components/ProgramCard';

// API service interface connection point 
import { apiService } from '../services/api';

export default function Home({ setIsAuthenticated }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    // ✅ FIXED: Using the clean centralized key format for strict role definitions
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

  // State management for dynamic program tracks rendering
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Poll service module upon DOM activation mount
  useEffect(() => {
    let isMounted = true;
    const fetchProgramsData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPrograms();
        if (isMounted) {
          setPrograms(data || []);
        }
      } catch (err) {
        console.error("Error fetching programs array:", err);
        if (isMounted) {
          setError("Failed to load available internship program tracks.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProgramsData();
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      {/* Visual Header Display Banners */}
      <Hero />

      {/* Platform Core Features Grid */}
      <Features />

      {/* Premium Program Track Section */}
      <section className="relative overflow-hidden bg-[#0b1329] py-24 border-t border-slate-800">

        {/* PREMIUM BACKDROP INFRASTRUCTURE: Modern Ambient Mesh Blobs */}
        <div className="absolute top-0 left-1/4 -z-10 w-96 h-96 bg-blue-600 rounded-full blur-[140px] opacity-20 pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-1/4 -z-10 w-96 h-96 bg-orange-500 rounded-full blur-[140px] opacity-10 pointer-events-none" />

        {/* Premium Grid Dot Matrix Pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Typography Header Block */}
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0066ff] bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 backdrop-blur-md inline-block">
              Available Tracks
            </span>
            <h3 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
              Programs Designed for Every Student
            </h3>
            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Explore meticulously tailored engineering and general curriculum tracks aligned completely with global standard industrial parameters.
            </p>
          </div>

          {/* Dynamic Render States */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0066ff]" />
              <span className="text-xs text-slate-500 font-medium tracking-wider">Syncing live tracks...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 max-w-md mx-auto bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
              <p className="text-sm text-rose-400 font-semibold">{error}</p>
            </div>
          ) : (
            /* Premium Responsive Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {programs.map((prog) => (
                <div
                  key={prog.id || prog._id}
                  className="transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/5 rounded-xl group"
                >
                  <ProgramCard
                    title={prog.title || prog.courseName}
                    meta={prog.meta}
                    cert={prog.cert}
                    iconName={prog.iconName}
                    borderColor="border-slate-800 hover:border-blue-500/40"
                  />
                </div>
              ))}
            </div>
          )}

          {programs.length === 0 && !loading && !error && (
            <div className="text-center py-12 text-slate-500 text-xs font-bold">
              No industrial training programs published live yet.
            </div>
          )}

        </div>
      </section>
    </>
  );
}