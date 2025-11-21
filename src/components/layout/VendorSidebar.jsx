import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Car, FileText, Settings, DollarSign, Truck } from 'lucide-react';

export function VendorSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'Trip Management', path: '/vendor/trips', icon: Car },
    { name: 'Billing & Payouts', path: '/vendor/billing', icon: DollarSign },
    { name: 'Billing Models', path: '/vendor/billing-config', icon: Settings },
    { name: 'Reports', path: '/vendor/reports', icon: FileText },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <Truck className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-xl font-bold text-gray-900">Vendor Portal</h1>
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

        {/* Vendor Info */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">V</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Swift Transport</p>
              <p className="text-xs text-gray-500">Package Model Vendor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
