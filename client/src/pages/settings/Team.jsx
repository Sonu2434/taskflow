import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Search, Shield, Trash2, Crown } from 'lucide-react';
import { fetchUsers, updateUserRole, removeUser } from '../../redux/slices/userSlice';
import { RoleBadge } from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { formatDate, getAvatarColor } from '../../utils/helpers';

const Team = () => {
  const dispatch = useDispatch();
  const { items: users, loading } = useSelector(s => s.users);
  const { user: currentUser } = useSelector(s => s.auth);
  const isAdmin = currentUser?.role === 'admin';

  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    dispatch(updateUserRole({ id: user._id, role: newRole }));
  };

  const handleDelete = async () => {
    setSubmitting(true);
    await dispatch(removeUser(deleteTarget._id));
    setSubmitting(false);
    setDeleteTarget(null);
  };

  const admins = filtered.filter(u => u.role === 'admin');
  const members = filtered.filter(u => u.role === 'member');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Users size={22} className="text-blue-400" />
            Team Members
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{users.length} members total</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="input-field pl-10" placeholder="Search members..." />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: users.length, color: 'blue', icon: Users },
          { label: 'Admins', value: admins.length, color: 'purple', icon: Crown },
          { label: 'Members', value: members.length, color: 'green', icon: Shield },
        ].map(stat => (
          <div key={stat.label} className="glass-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center`}
              style={{
                background: stat.color === 'blue' ? 'rgba(79,142,247,0.12)' : stat.color === 'purple' ? 'rgba(139,92,246,0.12)' : 'rgba(16,185,129,0.12)',
                border: `1px solid ${stat.color === 'blue' ? 'rgba(79,142,247,0.2)' : stat.color === 'purple' ? 'rgba(139,92,246,0.2)' : 'rgba(16,185,129,0.2)'}`,
              }}>
              <stat.icon size={18} style={{ color: stat.color === 'blue' ? '#4f8ef7' : stat.color === 'purple' ? '#8b5cf6' : '#10b981' }} />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Members table */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="section-title">All Members</h2>
        </div>

        {loading ? (
          <div className="p-4"><TableSkeleton rows={6} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No members found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Member', 'Email', 'Role', 'Joined', isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3 first:pl-6 last:pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id} className="group hover:bg-white/5 transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-4 pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ background: getAvatarColor(u.name) }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">{u.name}</p>
                          {u._id === currentUser?._id && (
                            <span className="text-xs text-blue-400">(you)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{u.email}</span>
                    </td>
                    <td className="px-4 py-4"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-gray-600">{formatDate(u.createdAt)}</span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 pr-6 py-4">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {u._id !== currentUser?._id && (
                            <>
                              <button onClick={() => handleRoleToggle(u)}
                                title={`Make ${u.role === 'admin' ? 'Member' : 'Admin'}`}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors">
                                <Shield size={12} />
                                {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                              </button>
                              <button onClick={() => setDeleteTarget(u)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={submitting}
        message={`Remove "${deleteTarget?.name}" from the team? This cannot be undone.`} />
    </div>
  );
};

export default Team;
