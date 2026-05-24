// Priority config
export const PRIORITY_CONFIG = {
  low: { label: 'Low', className: 'priority-low', color: '#10b981' },
  medium: { label: 'Medium', className: 'priority-medium', color: '#4f8ef7' },
  high: { label: 'High', className: 'priority-high', color: '#f59e0b' },
  urgent: { label: 'Urgent', className: 'priority-urgent', color: '#ef4444' },
};

// Status config
export const STATUS_CONFIG = {
  'todo': { label: 'Todo', className: 'status-todo', color: '#6b7280' },
  'in-progress': { label: 'In Progress', className: 'status-in-progress', color: '#4f8ef7' },
  'review': { label: 'Review', className: 'status-review', color: '#8b5cf6' },
  'done': { label: 'Done', className: 'status-done', color: '#10b981' },
};

// Project status config
export const PROJECT_STATUS = {
  planning: { label: 'Planning', color: '#6b7280' },
  active: { label: 'Active', color: '#4f8ef7' },
  'on-hold': { label: 'On Hold', color: '#f59e0b' },
  completed: { label: 'Completed', color: '#10b981' },
};

// Format date
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Format relative time
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
};

// Check if overdue
export const isOverdue = (date) => date && new Date(date) < new Date();

// Get initials
export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Avatar color from name
export const getAvatarColor = (name) => {
  const colors = ['#4f8ef7', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444'];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Truncate text
export const truncate = (str, n = 60) => str?.length > n ? str.slice(0, n) + '...' : str;

// Kanban columns
export const KANBAN_COLUMNS = [
  { id: 'todo', title: 'Todo', color: '#6b7280' },
  { id: 'in-progress', title: 'In Progress', color: '#4f8ef7' },
  { id: 'review', title: 'Review', color: '#8b5cf6' },
  { id: 'done', title: 'Done', color: '#10b981' },
];
