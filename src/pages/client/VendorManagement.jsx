import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/utils';
import { Plus, Settings, BarChart3, Eye, Edit, Trash2 } from 'lucide-react';
import { VendorPerformanceOverview } from '../../components/widgets/VendorPerformanceOverview';
import { VendorDetailModal } from '../../components/modals/VendorDetailModal';
import { BillingConfigModal } from '../../components/modals/BillingConfigModal';
import { clientApi } from '../../services/clientApi';
import useAuthStore from '../../store/authStore';

export function VendorManagement() {
  const { user } = useAuthStore();
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showBillingConfig, setShowBillingConfig] = useState(false);
  const [showVendorDetail, setShowVendorDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await clientApi.vendors.getList();
        // Map API response to component state structure if needed
        // The API returns { vendors: [...] }
        setVendors(response.vendors || []);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchVendors();
    }
  }, [user]);

  const getPerformanceBadge = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getBillingModelDisplay = (model) => {
    if (!model) return 'Not Configured';
    if (typeof model === 'string') return model;

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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
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
                      <TableRow key={vendor.vendorId || vendor.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{vendor.vendorName || vendor.name}</div>
                            <div className="text-sm text-gray-500">{vendor.contact?.email || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getBillingModelDisplay(vendor.billingModel)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {vendor.employeeCount || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {(vendor.monthlyTrips || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(vendor.monthlySpend || 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceBadge(vendor.performanceScore || vendor.performance || 0)}`}>
                            {vendor.performanceScore || vendor.performance || 0}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {vendor.contractStatus || 'Active'}
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
        </>
      )}
    </div>
  );
}
