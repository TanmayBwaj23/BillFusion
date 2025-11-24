import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';
import { Package, Car, Layers, DollarSign, Save, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export function VendorBillingConfig() {
  const { user } = useAuthStore();
  const [billingModels, setBillingModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('package');
  const [currentModel, setCurrentModel] = useState(null);
  const [editedModel, setEditedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBillingModels = async () => {
      try {
        const token = useAuthStore.getState().accessToken;
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/vendor/billing/models`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setBillingModels(data);
          // Set first model as default
          const packageModel = data.find(m => m.model_type === 'package');
          if (packageModel) {
            setCurrentModel(packageModel);
            setEditedModel(JSON.parse(JSON.stringify(packageModel)));
          }
        }
      } catch (error) {
        console.error('Error fetching billing models:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBillingModels();
  }, [user]);

  useEffect(() => {
    const model = billingModels.find(m => m.model_type === selectedModel);
    if (model) {
      setCurrentModel(model);
      setEditedModel(JSON.parse(JSON.stringify(model)));
    }
  }, [selectedModel, billingModels]);

  const handleFieldChange = (section, field, value) => {
    setEditedModel(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: parseFloat(value) || value }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = useAuthStore.getState().accessToken;

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/vendor/billing/models/${editedModel.model_type}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedModel)
        }
      );

      if (response.ok) {
        alert('Billing model updated successfully!');
        // Refresh models
        const modelsResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/vendor/billing/models`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (modelsResponse.ok) {
          const data = await modelsResponse.json();
          setBillingModels(data);
        }
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const getModelIcon = (type) => {
    switch (type) {
      case 'package': return Package;
      case 'trip': return Car;
      case 'hybrid': return Layers;
      default: return DollarSign;
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing Configuration</h1>
        <p className="text-gray-500 mt-1">Manage your billing models and rates</p>
      </div>

      {/* Model Type Tabs */}
      <div className="flex space-x-2 border-b">
        {billingModels.map(model => {
          const Icon = getModelIcon(model.model_type);
          return (
            <button
              key={model.model_type}
              onClick={() => setSelectedModel(model.model_type)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${selectedModel === model.model_type
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium capitalize">{model.model_type} Model</span>
            </button>
          );
        })}
      </div>

      {/* Model Configuration */}
      {editedModel && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract ID</label>
                  <input
                    type="text"
                    value={editedModel.contract_id || ''}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                  <input
                    type="text"
                    value={editedModel.effective_date?.split('T')[0] || ''}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Renewal Date</label>
                  <input
                    type="text"
                    value={editedModel.renewal_date?.split('T')[0] || 'N/A'}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Model Fields */}
          {editedModel.model_type === 'package' && editedModel.details && (
            <Card>
              <CardHeader>
                <CardTitle>Package Configuration</CardTitle>
                <CardDescription>Monthly fixed cost with included trips and kilometers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                    <h4 className="font-medium text-blue-900 mb-3">Base Package</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Fixed Cost (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.monthly_fixed}
                        onChange={(e) => handleFieldChange('details', 'monthly_fixed', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Included Trips</label>
                      <input
                        type="number"
                        value={editedModel.details.included_trips}
                        onChange={(e) => handleFieldChange('details', 'included_trips', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Included Kilometers</label>
                      <input
                        type="number"
                        value={editedModel.details.included_km}
                        onChange={(e) => handleFieldChange('details', 'included_km', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg space-y-3">
                    <h4 className="font-medium text-orange-900 mb-3">Overage Rates</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Extra Trip Rate (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.overage_per_trip}
                        onChange={(e) => handleFieldChange('details', 'overage_per_trip', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Extra KM Rate (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.overage_per_km}
                        onChange={(e) => handleFieldChange('details', 'overage_per_km', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg space-y-3">
                    <h4 className="font-medium text-green-900 mb-3">Multipliers</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Peak Hour Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editedModel.details.peak_hour_multiplier}
                        onChange={(e) => handleFieldChange('details', 'peak_hour_multiplier', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Weekend Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editedModel.details.weekend_multiplier}
                        onChange={(e) => handleFieldChange('details', 'weekend_multiplier', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Holiday Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editedModel.details.holiday_multiplier}
                        onChange={(e) => handleFieldChange('details', 'holiday_multiplier', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg space-y-3">
                    <h4 className="font-medium text-purple-900 mb-3">Bonuses</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Night Shift Bonus (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.night_shift_bonus}
                        onChange={(e) => handleFieldChange('details', 'night_shift_bonus', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trip Model Fields */}
          {editedModel.model_type === 'trip' && editedModel.details && (
            <Card>
              <CardHeader>
                <CardTitle>Trip Configuration</CardTitle>
                <CardDescription>Pay per trip and per kilometer - no monthly fixed cost</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                    <h4 className="font-medium text-blue-900 mb-3">Base Rates</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Per Trip Rate (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.per_trip}
                        onChange={(e) => handleFieldChange('details', 'per_trip', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Per KM Rate (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.per_km}
                        onChange={(e) => handleFieldChange('details', 'per_km', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Per Hour Rate (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.per_hour}
                        onChange={(e) => handleFieldChange('details', 'per_hour', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Minimum Fare (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.minimum_fare}
                        onChange={(e) => handleFieldChange('details', 'minimum_fare', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg space-y-3">
                    <h4 className="font-medium text-green-900 mb-3">Multipliers & Charges</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Peak Hour Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editedModel.details.peak_hour_multiplier}
                        onChange={(e) => handleFieldChange('details', 'peak_hour_multiplier', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Weekend Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editedModel.details.weekend_multiplier}
                        onChange={(e) => handleFieldChange('details', 'weekend_multiplier', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Waiting Charges (₹/min)</label>
                      <input
                        type="number"
                        value={editedModel.details.waiting_charges}
                        onChange={(e) => handleFieldChange('details', 'waiting_charges', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Cancellation Fee (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.cancellation_fee}
                        onChange={(e) => handleFieldChange('details', 'cancellation_fee', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hybrid Model Fields */}
          {editedModel.model_type === 'hybrid' && editedModel.details && (
            <Card>
              <CardHeader>
                <CardTitle>Hybrid Configuration</CardTitle>
                <CardDescription>Base package plus additional per-trip charges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                    <h4 className="font-medium text-blue-900 mb-3">Base Package</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Base Package Cost (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.base_package}
                        onChange={(e) => handleFieldChange('details', 'base_package', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Included Trips</label>
                      <input
                        type="number"
                        value={editedModel.details.included_trips}
                        onChange={(e) => handleFieldChange('details', 'included_trips', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Additional Per Trip (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.additional_per_trip}
                        onChange={(e) => handleFieldChange('details', 'additional_per_trip', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg space-y-3">
                    <h4 className="font-medium text-orange-900 mb-3">Hybrid Logic</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Switch Threshold (trips)</label>
                      <input
                        type="number"
                        value={editedModel.details.switch_threshold}
                        onChange={(e) => handleFieldChange('details', 'switch_threshold', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Hybrid Discount (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editedModel.details.hybrid_discount * 100}
                        onChange={(e) => handleFieldChange('details', 'hybrid_discount', e.target.value / 100)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Bulk Trip Discount (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editedModel.details.bulk_trip_discount * 100}
                        onChange={(e) => handleFieldChange('details', 'bulk_trip_discount', e.target.value / 100)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Per KM Rate (₹)</label>
                      <input
                        type="number"
                        value={editedModel.details.per_km}
                        onChange={(e) => handleFieldChange('details', 'per_km', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Caps Section */}
          {editedModel.caps && (
            <Card>
              <CardHeader>
                <CardTitle>Operational Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Trips/Day</label>
                    <input
                      type="number"
                      value={editedModel.caps.max_trips_per_day}
                      onChange={(e) => handleFieldChange('caps', 'max_trips_per_day', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max KM/Trip</label>
                    <input
                      type="number"
                      value={editedModel.caps.max_km_per_trip}
                      onChange={(e) => handleFieldChange('caps', 'max_km_per_trip', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Hours/Trip</label>
                    <input
                      type="number"
                      value={editedModel.caps.max_hours_per_trip}
                      onChange={(e) => handleFieldChange('caps', 'max_hours_per_trip', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Vehicle Capacity</label>
                    <input
                      type="number"
                      value={editedModel.caps.vehicle_capacity_limit}
                      onChange={(e) => handleFieldChange('caps', 'vehicle_capacity_limit', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="px-6"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
