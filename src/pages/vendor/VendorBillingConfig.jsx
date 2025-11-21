import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';
import { 
  Eye, 
  MessageSquare, 
  Info, 
  Package, 
  Car, 
  Layers, 
  DollarSign, 
  Send,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { BillingModelSuggestionModal } from '../../components/modals/BillingModelSuggestionModal';

export function VendorBillingConfig() {
  const [billingModel, setBillingModel] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  useEffect(() => {
    // Mock vendor billing configuration
    const mockBillingModel = {
      type: 'package',
      vendorName: 'Swift Transport',
      contractId: 'CON-2024-001',
      effectiveDate: '2024-01-01',
      renewalDate: '2024-12-31',
      details: {
        monthlyFixed: 340000,
        includedTrips: 40,
        includedKm: 800,
        overagePerTrip: 150,
        overagePerKm: 12,
        peakHourMultiplier: 1.2,
        weekendMultiplier: 1.5,
        nightShiftBonus: 50,
        holidayMultiplier: 2.0
      },
      caps: {
        maxTripsPerDay: 15,
        maxKmPerTrip: 50,
        maxHoursPerTrip: 3,
        vehicleCapacityLimit: 4
      },
      incentiveRules: {
        extraHours: { threshold: 10, rate: 75 },
        extraKm: { threshold: 20, rate: 18 },
        performanceBonus: { target: 95, amount: 5000 },
        loyaltyBonus: { months: 12, percentage: 0.05 }
      },
      penalties: {
        latePickup: { threshold: 15, amount: 100 },
        cancellation: { amount: 200 },
        noShow: { amount: 300 }
      }
    };

    const mockSuggestions = [
      {
        id: 1,
        type: 'rate_adjustment',
        title: 'Peak Hour Rate Adjustment',
        description: 'Current peak hour multiplier (1.2x) seems low compared to industry standard (1.5x)',
        currentValue: '1.2x',
        suggestedValue: '1.5x',
        reason: 'Industry benchmarking and increased operational costs during peak hours',
        status: 'pending',
        submittedDate: '2024-11-15',
        category: 'rates'
      },
      {
        id: 2,
        type: 'limit_adjustment',
        title: 'Included KM Increase',
        description: 'Request to increase monthly included kilometers based on route optimization',
        currentValue: '800 km',
        suggestedValue: '900 km',
        reason: 'Routes have been optimized, allowing for more efficient coverage with same resources',
        status: 'approved',
        submittedDate: '2024-10-28',
        approvedDate: '2024-11-05',
        category: 'limits'
      },
      {
        id: 3,
        type: 'incentive_structure',
        title: 'Performance Bonus Threshold',
        description: 'Adjust performance bonus target to reflect realistic service levels',
        currentValue: '95% performance',
        suggestedValue: '92% performance',
        reason: 'Current threshold is too high considering external factors like traffic and weather',
        status: 'rejected',
        submittedDate: '2024-10-10',
        rejectedDate: '2024-10-18',
        rejectionReason: 'Performance standards must maintain high quality service',
        category: 'incentives'
      }
    ];

    setBillingModel(mockBillingModel);
    setSuggestions(mockSuggestions);
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

  const getSuggestionStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuggestionIcon = (status) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'rejected':
        return AlertCircle;
      case 'under_review':
        return Info;
      default:
        return Info;
    }
  };

  const renderBillingModelDetails = () => {
    if (!billingModel.details) return null;

    const { type, details } = billingModel;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Package Details</h4>
            <div className="space-y-2 text-sm">
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
            <h4 className="font-medium text-orange-900 mb-3">Overage Rates</h4>
            <div className="space-y-2 text-sm">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-3">Bonuses & Multipliers</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Weekend Multiplier:</span>
                <span className="font-medium">{details.weekendMultiplier}x</span>
              </div>
              <div className="flex justify-between">
                <span>Night Shift Bonus:</span>
                <span className="font-medium">{formatCurrency(details.nightShiftBonus)}</span>
              </div>
              <div className="flex justify-between">
                <span>Holiday Multiplier:</span>
                <span className="font-medium">{details.holidayMultiplier}x</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-3">Vehicle Limits</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Max Trips/Day:</span>
                <span className="font-medium">{billingModel.caps?.maxTripsPerDay || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Max KM/Trip:</span>
                <span className="font-medium">{billingModel.caps?.maxKmPerTrip || 0} km</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle Capacity:</span>
                <span className="font-medium">{billingModel.caps?.vehicleCapacityLimit || 0} passengers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing Model Configuration</h1>
          <p className="text-gray-500 mt-1">
            View your current billing model and submit suggestions for changes
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
          <Eye className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-800">Read-only view with suggestion rights</span>
        </div>
      </div>

      {/* Current Billing Model Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {React.createElement(getBillingModelIcon(billingModel.type), { className: "w-8 h-8 text-blue-600" })}
              <div>
                <CardTitle className="text-xl">
                  {billingModel.type?.charAt(0).toUpperCase() + billingModel.type?.slice(1)} Model
                </CardTitle>
                <CardDescription>
                  {getBillingModelDescription(billingModel.type)}
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setShowSuggestionModal(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Suggest Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Contract ID</p>
              <p className="font-bold text-lg">{billingModel.contractId}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Effective Date</p>
              <p className="font-bold text-lg">{billingModel.effectiveDate}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Renewal Date</p>
              <p className="font-bold text-lg">{billingModel.renewalDate}</p>
            </div>
          </div>
          
          {renderBillingModelDetails()}
        </CardContent>
      </Card>

      {/* Incentive Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Incentive Structure</CardTitle>
          <CardDescription>
            Current incentive rules and performance targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(billingModel.incentiveRules || {}).map(([key, rule]) => (
              <div key={key} className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 capitalize mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(rule).map(([ruleKey, ruleValue]) => (
                    <div key={ruleKey} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{ruleKey}:</span>
                      <span className="font-medium">
                        {typeof ruleValue === 'number' && ruleKey.includes('rate')
                          ? formatCurrency(ruleValue)
                          : typeof ruleValue === 'number' && ruleKey.includes('amount')
                          ? formatCurrency(ruleValue)
                          : typeof ruleValue === 'number' && ruleKey.includes('percentage')
                          ? `${ruleValue * 100}%`
                          : ruleValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Penalty Structure */}
      {billingModel.penalties && (
        <Card>
          <CardHeader>
            <CardTitle>Penalty Structure</CardTitle>
            <CardDescription>
              Penalty charges for service violations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(billingModel.penalties).map(([key, penalty]) => (
                <div key={key} className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900 capitalize mb-2">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className="space-y-1 text-sm">
                    {typeof penalty === 'object' ? (
                      Object.entries(penalty).map(([penaltyKey, penaltyValue]) => (
                        <div key={penaltyKey} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{penaltyKey}:</span>
                          <span className="font-medium">
                            {penaltyKey.includes('amount') ? formatCurrency(penaltyValue) : penaltyValue}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">{formatCurrency(penalty)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestion History */}
      <Card>
        <CardHeader>
          <CardTitle>Suggestion History</CardTitle>
          <CardDescription>
            Your previous suggestions and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion) => {
              const StatusIcon = getSuggestionIcon(suggestion.status);
              return (
                <div key={suggestion.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <StatusIcon className={`w-5 h-5 ${
                          suggestion.status === 'approved' ? 'text-green-600' :
                          suggestion.status === 'pending' ? 'text-yellow-600' :
                          suggestion.status === 'rejected' ? 'text-red-600' :
                          'text-blue-600'
                        }`} />
                        <h4 className="font-medium">{suggestion.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSuggestionStatusBadge(suggestion.status)}`}>
                          {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{suggestion.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Current Value:</span> {suggestion.currentValue}
                        </div>
                        <div>
                          <span className="font-medium">Suggested Value:</span> {suggestion.suggestedValue}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Reason:</span> {suggestion.reason}
                      </p>
                      {suggestion.rejectionReason && (
                        <div className="mt-2 p-3 bg-red-50 rounded border-l-4 border-red-400">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Rejection Reason:</span> {suggestion.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs text-gray-500">
                    <span>Submitted: {suggestion.submittedDate}</span>
                    {suggestion.approvedDate && <span>Approved: {suggestion.approvedDate}</span>}
                    {suggestion.rejectedDate && <span>Rejected: {suggestion.rejectedDate}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Suggestion Modal */}
      {showSuggestionModal && (
        <BillingModelSuggestionModal
          billingModel={billingModel}
          onClose={() => setShowSuggestionModal(false)}
          onSubmit={(suggestionData) => {
            console.log('Suggestion submitted:', suggestionData);
            setShowSuggestionModal(false);
            // Add new suggestion to the list
            setSuggestions(prev => [{
              id: Date.now(),
              ...suggestionData,
              status: 'pending',
              submittedDate: new Date().toISOString().split('T')[0]
            }, ...prev]);
          }}
        />
      )}
    </div>
  );
}
