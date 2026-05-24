import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FolderKanban, CheckSquare, Clock, AlertCircle,
  TrendingUp, Calendar, ArrowRight, Zap
} from 'lucide-react';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { fetchTasks, fetchStats } from '../../redux/slices/taskSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import StatCard from '../../components/dashboard/StatCard';
import { StatSkeleton } from '../../components/common/Skeleton';
import TaskStatusChart from '../../components/charts/TaskStatusChart';
import WeeklyChart from '../../components/charts/WeeklyChart';
import ProjectProgressChart from '../../components/charts/ProjectProgressChart';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { formatDate, isOverdue, timeAgo } from '../../utils/helpers';
import ProgressBar from '../../components/common/ProgressBar';
import { AvatarGroup } from '../../components/common/Avatar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: projects, loading: projLoading } = useSelector(s => s.projects);
  const { items: tasks, stats, loading: taskLoading } = useSelector(s => s.tasks);
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    dispatch(fetchProjects({ limit: 100 }));
    dispatch(fetchTasks({ limit: 100 }));
    dispatch(fetchStats());
    dispatch(fetchUsers());
  }, [dispatch]);

  const upcomingTasks = tasks
    .filter(t => t.deadline && t.status !== 'done')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Zap size={22} className="text-blue-400" />
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/projects" className="btn-primary hidden sm:flex">
          <FolderKanban size={15} />
          New Project
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {taskLoading && !stats ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard title="Total Projects" value={projects.length} icon={FolderKanban} color="blue" subtitle="Active workspaces" />
            <StatCard title="Total Tasks" value={stats?.total ?? 0} icon={CheckSquare} color="purple" subtitle="Across all projects" />
            <StatCard title="Completed" value={stats?.done ?? 0} icon={TrendingUp} color="green" subtitle="Tasks finished" />
            <StatCard title="In Progress" value={stats?.inProgress ?? 0} icon={Clock} color="orange" subtitle="Currently active" />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card">
          <h2 className="section-title mb-4">Task Status</h2>
          <TaskStatusChart stats={stats} />
        </div>
        <div className="glass-card">
          <h2 className="section-title mb-4">Weekly Activity</h2>
          <WeeklyChart />
        </div>
        <div className="glass-card">
          <h2 className="section-title mb-4">Project Progress</h2>
          <ProjectProgressChart projects={projects} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming deadlines */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Upcoming Deadlines</h2>
            <Link to="/tasks" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No upcoming deadlines</p>
          ) : (
            <div className="space-y-2.5">
              {upcomingTasks.map(task => (
                <div key={task._id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/5"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isOverdue(task.deadline) ? 'bg-red-400' : 'bg-blue-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{task.title}</p>
                    <p className="text-xs text-gray-600">{task.projectId?.title}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PriorityBadge priority={task.priority} />
                    <span className={`text-xs ${isOverdue(task.deadline) ? 'text-red-400' : 'text-gray-500'}`}>
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent projects */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Active Projects</h2>
            <Link to="/projects" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {projects.filter(p => p.status === 'active' || p.status === 'planning').slice(0, 4).map(project => (
                <Link to={`/projects/${project._id}`} key={project._id}
                  className="block px-3 py-3 rounded-xl transition-colors hover:bg-white/5"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-200 truncate">{project.title}</p>
                    <PriorityBadge priority={project.priority} />
                  </div>
                  <ProgressBar value={project.progress || 0} size="sm" showLabel={false} />
                  <div className="flex items-center justify-between mt-2">
                    <AvatarGroup users={project.members || []} max={4} size="xs" />
                    <span className="text-xs text-gray-600">{project.progress || 0}%</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent tasks */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Tasks</h2>
          <Link to="/tasks" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4">Task</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4 hidden md:table-cell">Project</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4">Priority</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-3 hidden lg:table-cell">Due</th>
              </tr>
            </thead>
            <tbody className="space-y-1">
              {recentTasks.map(task => (
                <tr key={task._id} className="group hover:bg-white/5 rounded-xl transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td className="py-3 pr-4">
                    <p className="text-gray-200 font-medium truncate max-w-[200px]">{task.title}</p>
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell">
                    <span className="text-gray-500 text-xs truncate">{task.projectId?.title || '—'}</span>
                  </td>
                  <td className="py-3 pr-4"><StatusBadge status={task.status} /></td>
                  <td className="py-3 pr-4"><PriorityBadge priority={task.priority} /></td>
                  <td className="py-3 hidden lg:table-cell">
                    <span className={`text-xs ${isOverdue(task.deadline) && task.status !== 'done' ? 'text-red-400' : 'text-gray-600'}`}>
                      {formatDate(task.deadline)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentTasks.length === 0 && (
            <p className="text-gray-600 text-sm text-center py-8">No tasks yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
