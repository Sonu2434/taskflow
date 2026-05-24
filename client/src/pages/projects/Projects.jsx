import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Search, FolderKanban, Trash2, Pencil, Users, Calendar, ArrowRight } from 'lucide-react';
import { fetchProjects, createProject, updateProject, deleteProject } from '../../redux/slices/projectSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ProjectForm from '../../components/forms/ProjectForm';
import EmptyState from '../../components/common/EmptyState';
import ProgressBar from '../../components/common/ProgressBar';
import { CardSkeleton } from '../../components/common/Skeleton';
import { AvatarGroup } from '../../components/common/Avatar';
import { formatDate } from '../../utils/helpers';

const Projects = () => {
  const dispatch = useDispatch();
  const { items: projects, loading } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);
  const isAdmin = user?.role === 'admin';

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    dispatch(fetchProjects({ limit: 100 }));
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? p.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const handleCreate = async (data) => {
    setSubmitting(true);
    const result = await dispatch(createProject(data));
    setSubmitting(false);
    if (!result.error) setShowCreate(false);
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    const result = await dispatch(updateProject({ id: editTarget._id, data }));
    setSubmitting(false);
    if (!result.error) setEditTarget(null);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    await dispatch(deleteProject(deleteTarget._id));
    setSubmitting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FolderKanban size={22} className="text-blue-400" />
            Projects
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{projects.length} total projects</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={15} /> New Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-10" placeholder="Search projects..." />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="select-field sm:w-44">
          <option value="">All Statuses</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects found"
          description="Create your first project to get started"
          action={isAdmin ? (
            <button onClick={() => setShowCreate(true)} className="btn-primary">
              <Plus size={15} /> Create Project
            </button>
          ) : null} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => (
            <div key={project._id} className="glass-card group flex flex-col">
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 mr-2">
                  <h3 className="font-semibold text-white truncate mb-1">{project.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{project.description || 'No description'}</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => setEditTarget(project)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteTarget(project)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <StatusBadge status={project.status} />
                <PriorityBadge priority={project.priority} />
              </div>

              {/* Progress */}
              <div className="mb-4">
                <ProgressBar value={project.progress || 0} size="sm" />
              </div>

              {/* Meta */}
              <div className="mt-auto space-y-2.5">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Users size={12} />
                    <span>{project.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>{project.taskCount || 0} tasks</span>
                  </div>
                </div>
                {project.deadline && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Calendar size={12} />
                    <span>Due {formatDate(project.deadline)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <AvatarGroup users={project.members || []} max={4} size="xs" />
                  <Link to={`/projects/${project._id}`}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Open <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project">
        <ProjectForm onSubmit={handleCreate} loading={submitting} />
      </Modal>
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Project">
        <ProjectForm onSubmit={handleUpdate} initial={editTarget || {}} loading={submitting} />
      </Modal>
      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={submitting}
        message={`Delete "${deleteTarget?.title}" and all its tasks? This cannot be undone.`}
      />
    </div>
  );
};

export default Projects;
