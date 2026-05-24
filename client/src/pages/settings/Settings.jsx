import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Settings as SettingsIcon, User, Lock, Bell, Save, Eye, EyeOff } from 'lucide-react';
import { updateUser } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { getAvatarColor, getInitials } from '../../utils/helpers';

const Settings = () => {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authService.updateProfile(profileForm);
      dispatch(updateUser(res.data.user));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
    setSaving(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-2">
          <SettingsIcon size={22} className="text-blue-400" />
          Settings
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            style={activeTab === tab.id ? { background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.25)' } : {}}>
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="glass-card space-y-6">
          {/* Avatar preview */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
              style={{ background: getAvatarColor(user?.name) }}>
              {getInitials(user?.name)}
            </div>
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full capitalize"
                style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }}>
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Display Name</label>
              <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                className="input-field" placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
              <input value={user?.email} disabled
                className="input-field opacity-50 cursor-not-allowed" />
              <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Avatar URL</label>
              <input value={profileForm.avatar} onChange={e => setProfileForm(f => ({ ...f, avatar: e.target.value }))}
                className="input-field" placeholder="https://..." />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Security tab */}
      {activeTab === 'security' && (
        <div className="glass-card space-y-5">
          <div>
            <h2 className="section-title mb-1">Change Password</h2>
            <p className="text-gray-500 text-sm">Keep your account secure with a strong password.</p>
          </div>

          <div className="space-y-4">
            {[
              { key: 'currentPassword', label: 'Current Password', show: showPw.current, toggle: () => setShowPw(p => ({ ...p, current: !p.current })) },
              { key: 'newPassword', label: 'New Password', show: showPw.new, toggle: () => setShowPw(p => ({ ...p, new: !p.new })) },
              { key: 'confirmPassword', label: 'Confirm New Password', show: showPw.confirm, toggle: () => setShowPw(p => ({ ...p, confirm: !p.confirm })) },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{field.label}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input type={field.show ? 'text' : 'password'}
                    value={passwordForm[field.key]}
                    onChange={e => setPasswordForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="input-field pl-10 pr-10" placeholder="••••••••" />
                  <button type="button" onClick={field.toggle}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    {field.show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}
            <div className="px-4 py-3 rounded-xl text-sm text-gray-500"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              Password change functionality requires additional backend endpoint setup.
            </div>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === 'notifications' && (
        <div className="glass-card space-y-5">
          <div>
            <h2 className="section-title mb-1">Notification Preferences</h2>
            <p className="text-gray-500 text-sm">Control what notifications you receive.</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Task assigned to me', desc: 'When someone assigns a task to you', defaultOn: true },
              { label: 'Task deadline approaching', desc: '24 hours before a task is due', defaultOn: true },
              { label: 'Project updates', desc: 'When a project you\'re in is updated', defaultOn: false },
              { label: 'New comments', desc: 'When someone comments on your task', defaultOn: true },
              { label: 'Weekly summary', desc: 'Weekly digest of your productivity', defaultOn: false },
            ].map((item, i) => (
              <label key={i} className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <p className="text-sm font-medium text-gray-200">{item.label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative flex-shrink-0 ${item.defaultOn ? 'bg-blue-500' : 'bg-gray-700'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.defaultOn ? 'left-5' : 'left-0.5'}`} />
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-600">Notification settings are for display purposes in this demo.</p>
        </div>
      )}
    </div>
  );
};

export default Settings;
