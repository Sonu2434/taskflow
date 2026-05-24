import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ProjectForm = ({ onSubmit, initial = {}, loading }) => {
  const { items: users } = useSelector(s => s.users);
  const [form, setForm] = useState({
    title: '', description: '', status: 'planning',
    priority: 'medium', deadline: '', members: [],
    ...initial,
    members: initial.members?.map(m => m._id || m) || [],
    deadline: initial.deadline ? initial.deadline.slice(0, 10) : '',
  });

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      members: f.members.includes(id) ? f.members.filter(m => m !== id) : [...f.members, id]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Project Title *</label>
        <input name="title" value={form.title} onChange={handle} required
          className="input-field" placeholder="e.g. Website Redesign" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
        <textarea name="description" value={form.description} onChange={handle} rows={3}
          className="input-field resize-none" placeholder="Describe the project..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
          <select name="status" value={form.status} onChange={handle} className="select-field">
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
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
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Deadline</label>
        <input type="date" name="deadline" value={form.deadline} onChange={handle}
          className="input-field" style={{ colorScheme: 'dark' }} />
      </div>
      {users.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Team Members</label>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {users.map(u => (
              <label key={u._id} className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors hover:bg-white/5">
                <input type="checkbox" checked={form.members.includes(u._id)}
                  onChange={() => toggleMember(u._id)}
                  className="accent-blue-500 w-4 h-4 rounded" />
                <span className="text-sm text-gray-300">{u.name}</span>
                <span className="text-xs text-gray-600 ml-auto">{u.role}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? 'Saving...' : initial._id ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
