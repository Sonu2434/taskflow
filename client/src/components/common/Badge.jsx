import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../utils/helpers';

export const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  return <span className={`badge ${config.className}`}>{config.label}</span>;
};

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['todo'];
  return <span className={`badge ${config.className}`}>{config.label}</span>;
};

export const RoleBadge = ({ role }) => (
  <span className={`badge ${role === 'admin'
    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
    : 'bg-gray-500/15 text-gray-400 border border-gray-500/20'}`}>
    {role}
  </span>
);
