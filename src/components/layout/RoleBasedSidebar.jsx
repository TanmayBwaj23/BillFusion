import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  MapPin, 
  Eye, 
  FileText, 
  Building2,
  Car, 
  Settings, 
  DollarSign, 
  User,
  LogOut
} from 'lucide-react';

// Navigation configuration for each role
const navigationConfig = {
  employee: [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'Trip History', path: '/employee/trips', icon: MapPin },
    { name: 'Reports', path: '/employee/reports', icon: FileText },
    { name: 'Profile', path: '/employee/profile', icon: User }
  ],
  client: [
    { name: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Trip Monitoring', path: '/client/trip-monitoring', icon: MapPin },
    { name: 'Billing Models', path: '/client/billing-models', icon: Eye },
    { name: 'Billing & Reports', path: '/client/billing-reports', icon: FileText },
    { name: 'Vendor Management', path: '/client/vendors', icon: Building2 }
  ],
  vendor: [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'Trip Management', path: '/vendor/trips', icon: Car },
    { name: 'Billing Config', path: '/vendor/billing-config', icon: Settings },
    { name: 'Billing', path: '/vendor/billing', icon: DollarSign },
    { name: 'Reports', path: '/vendor/reports', icon: FileText }
  ]
};

// Role display names
const roleDisplayNames = {
  employee: 'Employee Portal',
  client: 'Client Portal',
  vendor: 'Vendor Portal'
};

export function RoleBasedSidebar() {
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  
  // Get user role, default to employee if not set
  const userRole = user?.role?.toLowerCase() || 'employee';
  
  // Get navigation items for current role
  const navigationItems = navigationConfig[userRole] || navigationConfig.employee;
  
  // Get role display name
  const roleDisplayName = roleDisplayNames[userRole] || 'Portal';
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };
  
  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };
  
  // Handle logout
  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };
  
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">BillFusion</h1>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-xs font-medium text-blue-900 uppercase tracking-wide">
            {roleDisplayName}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
