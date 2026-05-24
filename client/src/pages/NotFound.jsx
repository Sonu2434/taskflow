import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#050508' }}>
    <div className="text-center animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
        <AlertTriangle size={36} className="text-red-400" />
      </div>
      <h1 className="text-7xl font-display font-bold text-white mb-3">
        4<span style={{ background: 'linear-gradient(135deg,#4f8ef7,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>0</span>4
      </h1>
      <h2 className="text-2xl font-semibold text-gray-300 mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="btn-primary inline-flex">
        <Home size={16} /> Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
