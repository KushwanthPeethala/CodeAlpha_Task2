// frontend/src/components/Projects/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../../services/api';
import { joinProject, onTaskCreated, onTaskUpdated, onTaskDeleted } from '../../services/socket';
import Navbar from '../Common/Navbar';
import TaskBoard from '../Tasks/TaskBoard';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    joinProject(projectId);
    fetchProject();
    fetchTasks();

    // Real-time listeners
    const handleTaskCreated = (taskData) => {
      if (taskData.projectId === projectId) {
        setTasks(prev => [...prev, taskData]);
      }
    };

    const handleTaskUpdated = (taskData) => {
      setTasks(prev =>
        prev.map(t => t._id === taskData._id ? taskData : t)
      );
    };

    const handleTaskDeleted = (taskId) => {
      setTasks(prev => prev.filter(t => t._id !== taskId));
    };

    onTaskCreated(handleTaskCreated);
    onTaskUpdated(handleTaskUpdated);
    onTaskDeleted(handleTaskDeleted);

    return () => {
      // Cleanup listeners
    };
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.get(projectId);
      setProject(response.data.project);
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll(projectId);
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) return;

    try {
      await tasksAPI.create({
        ...newTaskData,
        projectId
      });
      setNewTaskData({ title: '', description: '', priority: 'medium' });
      setShowAddTask(false);
      await fetchTasks();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await tasksAPI.update(taskId, updates);
      await fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  if (!project && !loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-slate-400 mb-4">Project not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-400 hover:text-primary-300 font-medium bg-slate-800 px-4 py-2 rounded-lg"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {/* Project Header */}
      <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white font-display tracking-tight">
                  {project?.name || 'Loading Project...'}
                </h1>
                <p className="text-sm text-slate-400 mt-1">{project?.description}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/20 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center justify-between">
            {error}
            <button onClick={() => setError('')} className="hover:text-red-300">✕</button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          </div>
        ) : (
          <TaskBoard
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        )}
      </main>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full animate-slideUp p-6">
            <h2 className="text-2xl font-bold text-white font-display mb-4">New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                  placeholder="Task title"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                  placeholder="Task description"
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                <select
                  value={newTaskData.priority}
                  onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 px-4 py-3 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
