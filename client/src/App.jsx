import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// App pages
import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/projects/Projects';
import ProjectDetail from './pages/projects/ProjectDetail';
import Tasks from './pages/tasks/Tasks';
import KanbanBoard from './pages/tasks/KanbanBoard';
import Team from './pages/settings/Team';
import Settings from './pages/settings/Settings';
import NotFound from './pages/NotFound';

const AppWithLayout = ({ children }) => (
  <AppLayout>{children}</AppLayout>
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1a1a2e',
              color: '#f9fafb',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<AppWithLayout><Dashboard /></AppWithLayout>} />
            <Route path="/projects" element={<AppWithLayout><Projects /></AppWithLayout>} />
            <Route path="/projects/:id" element={<AppWithLayout><ProjectDetail /></AppWithLayout>} />
            <Route path="/tasks" element={<AppWithLayout><Tasks /></AppWithLayout>} />
            <Route path="/kanban" element={<AppWithLayout><KanbanBoard /></AppWithLayout>} />
            <Route path="/team" element={<AppWithLayout><Team /></AppWithLayout>} />
            <Route path="/settings" element={<AppWithLayout><Settings /></AppWithLayout>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
