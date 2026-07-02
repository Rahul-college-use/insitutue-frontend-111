import { GraduationCap, MapPin, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs sm:text-sm border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer text-white">
            <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-900/50">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-black tracking-tight">
              Internship <span className="text-[#ff9900]">Place</span>
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            An AICTE & UGC compliant platform bridging the gap between institutional academic concepts and production-ready industry execution.
          </p>
          
          {/* Custom SVG Social Media Icons (Bypasses Lucide Completely to Prevent Vite Errors) */}
          <div className="flex items-center gap-3 pt-2">
            {/* Facebook */}
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-[#0066ff] hover:text-white transition group">
              <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-white" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-[#0066ff] hover:text-white transition group">
              <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-white" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-[#0066ff] hover:text-white transition group">
              <svg className="w-4 h-4 stroke-current fill-none text-slate-400 group-hover:text-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>

            {/* Linkedin */}
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-[#0066ff] hover:text-white transition group">
              <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-white" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Programs Column */}
        <div className="space-y-3">
          <h5 className="text-white font-bold tracking-wider uppercase text-xs">Internship Tracks</h5>
          <ul className="space-y-2 font-medium">
            <li><a href="#" className="hover:text-[#0066ff] transition">Computer Science & Engineering</a></li>
            <li><a href="#" className="hover:text-[#0066ff] transition">BCA Applications</a></li>
            <li><a href="#" className="hover:text-[#0066ff] transition">Electronics & Comm.</a></li>
            <li><a href="#" className="hover:text-[#0066ff] transition">Management & Commerce</a></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div className="space-y-3">
          <h5 className="text-white font-bold tracking-wider uppercase text-xs">Resources</h5>
          <ul className="space-y-2 font-medium">
            <li><a href="#" className="hover:text-[#0066ff] transition">Certificate Verification</a></li>
            <li><a href="#" className="hover:text-[#0066ff] transition">NEP 2020 Guidelines</a></li>
            <li><a href="#" className="hover:text-[#0066ff] transition">Partner Colleges</a></li>
            <li><a href="#" className="hover:text-[#0066ff] transition">Success Stories</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-3">
          <h5 className="text-white font-bold tracking-wider uppercase text-xs">Contact Desk</h5>
          <ul className="space-y-2.5 font-medium text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#0066ff] shrink-0 mt-0.5" />
              <span>Patna, Bihar, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0066ff] shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0066ff] shrink-0" />
              <span>support@internshipplace.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/60 py-6 text-center text-slate-500 font-medium px-4">
        <p>© {currentYear} Internship Place. All rights reserved by institutional administration frameworks.</p>
      </div>
    </footer>
  );
}