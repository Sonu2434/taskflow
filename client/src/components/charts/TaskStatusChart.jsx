import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6b7280', '#4f8ef7', '#8b5cf6', '#10b981'];
const LABELS = { todo: 'Todo', 'in-progress': 'In Progress', review: 'Review', done: 'Done' };

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl text-sm"
        style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-white font-medium">{payload[0].name}</p>
        <p className="text-gray-400">{payload[0].value} tasks</p>
      </div>
    );
  }
  return null;
};

const TaskStatusChart = ({ stats }) => {
  const data = stats ? [
    { name: 'Todo', value: stats.todo || 0 },
    { name: 'In Progress', value: stats.inProgress || 0 },
    { name: 'Review', value: stats.review || 0 },
    { name: 'Done', value: stats.done || 0 },
  ].filter(d => d.value > 0) : [];

  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No task data yet</div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
          paddingAngle={3} dataKey="value" stroke="none">
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle" iconSize={8}
          formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TaskStatusChart;
