import { Clock, CheckCircle, QrCode, Users, FileText, Search, Briefcase, Award } from 'lucide-react';

export default function Hero() {
  const inlineFeatures = [
    { icon: <Clock className="w-5 h-5 text-blue-600" />, label: "120 Hours Internship", bg: "bg-blue-50" },
    { icon: <CheckCircle className="w-5 h-5 text-orange-500" />, label: "AICTE & UGC Compliant", bg: "bg-orange-50" },
    { icon: <QrCode className="w-5 h-5 text-emerald-600" />, label: "Digital Cert. with QR", bg: "bg-emerald-50" },
    { icon: <Users className="w-5 h-5 text-indigo-600" />, label: "Placement Support", bg: "bg-indigo-50" },
    { icon: <FileText className="w-5 h-5 text-rose-500" />, label: "Industry Projects", bg: "bg-rose-50" },
  ];

  const floatingStats = [
    { icon: <Users className="w-5 h-5 text-blue-600" />, num: "50,000+", desc: "Students Trained" },
    { icon: <Briefcase className="w-5 h-5 text-amber-500" />, num: "100+", desc: "Partner Colleges" },
    { icon: <Award className="w-5 h-5 text-orange-500" />, num: "25,000+", desc: "Certificates Issued" },
    { icon: <Clock className="w-5 h-5 text-indigo-500" />, num: "120 Hours", desc: "Internship Program" },
    { icon: <QrCode className="w-5 h-5 text-emerald-500" />, num: "QR Verified", desc: "Certificates" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-50/30 via-white to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Side */}
          <div className="lg:col-span-6 z-10">
            <div className="flex flex-wrap gap-3 mb-6 items-center text-[11px] font-bold tracking-wide uppercase text-slate-600">
              <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-md border border-amber-200/60">🏅 AICTE Compliant</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md border border-emerald-200/60">🛡️ UGC Compliant</span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md">NEP 2020 Aligned</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Bihar's Largest <br />
              <span className="text-[#0066ff]">Internship Platform</span>
            </h1>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6">
              for <span className="text-[#ff9900]">Engineering</span> & <span className="text-emerald-600">UGC Students</span>
            </h2>

            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-xl">
              Industry-oriented internship programs for B.Tech, Diploma, B.A, B.Com, B.Sc & BCA students with <span className="text-[#0066ff] font-semibold underline decoration-2 decoration-blue-200">verified certificates</span> recognized by top universities.
            </p>

            {/* Core Badges Row */}
            <div className="grid grid-cols-5 gap-2 mb-10 text-center max-w-lg">
              {inlineFeatures.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-11 h-11 ${item.bg} rounded-full flex items-center justify-center mb-2 shadow-sm`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 leading-tight px-1">{item.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Elements */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#0066ff] hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-md shadow-lg shadow-blue-200 flex items-center gap-2 transition transform hover:-translate-y-0.5">
                🚀 Start Your Internship →
              </button>
              <button className="border-2 border-blue-200 hover:border-blue-600 text-[#0066ff] font-bold text-sm px-6 py-3.5 rounded-md flex items-center gap-2 bg-white transition">
                <Search className="w-4 h-4" /> Verify Certificate
              </button>
            </div>
          </div>

          {/* Right Visual Frame Side */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-xl lg:max-w-none">
              
              <div className="rounded-2xl overflow-hidden bg-slate-100 shadow-xl border-4 border-white aspect-[4/3] relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                  alt="Students working together" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent mix-blend-multiply" />
              </div>

              {/* Stacked Interactive Badges Right */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20 w-52 sm:w-60">
                {floatingStats.map((stat, idx) => (
                  <div key={idx} className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 transform hover:scale-105 transition duration-300">
                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 leading-none mb-0.5">{stat.num}</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-none">{stat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute -bottom-6 -left-6 -z-10 w-44 h-44 bg-blue-600 rounded-full blur-3xl opacity-20" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}