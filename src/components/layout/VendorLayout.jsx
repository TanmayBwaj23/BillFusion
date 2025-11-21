import React from 'react';
import { Outlet } from 'react-router-dom';
import { VendorSidebar } from './VendorSidebar';
import { VendorHeader } from './VendorHeader';

export function VendorLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VendorSidebar />
      <div className="pl-64">
        <VendorHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
