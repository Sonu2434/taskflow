import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft, Plus, Pencil, Trash2, CheckSquare,
  Calendar, Users, Kanban, Clock
} from 'lucide-react';
import { fetchProject, updateProject, deleteProject, clearCurrentProject } from '../../redux/slices/projectSlice';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../redux/slices/taskSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ProjectForm from '../../components/forms/ProjectForm';
import TaskForm from '../../components/forms/TaskForm';
import EmptyState from '../../components/common/EmptyState';
import ProgressBar from '../../components/common/ProgressBar';
import Avatar, { AvatarGroup } from '../../components/common/Avatar';
import { CardSkeleton } from '../../components/common/Skeleton';
import { formatDate, isOverdue } from '../../utils/helpers';

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: project, loading } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);
  const isAdmin = user?.role === 'admin';

  const [showEdit, setShowEdit] = useState(false);
  const [showTaskCreate, setShowTaskCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState(null);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    dispatch(fetchProject(id));
    dispatch(fetchUsers());
    return () => dispatch(clearCurrentProject());
  }, [id, dispatch]);

  const tasks = project?.tasks || [];
  const filtered = filterStatus ? tasks.filter(t => t.status === filterStatus) : tasks;

  const handleUpdateProject = async (data) => {
    setSubmitting(true);
    const result = await dispatch(updateProject({ id, data }));
    setSubmitting(false);
    if (!result.error) { setShowEdit(false); dispatch(fetchProject(id)); }
  };

  const handleDeleteProject = async () => {
    setSubmitting(true);
    await dispatch(deleteProject(id));
    setSubmitting(false);
    navigate('/projects');
  };

  const handleCreateTask = async (data) => {
    setSubmitting(true);
    const result = await dispatch(createTask({ ...data, projectId: id }));
    setSubmitting(false);
    if (!result.error) { setShowTaskCreate(false); dispatch(fetchProject(id)); }
  };

  const handleUpdateTask = async (data) => {
    setSubmitting(true);
    const result = await dispatch(updateTask({ id: editTask._id, data }));
    setSubmitting(false);
    if (!result.error) { setEditTask(null); dispatch(fetchProject(id)); }
  };

  const handleDeleteTask = async () => {
    setSubmitting(true);
    await dispatch(deleteTask(deleteTaskTarget._id));
    setSubmitting(false);
    setDeleteTaskTarget(null);
    dispatch(fetchProject(id));
  };

  if (loading && !project) return (
    <div className="space-y-6">
      <div className="h-8 skeleton w-48 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );

  if (!project) return (
    <div className="text-center py-20 text-gray-500">Project not found.</div>
  );

  const statusColors = { planning: '#6b7280', active: '#4f8ef7', 'on-hold': '#f59e0b', completed: '#10b981' };

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <button onClick={() => navigate('/projects')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={15} /> Back to Projects
          </button>
          <h1 className="page-title">{project.title}</h1>
          {project.description && (
            <p className="text-gray-500 text-sm mt-1 max-w-2xl">{project.description}</p>
          )}
        </div>
        {isAdmin && (
          <div className="flex gap-2 flex-wrap">
            <Link to="/kanban" className="btn-secondary">
              <Kanban size={15} /> Kanban View
            </Link>
            <button onClick={() => setShowEdit(true)} className="btn-secondary">
              <Pencil size={15} /> Edit
            </button>
            <button onClick={() => setShowDeleteProject(true)} className="btn-danger">
              <Trash2 size={15} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <StatusBadge status={project.status} />
        </div>
        <div className="glass-card">
          <p className="text-xs text-gray-500 mb-1">Priority</p>
          <PriorityBadge priority={project.priority} />
        </div>
        <div className="glass-card">
          <p className="text-xs text-gray-500 mb-1">Deadline</p>
          <p className="text-sm font-medium text-white">{formatDate(project.deadline)}</p>
        </div>
        <div className="glass-card">
          <p className="text-xs text-gray-500 mb-1">Progress</p>
          <p className="text-2xl font-bold text-white mb-1">{project.progress || 0}%</p>
          <ProgressBar value={project.progress || 0} showLabel={false} size="sm" />
        </div>
      </div>

      {/* Members + task stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Tasks</h2>
            <div className="flex items-center gap-2">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="select-field text-xs py-1.5 w-36">
                <option value="">All Status</option>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
              <button onClick={() => setShowTaskCreate(true)} className="btn-primary text-xs py-1.5 px-3">
                <Plus size={13} /> Task
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={CheckSquare} title="No tasks" description="Add your first task to this project"
              action={<button onClick={() => setShowTaskCreate(true)} className="btn-primary"><Plus size={15} />Add Task</button>} />
          ) : (
            <div className="space-y-2">
              {filtered.map(task => (
                <div key={task._id} className="group flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-white/5"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-emerald-400' : task.status === 'in-progress' ? 'bg-blue-400' : task.status === 'review' ? 'bg-purple-400' : 'bg-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                      {task.title}
                    </p>
                    {task.deadline && (
                      <p className={`text-xs mt-0.5 ${isOverdue(task.deadline) && task.status !== 'done' ? 'text-red-400' : 'text-gray-600'}`}>
                        Due {formatDate(task.deadline)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                    <AvatarGroup users={task.assignedTo || []} max={2} size="xs" />
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditTask(task)}
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                        <Pencil size={11} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => setDeleteTaskTarget(task)}
                          className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members panel */}
        <div className="glass-card">
          <h2 className="section-title mb-4">Team ({project.members?.length || 0})</h2>
          <div className="space-y-2.5">
            {/* Creator */}
            {project.createdBy && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.12)' }}>
                <Avatar user={project.createdBy} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{project.createdBy.name}</p>
                  <p className="text-xs text-blue-400">Project Owner</p>
                </div>
              </div>
            )}
            {project.members?.filter(m => m._id !== project.createdBy?._id).map(member => (
              <div key={member._id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors">
                <Avatar user={member} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-200 truncate">{member.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Task summary */}
          <div className="mt-5 pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Task Summary</h3>
            {[
              { label: 'Todo', value: tasks.filter(t => t.status === 'todo').length, color: '#6b7280' },
              { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#4f8ef7' },
              { label: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#8b5cf6' },
              { label: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#10b981' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-gray-400">{item.label}</span>
                </div>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Project">
        <ProjectForm onSubmit={handleUpdateProject} initial={project} loading={submitting} />
      </Modal>
      <Modal isOpen={showTaskCreate} onClose={() => setShowTaskCreate(false)} title="Create Task">
        <TaskForm onSubmit={handleCreateTask} loading={submitting} projectId={id} />
      </Modal>
      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task">
        <TaskForm onSubmit={handleUpdateTask} initial={editTask || {}} loading={submitting} projectId={id} />
      </Modal>
      <ConfirmDialog isOpen={!!deleteTaskTarget} onClose={() => setDeleteTaskTarget(null)}
        onConfirm={handleDeleteTask} loading={submitting}
        message={`Delete task "${deleteTaskTarget?.title}"?`} />
      <ConfirmDialog isOpen={showDeleteProject} onClose={() => setShowDeleteProject(false)}
        onConfirm={handleDeleteProject} loading={submitting}
        message={`Delete project "${project.title}" and all its tasks? This cannot be undone.`} />
    </div>
  );
};

export default ProjectDetail;
