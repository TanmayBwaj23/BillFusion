import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/Button';
import useAuthStore from '../../store/authStore';

export function Header() {
  const { user, clearAuth } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search vendors, trips, reports..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || 'Client User'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.company || 'Company Name'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearAuth}
            title="Logout"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
