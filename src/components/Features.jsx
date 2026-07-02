import { Clock, CheckCircle, QrCode, Users, FileText, ArrowUpRight } from 'lucide-react';

export default function Features() {
  const featuresData = [
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "120 Hours Internship",
      description: "Comprehensive, self-paced learning paths and industry-aligned project timelines structured over 120 rigorous hours.",
      badge: "Flexible Time",
      bgColor: "bg-blue-50"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-orange-500" />,
      title: "AICTE & UGC Compliant",
      description: "Curriculum designed strictly in alignment with the National Education Policy (NEP 2020) and recognized academic mandates.",
      badge: "100% Certified",
      bgColor: "bg-orange-50"
    },
    {
      icon: <QrCode className="w-6 h-6 text-emerald-600" />,
      title: "Digital Certificate with QR",
      description: "Instantly verifiable blockchain-ready digital credentials equipped with unique tamper-proof QR verification codes.",
      badge: "Instant Share",
      bgColor: "bg-emerald-50"
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: "Placement Support",
      description: "Gain exclusive access to specialized mock interview toolkits, resume-building workshops, and direct hiring partner channels.",
      badge: "Career Ready",
      bgColor: "bg-indigo-50"
    },
    {
      icon: <FileText className="w-6 h-6 text-rose-500" />,
      title: "Industry Projects",
      description: "Work on live technical pipelines and real-world deployment case studies sourced from industry standard infrastructure.",
      badge: "Hands-on",
      bgColor: "bg-rose-50"
    }
  ];

  return (
    <section className="bg-white py-20 border-t border-slate-100 relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-1/2 right-0 -z-10 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <span className="text-[#0066ff] text-xs font-bold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
              Platform Benefits
            </span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-3 mb-2 sm:text-4xl">
              Why Thousands of Students Choose Our Platform
            </h3>
          </div>
          <p className="text-slate-500 text-sm md:max-w-xs font-medium leading-relaxed">
            Every program is engineered to bridge the gap between institutional learning and production-ready industry execution.
          </p>
        </div>

        {/* Features Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, idx) => (
            <div 
              key={idx} 
              className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-900/[0.02] transition-all duration-300 flex flex-col relative"
            >
              {/* Icon Frame */}
              <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                {feature.icon}
              </div>

              {/* Badges pinned right */}
              <span className="absolute top-6 right-6 text-[10px] font-bold tracking-wider uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md group-hover:bg-blue-50 group-hover:text-[#0066ff] transition-colors">
                {feature.badge}
              </span>

              {/* Text Fields */}
              <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-1">
                {feature.title}
              </h4>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Action Link at base card */}
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-xs font-bold text-[#0066ff] gap-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Explore Requirements</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}