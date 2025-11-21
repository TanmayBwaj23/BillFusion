import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/utils';
import { X, Calculator, Save, Eye } from 'lucide-react';

export function BillingConfigModal({ vendor, onClose, onSave }) {
  const [selectedModel, setSelectedModel] = useState(vendor.billingModel.type);
  const [config, setConfig] = useState({
    package: {
      monthlyFixed: vendor.billingModel.monthlyFixed || 300000,
      includedTrips: vendor.billingModel.includedTrips || 40,
      includedKm: vendor.billingModel.includedKm || 800,
      overagePerTrip: 150,
      overagePerKm: 12
    },
    trip: {
      perTrip: vendor.billingModel.perTrip || 200,
      perKm: vendor.billingModel.perKm || 15,
      peakHourMultiplier: 1.3,
      weekendMultiplier: 1.5
    },
    hybrid: {
      basePackage: vendor.billingModel.basePackage || 150000,
      includedTrips: vendor.billingModel.includedTrips || 20,
      additionalPerTrip: vendor.billingModel.additionalPerTrip || 180,
      switchThreshold: 60
    }
  });

  const [simulation, setSimulation] = useState({
    trips: 45,
    distance: 900,
    peakHours: 30,
    weekendTrips: 5
  });

  const calculateEstimatedCost = () => {
    const trips = simulation.trips;
    const distance = simulation.distance;
    
    switch (selectedModel) {
      case 'package':
        const packageConfig = config.package;
        let cost = packageConfig.monthlyFixed;
        if (trips > packageConfig.includedTrips) {
          cost += (trips - packageConfig.includedTrips) * packageConfig.overagePerTrip;
        }
        if (distance > packageConfig.includedKm) {
          cost += (distance - packageConfig.includedKm) * packageConfig.overagePerKm;
        }
        return cost;
        
      case 'trip':
        const tripConfig = config.trip;
        return (trips * tripConfig.perTrip) + (distance * tripConfig.perKm);
        
      case 'hybrid':
        const hybridConfig = config.hybrid;
        let hybridCost = hybridConfig.basePackage;
        if (trips > hybridConfig.includedTrips) {
          hybridCost += (trips - hybridConfig.includedTrips) * hybridConfig.additionalPerTrip;
        }
        return hybridCost;
        
      default:
        return 0;
    }
  };

  const handleSave = () => {
    const newConfig = {
      type: selectedModel,
      ...config[selectedModel]
    };
    onSave(newConfig);
  };

  const updateConfig = (model, field, value) => {
    setConfig(prev => ({
      ...prev,
      [model]: {
        ...prev[model],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const estimatedCost = calculateEstimatedCost();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Configure Billing Model - {vendor.name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Billing Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedModel === 'package' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedModel('package')}
                >
                  <h4 className="font-medium">Package Model</h4>
                  <p className="text-sm text-gray-500">Fixed monthly cost with included trips/km</p>
                </div>
                
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedModel === 'trip' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedModel('trip')}
                >
                  <h4 className="font-medium">Trip Model</h4>
                  <p className="text-sm text-gray-500">Pay per trip and per kilometer</p>
                </div>
                
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedModel === 'hybrid' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedModel('hybrid')}
                >
                  <h4 className="font-medium">Hybrid Model</h4>
                  <p className="text-sm text-gray-500">Base package + additional charges</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedModel === 'package' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Fixed Cost
                      </label>
                      <input
                        type="number"
                        value={config.package.monthlyFixed}
                        onChange={(e) => updateConfig('package', 'monthlyFixed', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Included Trips
                      </label>
                      <input
                        type="number"
                        value={config.package.includedTrips}
                        onChange={(e) => updateConfig('package', 'includedTrips', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Included Kilometers
                      </label>
                      <input
                        type="number"
                        value={config.package.includedKm}
                        onChange={(e) => updateConfig('package', 'includedKm', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {selectedModel === 'trip' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Per Trip Rate
                      </label>
                      <input
                        type="number"
                        value={config.trip.perTrip}
                        onChange={(e) => updateConfig('trip', 'perTrip', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Per Kilometer Rate
                      </label>
                      <input
                        type="number"
                        value={config.trip.perKm}
                        onChange={(e) => updateConfig('trip', 'perKm', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {selectedModel === 'hybrid' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Package Cost
                      </label>
                      <input
                        type="number"
                        value={config.hybrid.basePackage}
                        onChange={(e) => updateConfig('hybrid', 'basePackage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Included Trips
                      </label>
                      <input
                        type="number"
                        value={config.hybrid.includedTrips}
                        onChange={(e) => updateConfig('hybrid', 'includedTrips', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Per Trip
                      </label>
                      <input
                        type="number"
                        value={config.hybrid.additionalPerTrip}
                        onChange={(e) => updateConfig('hybrid', 'additionalPerTrip', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Simulation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Cost Simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Trips
                    </label>
                    <input
                      type="number"
                      value={simulation.trips}
                      onChange={(e) => setSimulation(prev => ({ ...prev, trips: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Distance (km)
                    </label>
                    <input
                      type="number"
                      value={simulation.distance}
                      onChange={(e) => setSimulation(prev => ({ ...prev, distance: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Estimated Monthly Cost:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(estimatedCost)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
