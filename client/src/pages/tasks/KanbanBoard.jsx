import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { Plus, Kanban as KanbanIcon, Filter } from 'lucide-react';
import { fetchTasks, updateTask, createTask, deleteTask } from '../../redux/slices/taskSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import KanbanColumn from '../../components/kanban/KanbanColumn';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TaskForm from '../../components/forms/TaskForm';
import { KANBAN_COLUMNS } from '../../utils/helpers';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const { items: tasks, loading } = useSelector(s => s.tasks);
  const { items: projects } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);
  const isAdmin = user?.role === 'admin';

  const [showCreate, setShowCreate] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterProject, setFilterProject] = useState('');
  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    dispatch(fetchTasks({ limit: 200 }));
    dispatch(fetchProjects({ limit: 100 }));
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const displayed = filterProject
    ? localTasks.filter(t => t.projectId?._id === filterProject || t.projectId === filterProject)
    : localTasks;

  const getColumnTasks = (colId) => displayed.filter(t => t.status === colId);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    // Optimistic update
    setLocalTasks(prev => prev.map(t => t._id === draggableId ? { ...t, status: newStatus } : t));

    try {
      await dispatch(updateTask({ id: draggableId, data: { status: newStatus } }));
    } catch {
      // Revert on error
      setLocalTasks(tasks);
      toast.error('Failed to update task status');
    }
  };

  const handleCreate = async (data) => {
    setSubmitting(true);
    const result = await dispatch(createTask({ ...data, status: defaultStatus }));
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

  const handleAddTask = (status) => {
    setDefaultStatus(status);
    setShowCreate(true);
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap flex-shrink-0">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <KanbanIcon size={22} className="text-blue-400" />
            Kanban Board
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{displayed.length} tasks across all columns</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select value={filterProject} onChange={e => setFilterProject(e.target.value)}
            className="select-field w-44 text-sm">
            <option value="">All Projects</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
          <button onClick={() => { setDefaultStatus('todo'); setShowCreate(true); }} className="btn-primary">
            <Plus size={15} /> Add Task
          </button>
        </div>
      </div>

      {/* Column stats */}
      <div className="flex gap-4 flex-shrink-0 overflow-x-auto pb-1">
        {KANBAN_COLUMNS.map(col => {
          const count = getColumnTasks(col.id).length;
          return (
            <div key={col.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0 text-xs"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
              <span className="text-gray-400">{col.title}</span>
              <span className="font-bold text-white">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1" style={{ minHeight: 0 }}>
          {KANBAN_COLUMNS.map(col => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={getColumnTasks(col.id)}
              onAddTask={handleAddTask}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </DragDropContext>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Task">
        <TaskForm onSubmit={handleCreate} loading={submitting} initial={{ status: defaultStatus }} />
      </Modal>
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Task">
        <TaskForm onSubmit={handleUpdate} initial={editTarget || {}} loading={submitting} />
      </Modal>
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={submitting}
        message={`Delete task "${deleteTarget?.title}"?`} />
    </div>
  );
};

export default KanbanBoard;
