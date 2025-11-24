import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/utils';
import { Eye, Info, Package, Car, Layers, DollarSign, Clock, MapPin } from 'lucide-react';
import { clientApi } from '../../services/clientApi';
import useAuthStore from '../../store/authStore';

export function BillingModelVisibility() {
  const { user } = useAuthStore();
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await clientApi.vendors.getList();
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

  const getBillingModelIcon = (type) => {
    if (!type) return DollarSign;
    const lowerType = type.toLowerCase();
    if (lowerType.includes('package')) return Package;
    if (lowerType.includes('trip')) return Car;
    if (lowerType.includes('hybrid')) return Layers;
    return DollarSign;
  };

  const getBillingModelDescription = (type) => {
    if (!type) return 'Billing model not configured';
    const lowerType = type.toLowerCase();
    if (lowerType.includes('package')) return 'Fixed monthly cost with included trips and kilometers';
    if (lowerType.includes('trip')) return 'Pay per trip and per kilometer traveled';
    if (lowerType.includes('hybrid')) return 'Base package with additional trip charges';
    return 'Custom billing model';
  };

  const renderBillingDetails = (vendor) => {
    // Check if we have detailed billing model info
    // Currently the API might just return a string for billing_model
    const model = vendor.billingModel || vendor.billing_model;

    if (!model || typeof model === 'string') {
      return (
        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
          Detailed billing configuration is not available for this vendor yet.
          <br />
          Current Model: <span className="font-semibold text-gray-700">{model || 'Not Configured'}</span>
        </div>
      );
    }

    const { type, details } = model;

    // ... (rest of the render logic if we had details, kept for future use or if API updates)
    // For now, we'll just show the fallback above if it's a string

    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        Billing details structure not recognized.
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing Model Visibility</h1>
          <p className="text-gray-500 mt-1">
            View and understand your vendor billing models and contract details
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
          <Info className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-800">Read-only view for transparency</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        /* Vendors Overview */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendors.map((vendor) => {
            const modelType = typeof vendor.billingModel === 'string' ? vendor.billingModel : vendor.billingModel?.type;
            const Icon = getBillingModelIcon(modelType);

            return (
              <Card key={vendor.vendorId || vendor.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{vendor.vendorName || vendor.vendor_name || vendor.name}</CardTitle>
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardDescription>
                    {getBillingModelDescription(modelType)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Model Type:</span>
                      <span className="font-medium capitalize">{modelType || 'Not Configured'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Contract Valid:</span>
                      <span className="font-medium text-green-600">{vendor.contractStatus || 'Active'}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detailed View */}
      {selectedVendor && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedVendor.vendorName || selectedVendor.vendor_name || selectedVendor.name} - Billing Details</CardTitle>
                <CardDescription>
                  Complete billing model configuration and contract terms
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedVendor(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Billing Model Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Billing Model Configuration</h3>
              {renderBillingDetails(selectedVendor)}
            </div>

            {/* Contract Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contract Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Contract Terms</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Start Date:</span>
                      <span className="font-medium">{selectedVendor.contractStart || selectedVendor.contract_start || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>End Date:</span>
                      <span className="font-medium">{selectedVendor.contractEnd || selectedVendor.contract_end || 'N/A'}</span>
                    </div>
                    <div>
                      <span>Status:</span>
                      <p className="font-medium mt-1">{selectedVendor.contractStatus || 'Active'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
