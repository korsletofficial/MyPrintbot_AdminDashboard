import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Image,
  Settings,
  HelpCircle,
  LogOut,
  Gift,
  MessageSquare,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import printbotLogo from '../../assets/printbot-logo.png';
import { useAdminAuthStore } from '../../stores/authStore';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAdminAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      id: 'print-partners',
      label: 'Print Partners',
      icon: Users,
      path: '/print-partners',
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Building2,
      path: '/clients',
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: Image,
      path: '/templates',
    },
    {
      id: 'referrals',
      label: 'Referrals',
      icon: Gift,
      path: '/referrals',
    },
    {
      id: 'support-queries',
      label: 'Support Queries',
      icon: MessageSquare,
      path: '/support-queries',
    },
    {
      id: 'faqs',
      label: 'FAQs',
      icon: HelpCircle,
      path: '/faqs',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <button
        key={item.id}
        onClick={() => navigate(item.path)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "btn-gradient text-white shadow-md"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="h-16 border-b border-gray-200 flex items-center px-4">
        <div className="flex items-center gap-2">
          <img
            src={printbotLogo}
            alt="MyPrintBot Logo"
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {menuItems.map(renderMenuItem)}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
