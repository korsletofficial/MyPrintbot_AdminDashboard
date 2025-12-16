import NotificationsDropdown from './NotificationsDropdown';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth tokens
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
      <div className="h-full px-6 flex items-center justify-end">
        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationsDropdown />

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@printbot.com</p>
            </div>
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
              style={{
                background: 'radial-gradient(89.78% 128.67% at 10.22% 100%, #0672BB 0%, #152056 94.75%)'
              }}
            >
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
