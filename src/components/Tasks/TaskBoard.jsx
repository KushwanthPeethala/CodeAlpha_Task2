// frontend/src/components/Tasks/TaskBoard.jsx
import React, { useState } from 'react';
import TaskCard from './TaskCard';

const TaskBoard = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const statuses = [
    { key: 'todo', label: 'To Do', color: 'bg-slate-800/50 border-slate-700', iconColor: 'text-slate-400', icon: '📋' },
    { key: 'inProgress', label: 'In Progress', color: 'bg-blue-900/20 border-blue-900/50', iconColor: 'text-blue-400', icon: '⚡' },
    { key: 'done', label: 'Done', color: 'bg-emerald-900/20 border-emerald-900/50', iconColor: 'text-emerald-400', icon: '✓' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(t => t.status === status);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask) {
      onTaskUpdate(draggedTask._id, { status: newStatus });
      setDraggedTask(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statuses.map(status => (
        <div
          key={status.key}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status.key)}
          className={`bg-slate-800/40 rounded-2xl border ${status.color} overflow-hidden flex flex-col h-[calc(100vh-16rem)]`}
        >
          {/* Column Header */}
          <div className="px-5 py-4 border-b border-slate-700/50 bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-lg ${status.iconColor}`}>{status.icon}</span>
                <h3 className="font-semibold text-white tracking-wide">{status.label}</h3>
              </div>
              <span className="bg-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300 shadow-inner">
                {getTasksByStatus(status.key).length}
              </span>
            </div>
          </div>

          {/* Tasks */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto min-h-[200px]">
            {getTasksByStatus(status.key).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500 border-2 border-dashed border-slate-700/50 rounded-xl">
                <p className="text-sm font-medium">Drop tasks here</p>
              </div>
            ) : (
              getTasksByStatus(status.key).map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDragStart={handleDragStart}
                  onDelete={() => onTaskDelete(task._id)}
                  onUpdate={onTaskUpdate}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
