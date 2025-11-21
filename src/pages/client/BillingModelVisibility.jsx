import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/utils';
import { Eye, Info, Package, Car, Layers, DollarSign, Clock, MapPin } from 'lucide-react';

export function BillingModelVisibility() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    // Mock vendor billing models data
    const mockVendors = [
      {
        id: 1,
        name: 'Swift Transport',
        billingModel: {
          type: 'package',
          details: {
            monthlyFixed: 340000,
            includedTrips: 40,
            includedKm: 800,
            overagePerTrip: 150,
            overagePerKm: 12,
            peakHourMultiplier: 1.2,
            weekendMultiplier: 1.5
          },
          incentiveRules: {
            extraHours: { threshold: 10, rate: 50 },
            lateNightShifts: { multiplier: 1.3 },
            weekendTrips: { bonus: 75 }
          }
        },
        contractDetails: {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          renewalTerms: 'Auto-renewal with 90 days notice',
          slaTargets: {
            responseTime: '15 minutes',
            onTimePerformance: '95%',
            customerSatisfaction: '4.5/5'
          }
        },
        currentUsage: {
          tripsUsed: 45,
          kmUsed: 890,
          overageTrips: 5,
          overageKm: 90
        }
      },
      {
        id: 2,
        name: 'City Cabs',
        billingModel: {
          type: 'trip',
          details: {
            perTrip: 200,
            perKm: 15,
            minimumFare: 100,
            peakHourMultiplier: 1.3,
            weekendMultiplier: 1.5,
            waitingCharges: 5, // per minute
            cancellationFee: 50
          },
          incentiveRules: {
            extraKm: { threshold: 20, rate: 25 },
            lateNightShifts: { multiplier: 1.4 },
            publicHolidays: { bonus: 100 }
          }
        },
        contractDetails: {
          startDate: '2024-02-01',
          endDate: '2025-01-31',
          renewalTerms: 'Quarterly review with rate adjustments',
          slaTargets: {
            responseTime: '10 minutes',
            onTimePerformance: '92%',
            customerSatisfaction: '4.2/5'
          }
        },
        currentUsage: {
          tripsCompleted: 720,
          totalKm: 8950,
          averagePerTrip: 235,
          peakHourTrips: 180
        }
      },
      {
        id: 3,
        name: 'Metro Rides',
        billingModel: {
          type: 'hybrid',
          details: {
            basePackage: 150000,
            includedTrips: 20,
            additionalPerTrip: 180,
            switchThreshold: 60, // trips after which trip model applies
            hybridDiscount: 0.15, // 15% discount on overage
            bulkTripDiscount: 0.1 // 10% discount on bulk trips
          },
          incentiveRules: {
            volumeBonus: { threshold: 100, bonus: 200 },
            loyaltyDiscount: { months: 12, discount: 0.05 },
            performanceBonus: { target: 98, bonus: 500 }
          }
        },
        contractDetails: {
          startDate: '2024-03-01',
          endDate: '2025-02-28',
          renewalTerms: 'Annual renewal with performance review',
          slaTargets: {
            responseTime: '12 minutes',
            onTimePerformance: '96%',
            customerSatisfaction: '4.6/5'
          }
        },
        currentUsage: {
          packageTrips: 20,
          additionalTrips: 35,
          totalCost: 185300,
          discountApplied: 8265
        }
      }
    ];
    setVendors(mockVendors);
  }, []);

  const getBillingModelIcon = (type) => {
    switch (type) {
      case 'package':
        return Package;
      case 'trip':
        return Car;
      case 'hybrid':
        return Layers;
      default:
        return DollarSign;
    }
  };

  const getBillingModelDescription = (type) => {
    switch (type) {
      case 'package':
        return 'Fixed monthly cost with included trips and kilometers';
      case 'trip':
        return 'Pay per trip and per kilometer traveled';
      case 'hybrid':
        return 'Base package with additional trip charges';
      default:
        return 'Custom billing model';
    }
  };

  const renderBillingDetails = (vendor) => {
    const { type, details } = vendor.billingModel;

    switch (type) {
      case 'package':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Package Details</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Monthly Fixed Cost:</span>
                    <span className="font-medium">{formatCurrency(details.monthlyFixed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Included Trips:</span>
                    <span className="font-medium">{details.includedTrips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Included Kilometers:</span>
                    <span className="font-medium">{details.includedKm} km</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900">Overage Rates</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Extra Trip Rate:</span>
                    <span className="font-medium">{formatCurrency(details.overagePerTrip)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extra KM Rate:</span>
                    <span className="font-medium">{formatCurrency(details.overagePerKm)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Hour Multiplier:</span>
                    <span className="font-medium">{details.peakHourMultiplier}x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'trip':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Base Rates</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Per Trip Rate:</span>
                    <span className="font-medium">{formatCurrency(details.perTrip)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Per KM Rate:</span>
                    <span className="font-medium">{formatCurrency(details.perKm)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Fare:</span>
                    <span className="font-medium">{formatCurrency(details.minimumFare)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Additional Charges</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Peak Hour Multiplier:</span>
                    <span className="font-medium">{details.peakHourMultiplier}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekend Multiplier:</span>
                    <span className="font-medium">{details.weekendMultiplier}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waiting Charges:</span>
                    <span className="font-medium">{formatCurrency(details.waitingCharges)}/min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'hybrid':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900">Base Package</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Base Package Cost:</span>
                    <span className="font-medium">{formatCurrency(details.basePackage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Included Trips:</span>
                    <span className="font-medium">{details.includedTrips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Switch Threshold:</span>
                    <span className="font-medium">{details.switchThreshold} trips</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900">Additional Rates</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Additional Per Trip:</span>
                    <span className="font-medium">{formatCurrency(details.additionalPerTrip)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hybrid Discount:</span>
                    <span className="font-medium">{(details.hybridDiscount * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bulk Trip Discount:</span>
                    <span className="font-medium">{(details.bulkTripDiscount * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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

      {/* Vendors Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vendors.map((vendor) => {
          const Icon = getBillingModelIcon(vendor.billingModel.type);
          return (
            <Card key={vendor.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{vendor.name}</CardTitle>
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardDescription>
                  {getBillingModelDescription(vendor.billingModel.type)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Model Type:</span>
                    <span className="font-medium capitalize">{vendor.billingModel.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Contract Valid:</span>
                    <span className="font-medium text-green-600">Active</span>
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

      {/* Detailed View */}
      {selectedVendor && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedVendor.name} - Billing Details</CardTitle>
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

            {/* Incentive Rules */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Incentive Rules</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(selectedVendor.billingModel.incentiveRules).map(([key, rule]) => (
                    <div key={key} className="bg-white p-3 rounded border">
                      <h4 className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="mt-2 text-sm text-gray-600">
                        {typeof rule === 'object' ? (
                          Object.entries(rule).map(([ruleKey, ruleValue]) => (
                            <div key={ruleKey} className="flex justify-between">
                              <span className="capitalize">{ruleKey}:</span>
                              <span className="font-medium">
                                {typeof ruleValue === 'number' && ruleKey.includes('multiplier') 
                                  ? `${ruleValue}x`
                                  : typeof ruleValue === 'number' && (ruleKey.includes('rate') || ruleKey.includes('bonus'))
                                  ? formatCurrency(ruleValue)
                                  : ruleValue}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span>{rule}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                      <span className="font-medium">{selectedVendor.contractDetails.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>End Date:</span>
                      <span className="font-medium">{selectedVendor.contractDetails.endDate}</span>
                    </div>
                    <div>
                      <span>Renewal Terms:</span>
                      <p className="font-medium mt-1">{selectedVendor.contractDetails.renewalTerms}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">SLA Targets</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    {Object.entries(selectedVendor.contractDetails.slaTargets).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
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
