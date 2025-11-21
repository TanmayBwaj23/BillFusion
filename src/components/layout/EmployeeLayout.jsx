import React from 'react';
import { Outlet } from 'react-router-dom';
import { EmployeeSidebar } from './EmployeeSidebar';
import { EmployeeHeader } from './EmployeeHeader';

export function EmployeeLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeSidebar />
      <div className="pl-64">
        <EmployeeHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
