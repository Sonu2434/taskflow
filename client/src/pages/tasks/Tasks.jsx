import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, CheckSquare, Pencil, Trash2, Filter } from 'lucide-react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../redux/slices/taskSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TaskForm from '../../components/forms/TaskForm';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { AvatarGroup } from '../../components/common/Avatar';
import { formatDate, isOverdue } from '../../utils/helpers';

const Tasks = () => {
  const dispatch = useDispatch();
  const { items: tasks, loading } = useSelector(s => s.tasks);
  const { user } = useSelector(s => s.auth);
  const { items: projects } = useSelector(s => s.projects);
  const isAdmin = user?.role === 'admin';

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterProject, setFilterProject] = useState('');

  useEffect(() => {
    dispatch(fetchTasks({ limit: 200 }));
    dispatch(fetchProjects({ limit: 100 }));
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = tasks.filter(t => {
    const s = t.title.toLowerCase().includes(search.toLowerCase());
    const st = filterStatus ? t.status === filterStatus : true;
    const pr = filterPriority ? t.priority === filterPriority : true;
    const pj = filterProject ? (t.projectId?._id === filterProject || t.projectId === filterProject) : true;
    return s && st && pr && pj;
  });

  const handleCreate = async (data) => {
    setSubmitting(true);
    const result = await dispatch(createTask(data));
    setSubmitting(false);
    if (!result.error) setShowCreate(false);
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    const result = await dispatch(updateTask({ id: editTarget._id, data }));
    setSubmitting(false);
    if (!result.error) setEditTarget(null);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    await dispatch(deleteTask(deleteTarget._id));
    setSubmitting(false);
    setDeleteTarget(null);
  };

  const handleStatusChange = async (task, newStatus) => {
    dispatch(updateTask({ id: task._id, data: { status: newStatus } }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <CheckSquare size={22} className="text-blue-400" />
            Tasks
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} tasks</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus size={15} /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-10" placeholder="Search tasks..." />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select-field sm:w-36">
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="select-field sm:w-36">
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="select-field sm:w-44">
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card p-0 overflow-hidden">
        {loading ? (
          <div className="p-4"><TableSkeleton rows={8} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={CheckSquare} title="No tasks found"
            description="Create your first task to get started"
            action={<button onClick={() => setShowCreate(true)} className="btn-primary"><Plus size={15} />Add Task</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Task', 'Project', 'Status', 'Priority', 'Assigned', 'Due Date', ''].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3 first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => {
                  const overdue = isOverdue(task.deadline) && task.status !== 'done';
                  return (
                    <tr key={task._id} className="group hover:bg-white/5 transition-colors"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="px-4 pl-6 py-3.5 max-w-xs">
                        <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-600 truncate mt-0.5">{task.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-500 truncate max-w-[100px] block">
                          {task.projectId?.title || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <select value={task.status}
                          onChange={e => handleStatusChange(task, e.target.value)}
                          className="text-xs rounded-lg px-2 py-1 border-0 outline-none cursor-pointer transition-colors"
                          style={{ background: 'rgba(255,255,255,0.06)', color: '#d1d5db' }}>
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5"><PriorityBadge priority={task.priority} /></td>
                      <td className="px-4 py-3.5">
                        <AvatarGroup users={task.assignedTo || []} max={3} size="xs" />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs ${overdue ? 'text-red-400' : 'text-gray-600'}`}>
                          {formatDate(task.deadline)}
                        </span>
                      </td>
                      <td className="px-4 pr-6 py-3.5">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditTarget(task)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                            <Pencil size={13} />
                          </button>
                          {isAdmin && (
                            <button onClick={() => setDeleteTarget(task)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Task">
        <TaskForm onSubmit={handleCreate} loading={submitting} />
      </Modal>
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Task">
        <TaskForm onSubmit={handleUpdate} initial={editTarget || {}} loading={submitting} />
      </Modal>
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={submitting}
        message={`Delete task "${deleteTarget?.title}"? This cannot be undone.`} />
    </div>
  );
};

export default Tasks;
