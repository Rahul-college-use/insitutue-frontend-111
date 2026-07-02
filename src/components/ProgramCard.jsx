import * as LucideIcons from 'lucide-react';

export default function ProgramCard({ title, meta, cert, iconName, borderColor }) {
  // Dynamically look up the Lucide icon element based on the string sent by backend/mock
  const IconComponent = LucideIcons[iconName] || LucideIcons.HelpCircle;

  return (
    <div className={`bg-white p-5 rounded-xl border ${borderColor} shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center text-center group cursor-pointer`}>
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
        <IconComponent className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition" />
      </div>
      <h4 className="font-extrabold text-sm text-slate-900 mb-1">{title}</h4>
      <p className="text-[11px] text-slate-400 font-medium mb-3">{meta}</p>
      <span className="mt-auto text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
        {cert}
      </span>
    </div>
  );
}