// frontend/src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI } from '../../services/api';
import { initSocket, joinProject, onTaskCreated, onTaskUpdated } from '../../services/socket';
import Navbar from '../Common/Navbar';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initSocket();
    fetchProjects();

    // Real-time updates
    const handleTaskCreated = (taskData) => {
      console.log('Task created:', taskData);
    };

    const handleTaskUpdated = (taskData) => {
      console.log('Task updated:', taskData);
    };

    onTaskCreated(handleTaskCreated);
    onTaskUpdated(handleTaskUpdated);

    return () => {
      // Cleanup listeners
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsAPI.getAll();
      setProjects(response.data.projects || []);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = async () => {
    await fetchProjects();
    setShowCreateModal(false);
  };

  const handleProjectClick = (projectId) => {
    joinProject(projectId);
    navigate(`/project/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Delete this project?')) {
      try {
        await projectsAPI.delete(projectId);
        setProjects(prev => prev.filter(p => p._id !== projectId));
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 relative">
        {/* Header */}
        <div className="mb-12 animate-slideUp flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 font-display tracking-tight">
              Projects
            </h1>
            <p className="text-slate-400">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} • Manage your work
            </p>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/20 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 text-sm animate-slideUp flex items-center justify-between">
            {error}
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-48 bg-slate-800/50 rounded-2xl border border-slate-700/50 animate-pulse"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50 border-dashed">
            <div className="mb-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-slate-700">
                <svg
                  className="w-8 h-8 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 mb-6">No projects yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium bg-primary-500/10 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div
                key={project._id}
                style={{ animationDelay: `${idx * 50}ms` }}
                className="animate-slideUp"
              >
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectClick(project._id)}
                  onDelete={() => handleDeleteProject(project._id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
