import { useState } from 'react';
import { useSelector } from 'react-redux';

const TaskForm = ({ onSubmit, initial = {}, loading, projectId }) => {
  const { items: users } = useSelector(s => s.users);
  const { items: projects } = useSelector(s => s.projects);

  const [form, setForm] = useState({
    title: '', description: '', status: 'todo', priority: 'medium',
    deadline: '', assignedTo: [], projectId: projectId || '',
    ...initial,
    assignedTo: initial.assignedTo?.map(a => a._id || a) || [],
    deadline: initial.deadline ? initial.deadline.slice(0, 10) : '',
    projectId: initial.projectId?._id || initial.projectId || projectId || '',
  });

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const toggleAssignee = (id) => {
    setForm(f => ({
      ...f,
      assignedTo: f.assignedTo.includes(id) ? f.assignedTo.filter(a => a !== id) : [...f.assignedTo, id]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Task Title *</label>
        <input name="title" value={form.title} onChange={handle} required
          className="input-field" placeholder="e.g. Design login page" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
        <textarea name="description" value={form.description} onChange={handle} rows={3}
          className="input-field resize-none" placeholder="Task details..." />
      </div>
      {!projectId && (
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Project *</label>
          <select name="projectId" value={form.projectId} onChange={handle} required className="select-field">
            <option value="">Select a project</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
          <select name="status" value={form.status} onChange={handle} className="select-field">
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Priority</label>
          <select name="priority" value={form.priority} onChange={handle} className="select-field">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Due Date</label>
        <input type="date" name="deadline" value={form.deadline} onChange={handle}
          className="input-field" style={{ colorScheme: 'dark' }} />
      </div>
      {users.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Assign To</label>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {users.map(u => (
              <label key={u._id} className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/5">
                <input type="checkbox" checked={form.assignedTo.includes(u._id)}
                  onChange={() => toggleAssignee(u._id)} className="accent-blue-500 w-4 h-4" />
                <span className="text-sm text-gray-300">{u.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? 'Saving...' : initial._id ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;
