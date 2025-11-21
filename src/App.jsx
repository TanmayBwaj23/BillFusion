import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClientLayout } from './components/layout/ClientLayout';
import { ClientDashboard } from './pages/client/ClientDashboard';
import { VendorManagement } from './pages/client/VendorManagement';
import { TripMonitoring } from './pages/client/TripMonitoring';
import { BillingModelVisibility } from './pages/client/BillingModelVisibility';
import { BillingReports } from './pages/client/BillingReports';
import { VendorLayout } from './components/layout/VendorLayout';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { TripManagement } from './pages/vendor/TripManagement';
import { VendorBilling } from './pages/vendor/VendorBilling';
import { VendorBillingConfig } from './pages/vendor/VendorBillingConfig';
import { VendorReports } from './pages/vendor/VendorReports';
import { EmployeeLayout } from './components/layout/EmployeeLayout';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { EmployeeTripHistory } from './pages/employee/EmployeeTripHistory';
import { EmployeeReports } from './pages/employee/EmployeeReports';
import { EmployeeProfile } from './pages/employee/EmployeeProfile';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Protected Client Routes */}
          <Route path="/client" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="trip-monitoring" element={<TripMonitoring />} />
            <Route path="billing-models" element={<BillingModelVisibility />} />
            <Route path="billing-reports" element={<BillingReports />} />
            <Route path="vendors" element={<VendorManagement />} />
          </Route>
          
          {/* Protected Vendor Routes */}
          <Route path="/vendor" element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="trips" element={<TripManagement />} />
            <Route path="billing" element={<VendorBilling />} />
            <Route path="billing-config" element={<VendorBillingConfig />} />
            <Route path="reports" element={<VendorReports />} />
          </Route>
          
          {/* Protected Employee Routes */}
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="trips" element={<EmployeeTripHistory />} />
            <Route path="reports" element={<EmployeeReports />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}