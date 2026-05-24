import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { truncate } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-xl text-sm"
        style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-white font-medium">{label}</p>
        <p className="text-emerald-400">{payload[0].value}% complete</p>
      </div>
    );
  }
  return null;
};

const ProjectProgressChart = ({ projects = [] }) => {
  const data = projects.slice(0, 6).map(p => ({
    name: truncate(p.title, 14),
    progress: p.progress || 0,
  }));

  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No project data yet</div>
  );

  const getColor = (value) => {
    if (value >= 80) return '#10b981';
    if (value >= 50) return '#4f8ef7';
    if (value >= 20) return '#8b5cf6';
    return '#6b7280';
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={getColor(entry.progress)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProjectProgressChart;
