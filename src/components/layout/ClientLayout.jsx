import React from 'react';
import { Outlet } from 'react-router-dom';
import { RoleBasedSidebar } from './RoleBasedSidebar';
import { Header } from './Header';

export function ClientLayout() {
  return (
    <div className="min-h-screen bg-background">
      <RoleBasedSidebar />
      <div className="pl-64">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
