import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  MapPin, 
  Eye, 
  FileText, 
  Building2, 
  User, 
  Car, 
  DollarSign, 
  Settings, 
  Truck, 
  Briefcase,
  Shield,
  Users,
  FileSearch,
  LogOut
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';
import { Button } from '../ui/Button';

/**
 * Role-based navigation menu items configuration
 * Each role has specific menu items with paths and icons
 */
const MENU_ITEMS_BY_ROLE = {
  client: [
    { name: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Trip Monitoring', path: '/client/trip-monitoring', icon: MapPin },
    { name: 'Billing Models', path: '/client/billing-models', icon: Eye },
    { name: 'Billing & Reports', path: '/client/billing-reports', icon: FileText },
    { name: 'Vendor Management', path: '/client/vendors', icon: Building2 },
    { name: 'Profile', path: '/profile', icon: User },
  ],
  vendor: [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'Trip Management', path: '/vendor/trips', icon: Car },
    { name: 'Billing & Payouts', path: '/vendor/billing', icon: DollarSign },
    { name: 'Billing Models', path: '/vendor/billing-config', icon: Settings },
    { name: 'Reports', path: '/vendor/reports', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ],
  employee: [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/employee/users', icon: Users },
    { name: 'Billing', path: '/employee/billing', icon: DollarSign },
    { name: 'Reports', path: '/employee/reports', icon: FileText },
    { name: 'Trip History', path: '/employee/trips', icon: MapPin },
    { name: 'Profile', path: '/profile', icon: User },
  ],
  admin: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Admin Panel', path: '/admin/panel', icon: Shield },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileSearch },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
    { name: 'Billing', path: '/admin/billing', icon: DollarSign },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ],
};

/**
 * Role-specific branding configuration
 */
const ROLE_BRANDING = {
  client: {
    title: 'Client Portal',
    subtitle: 'Transportation Admin',
    icon: Building2,
    color: 'blue',
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-50',
    activeColor: 'bg-blue-50 text-blue-700 border-blue-700',
  },
  vendor: {
    title: 'Vendor Portal',
    subtitle: 'Service Provider',
    icon: Truck,
    color: 'blue',
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-50',
    activeColor: 'bg-blue-50 text-blue-700 border-blue-700',
  },
  employee: {
    title: 'Employee Portal',
    subtitle: 'Staff Member',
    icon: Briefcase,
    color: 'green',
    bgColor: 'bg-green-600',
    hoverColor: 'hover:bg-green-50',
    activeColor: 'bg-green-50 text-green-700 border-green-700',
  },
  admin: {
    title: 'Admin Portal',
    subtitle: 'System Administrator',
    icon: Shield,
    color: 'purple',
    bgColor: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-50',
    activeColor: 'bg-purple-50 text-purple-700 border-purple-700',
  },
};

/**
 * Navigation component with role-based menu items and logout functionality
 * Displays different navigation options based on the authenticated user's role
 */
export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuthStore();
  const currentPath = location.pathname;

  // Get menu items for current user role
  const navigationItems = MENU_ITEMS_BY_ROLE[role] || [];
  
  // Get branding for current user role
  const branding = ROLE_BRANDING[role] || ROLE_BRANDING.client;
  const BrandIcon = branding.icon;

  /**
   * Handle logout action
   * Calls logout API, clears authentication state and redirects to login page
   */
  const handleLogout = async () => {
    try {
      // Call logout service (handles API call and clears auth state)
      await authService.logout();
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error (auth is already cleared by service)
      navigate('/login');
    }
  };

  // Get user initials for avatar
  const getUserInitial = () => {
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return role?.charAt(0).toUpperCase() || 'U';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    if (user?.email) {
      return user.email;
    }
    return branding.title;
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo/Branding */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <BrandIcon className={`w-8 h-8 text-${branding.color}-600 mr-3`} />
          <h1 className="text-xl font-bold text-gray-900">{branding.title}</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? `${branding.activeColor} border-r-2`
                    : `text-gray-700 ${branding.hoverColor} hover:text-gray-900`
                )}
              >
                {Icon && <Icon className="w-5 h-5 mr-3" />}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info and Logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className={`w-8 h-8 ${branding.bgColor} rounded-full flex items-center justify-center`}>
              <span className="text-white text-sm font-medium">
                {getUserInitial()}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {branding.subtitle}
              </p>
            </div>
          </div>
          
          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-gray-700 hover:text-red-600 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
