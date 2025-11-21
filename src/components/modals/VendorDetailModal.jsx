import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/utils';
import { X, Phone, Mail, MapPin, Calendar, Users, Car, DollarSign } from 'lucide-react';

export function VendorDetailModal({ vendor, onClose }) {
  const getBillingModelDetails = (model) => {
    switch (model.type) {
      case 'package':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Monthly Fixed Cost:</span>
              <span className="font-medium">{formatCurrency(model.monthlyFixed)}</span>
            </div>
            <div className="flex justify-between">
              <span>Included Trips:</span>
              <span className="font-medium">{model.includedTrips}</span>
            </div>
            <div className="flex justify-between">
              <span>Included Kilometers:</span>
              <span className="font-medium">{model.includedKm} km</span>
            </div>
          </div>
        );
      case 'trip':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Per Trip Rate:</span>
              <span className="font-medium">{formatCurrency(model.perTrip)}</span>
            </div>
            <div className="flex justify-between">
              <span>Per Kilometer Rate:</span>
              <span className="font-medium">{formatCurrency(model.perKm)}</span>
            </div>
          </div>
        );
      case 'hybrid':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Package:</span>
              <span className="font-medium">{formatCurrency(model.basePackage)}</span>
            </div>
            <div className="flex justify-between">
              <span>Included Trips:</span>
              <span className="font-medium">{model.includedTrips}</span>
            </div>
            <div className="flex justify-between">
              <span>Additional Per Trip:</span>
              <span className="font-medium">{formatCurrency(model.additionalPerTrip)}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">{vendor.name} - Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{vendor.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{vendor.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{vendor.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Employee Coverage</p>
                    <p className="font-medium">{vendor.employeeCount} employees</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Car className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Monthly Trips</p>
                    <p className="font-medium">{vendor.monthlyTrips.toLocaleString()} trips</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Monthly Spend</p>
                    <p className="font-medium">{formatCurrency(vendor.monthlySpend)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Model Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing Model Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Current Model: {vendor.billingModel.type.charAt(0).toUpperCase() + vendor.billingModel.type.slice(1)}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vendor.performance >= 90 ? 'bg-green-100 text-green-800' : 
                    vendor.performance >= 80 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {vendor.performance}% Performance
                  </span>
                </div>
                {getBillingModelDetails(vendor.billingModel)}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Contract Renewed</p>
                    <p className="text-xs text-gray-500">15 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Car className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Performance Target Achieved</p>
                    <p className="text-xs text-gray-500">1 month ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Billing Model Updated</p>
                    <p className="text-xs text-gray-500">2 months ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Edit Vendor
          </Button>
        </div>
      </div>
    </div>
  );
}
