// frontend/src/components/Tasks/TaskCard.jsx
import React, { useState } from 'react';

const TaskCard = ({ task, onDragStart, onDelete, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);

  const priorityConfig = {
    low: { color: 'bg-blue-900/30 border-blue-500/30', textColor: 'text-blue-400', label: 'Low' },
    medium: { color: 'bg-amber-900/30 border-amber-500/30', textColor: 'text-amber-400', label: 'Medium' },
    high: { color: 'bg-red-900/30 border-red-500/30', textColor: 'text-red-400', label: 'High' }
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="group bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-5 cursor-move transition-all duration-200 hover:border-primary-500/50 hover:shadow-primary-500/10 transform hover:-translate-y-0.5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <h4 className="font-semibold text-white flex-1 line-clamp-2 text-sm leading-snug">
          {task.title}
        </h4>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-slate-800 rounded-xl shadow-xl shadow-black/50 border border-slate-700 overflow-hidden z-10 animate-fadeIn">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete();
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
              >
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <span className={`${priority.color} ${priority.textColor} border px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider`}>
          {priority.label}
        </span>
        {task.assignee && (
          <div
            className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300 shadow-inner"
            title={task.assignee.name}
          >
            {task.assignee.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-1.5 text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-[11px] font-medium uppercase tracking-wide">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
