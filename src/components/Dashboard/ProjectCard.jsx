// frontend/src/components/Dashboard/ProjectCard.jsx
import React from 'react';

const ProjectCard = ({ project, onClick, onDelete }) => {
  const memberCount = project.members?.length || 0;
  const isOwner = project.owner?._id === project.owner?.id;

  const colorMap = {
    '#3B82F6': 'from-blue-500/10 to-blue-500/5',
    '#10B981': 'from-emerald-500/10 to-emerald-500/5',
    '#F59E0B': 'from-amber-500/10 to-amber-500/5',
    '#EF4444': 'from-red-500/10 to-red-500/5',
    '#8B5CF6': 'from-violet-500/10 to-violet-500/5',
    '#EC4899': 'from-pink-500/10 to-pink-500/5',
  };

  const accentMap = {
    '#3B82F6': 'bg-blue-500',
    '#10B981': 'bg-emerald-500',
    '#F59E0B': 'bg-amber-500',
    '#EF4444': 'bg-red-500',
    '#8B5CF6': 'bg-violet-500',
    '#EC4899': 'bg-pink-500',
  };

  const cardGradient = colorMap[project.color] || colorMap['#3B82F6'];
  const accentColor = accentMap[project.color] || accentMap['#3B82F6'];

  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-800 rounded-2xl shadow-xl shadow-black/20 border border-slate-700 hover:border-slate-500 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${cardGradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Card Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${accentColor} bg-opacity-20 flex items-center justify-center border border-${accentColor.replace('bg-', '')}/30`}>
             <div className={`w-6 h-6 rounded-md ${accentColor}`} />
          </div>
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Title & Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 font-display">
            {project.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2">
            {project.description || 'No description provided.'}
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase ${
            project.status === 'active'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-slate-700/50 text-slate-400 border border-slate-600'
          }`}>
            {project.status === 'active' ? 'Active' : 'Archived'}
          </span>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {project.members?.slice(0, 2).map((member, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-semibold text-white shadow-sm"
                  title={member.name}
                >
                  {member.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              ))}
              {memberCount > 2 && (
                <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-400 shadow-sm">
                  +{memberCount - 2}
                </div>
              )}
              {memberCount === 0 && (
                <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-500 shadow-sm">
                  0
                </div>
              )}
            </div>
            <span className="font-medium">{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
          </div>
          <div className={`text-slate-500 group-hover:text-${accentColor.replace('bg-', '')} transition-colors transform group-hover:translate-x-1 duration-200`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
