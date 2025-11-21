import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/utils';
import { Plus, Settings, BarChart3, Eye, Edit, Trash2 } from 'lucide-react';
import { VendorPerformanceOverview } from '../../components/widgets/VendorPerformanceOverview';
import { VendorDetailModal } from '../../components/modals/VendorDetailModal';
import { BillingConfigModal } from '../../components/modals/BillingConfigModal';

export function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showBillingConfig, setShowBillingConfig] = useState(false);
  const [showVendorDetail, setShowVendorDetail] = useState(false);

  useEffect(() => {
    // Mock vendor data
    const mockVendors = [
      {
        id: 1,
        name: 'Swift Transport',
        billingModel: {
          type: 'package',
          monthlyFixed: 340000,
          includedTrips: 40,
          includedKm: 800
        },
        employeeCount: 120,
        monthlyTrips: 890,
        monthlySpend: 340000,
        performance: 95,
        contractStatus: 'Active',
        contact: {
          name: 'John Doe',
          email: 'john@swifttransport.com',
          phone: '+91-9876543210'
        },
        address: '123 Transport Street, Mumbai, MH 400001'
      },
      {
        id: 2,
        name: 'City Cabs',
        billingModel: {
          type: 'trip',
          perTrip: 200,
          perKm: 15
        },
        employeeCount: 85,
        monthlyTrips: 720,
        monthlySpend: 285000,
        performance: 88,
        contractStatus: 'Active',
        contact: {
          name: 'Jane Smith',
          email: 'jane@citycabs.com',
          phone: '+91-9876543211'
        },
        address: '456 Cab Lane, Delhi, DL 110001'
      },
      {
        id: 3,
        name: 'Metro Rides',
        billingModel: {
          type: 'hybrid',
          basePackage: 150000,
          includedTrips: 20,
          additionalPerTrip: 180
        },
        employeeCount: 95,
        monthlyTrips: 650,
        monthlySpend: 295000,
        performance: 92,
        contractStatus: 'Active',
        contact: {
          name: 'Mike Johnson',
          email: 'mike@metrorides.com',
          phone: '+91-9876543212'
        },
        address: '789 Metro Plaza, Bangalore, KA 560001'
      }
    ];
    setVendors(mockVendors);
  }, []);

  const getPerformanceBadge = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getBillingModelDisplay = (model) => {
    switch (model.type) {
      case 'package':
        return 'Package Model';
      case 'trip':
        return 'Trip Model';
      case 'hybrid':
        return 'Hybrid Model';
      default:
        return 'Unknown';
    }
  };

  const handleConfigureBilling = (vendor) => {
    setSelectedVendor(vendor);
    setShowBillingConfig(true);
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetail(true);
  };

  const handleBillingConfigSave = (updatedConfig) => {
    setVendors(vendors.map(v => 
      v.id === selectedVendor.id 
        ? { ...v, billingModel: updatedConfig }
        : v
    ));
    setShowBillingConfig(false);
    setSelectedVendor(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-500 mt-1">
            Manage your transportation vendors and their configurations
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Bulk Config
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <VendorPerformanceOverview vendors={vendors} />

      {/* Vendor Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>
            Complete list of registered vendors with their current configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableHead>Contract Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.contact.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getBillingModelDisplay(vendor.billingModel)}
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {vendor.contractStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(vendor)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConfigureBilling(vendor)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showVendorDetail && selectedVendor && (
        <VendorDetailModal 
          vendor={selectedVendor}
          onClose={() => {
            setShowVendorDetail(false);
            setSelectedVendor(null);
          }}
        />
      )}

      {showBillingConfig && selectedVendor && (
        <BillingConfigModal 
          vendor={selectedVendor}
          onClose={() => {
            setShowBillingConfig(false);
            setSelectedVendor(null);
          }}
          onSave={handleBillingConfigSave}
        />
      )}
    </div>
  );
}
