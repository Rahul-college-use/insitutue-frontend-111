export default function StatCard({ title, value, subtext, icon, statusColor, actionIcon }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-slate-50 text-slate-700`}>
          {icon}
        </div>
        <div>
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
          <span className="block text-xl font-black text-slate-950 mt-1">{value}</span>
          <span className="block text-xs text-slate-400 font-medium mt-0.5">{subtext}</span>
        </div>
      </div>
      {actionIcon && (
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${statusColor || 'text-slate-300'}`}>
          {actionIcon}
        </div>
      )}
    </div>
  );
}