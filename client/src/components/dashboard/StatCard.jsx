const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => {
  const colorMap = {
    blue: { bg: 'rgba(79,142,247,0.12)', border: 'rgba(79,142,247,0.2)', icon: '#4f8ef7', glow: 'rgba(79,142,247,0.15)' },
    purple: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)', icon: '#8b5cf6', glow: 'rgba(139,92,246,0.15)' },
    green: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)', icon: '#10b981', glow: 'rgba(16,185,129,0.15)' },
    orange: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)', icon: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
    red: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.2)', icon: '#ef4444', glow: 'rgba(239,68,68,0.15)' },
    cyan: { bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.2)', icon: '#06b6d4', glow: 'rgba(6,182,212,0.15)' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white font-display">{value ?? '—'}</p>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <Icon size={20} style={{ color: c.icon }} />
        </div>
      </div>
      {subtitle && <p className="text-gray-600 text-xs">{subtitle}</p>}
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
          <span className="text-gray-600 font-normal">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
