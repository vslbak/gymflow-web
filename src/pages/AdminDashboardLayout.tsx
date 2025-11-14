import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BarChart3, Dumbbell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminPage from './AdminPage';
import AdminClassesPage from './AdminClassesPage';

export default function AdminDashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const path = location.pathname;
    if (path === '/admin' || path === '/admin/overview') {
      setActiveTab('overview');
    } else if (path === '/admin/classes') {
      setActiveTab('classes');
    }
  }, [user, navigate, location]);

  if (user?.role !== 'ADMIN') {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, path: '/admin' },
    { id: 'classes', label: 'Classes', icon: Dumbbell, path: '/admin/classes' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-semibold transition-colors ${
                    isActive
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {activeTab === 'overview' && <AdminPage />}
      {activeTab === 'classes' && <AdminClassesPage />}
    </div>
  );
}
