import React from 'react';
import { Outlet } from 'react-router-dom';
import { RoleBasedSidebar } from './RoleBasedSidebar';
import { VendorHeader } from './VendorHeader';

export function VendorLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RoleBasedSidebar />
      <div className="pl-64">
        <VendorHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
