import React from 'react';
import { Layers } from 'lucide-react';

export default function WorkshopsList({ 
  coursesList, 
  activeSubView, 
  selectedCourseId, 
  routeToCourseWorkshop, 
  isSidebarCollapsed = false 
}) {
  return (
    <div className="space-y-1">
      {!isSidebarCollapsed && (
        <span className="block text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2.5 px-2">
          WORKSHOPS
        </span>
      )}
      
      {coursesList.map((course) => {
        const isActive = activeSubView === 'course-workshop-desk' && selectedCourseId === course._id;
        
        return (
          <button
            key={course._id}
            onClick={() => routeToCourseWorkshop(course._id)}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
              isActive 
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black border border-zinc-400 dark:border-zinc-200 font-black shadow-sm' 
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/40 dark:hover:bg-zinc-900/30 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Layers className="w-4 h-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
              {!isSidebarCollapsed && <span className="truncate">{course.courseName}</span>}
            </div>
            
            {!isSidebarCollapsed && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-900 text-zinc-500 rounded border border-zinc-300/40 dark:border-zinc-800/40 shrink-0">
                {course.code || "LIVE"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}