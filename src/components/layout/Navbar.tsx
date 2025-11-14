import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Dumbbell className="h-8 w-8 text-orange-600 group-hover:text-orange-700 transition-colors" />
            <span className="text-2xl font-bold text-gray-900">GymFlow</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/classes"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Classes
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/classes/manage"
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Manage Classes</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-gray-700 hover:text-orange-600">
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
