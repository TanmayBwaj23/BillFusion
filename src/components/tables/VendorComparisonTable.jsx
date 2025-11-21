import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/utils';
import { Settings, BarChart3 } from 'lucide-react';

export function VendorComparisonTable({ vendors }) {
  const getPerformanceBadge = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor Name</TableHead>
            <TableHead>Billing Model</TableHead>
            <TableHead className="text-right">Employees</TableHead>
            <TableHead className="text-right">Monthly Trips</TableHead>
            <TableHead className="text-right">Monthly Spend</TableHead>
            <TableHead className="text-right">Performance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">
                {vendor.name}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {vendor.billingModel}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {vendor.employeeCount}
              </TableCell>
              <TableCell className="text-right">
                {vendor.monthlyTrips.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(vendor.monthlySpend)}
              </TableCell>
              <TableCell className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceBadge(vendor.performance)}`}>
                  {vendor.performance}%
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(vendor.contractStatus)}`}>
                  {vendor.contractStatus}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Analytics
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
