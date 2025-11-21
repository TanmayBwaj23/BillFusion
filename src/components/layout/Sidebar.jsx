import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, MapPin, Eye, FileText, Building2 } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    { name: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Trip Monitoring', path: '/client/trip-monitoring', icon: MapPin },
    { name: 'Billing Models', path: '/client/billing-models', icon: Eye },
    { name: 'Billing & Reports', path: '/client/billing-reports', icon: FileText },
    { name: 'Vendor Management', path: '/client/vendors', icon: Building2 },
  ];
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">MoveInSync</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
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
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {Icon && <Icon className="w-5 h-5 mr-3" />}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">C</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Client Portal</p>
              <p className="text-xs text-gray-500">Transportation Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
