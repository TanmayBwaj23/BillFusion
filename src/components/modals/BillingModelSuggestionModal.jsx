import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/utils';
import { X, MessageSquare, Send, Info } from 'lucide-react';

export function BillingModelSuggestionModal({ billingModel, onClose, onSubmit }) {
  const [suggestionData, setSuggestionData] = useState({
    type: '',
    title: '',
    category: '',
    currentValue: '',
    suggestedValue: '',
    reason: '',
    businessJustification: '',
    expectedImpact: ''
  });

  const suggestionTypes = [
    { value: 'rate_adjustment', label: 'Rate Adjustment' },
    { value: 'limit_adjustment', label: 'Limit Adjustment' },
    { value: 'incentive_structure', label: 'Incentive Structure' },
    { value: 'penalty_adjustment', label: 'Penalty Adjustment' },
    { value: 'new_feature', label: 'New Feature Request' }
  ];

  const categories = [
    { value: 'rates', label: 'Rates & Pricing' },
    { value: 'limits', label: 'Limits & Caps' },
    { value: 'incentives', label: 'Incentives & Bonuses' },
    { value: 'penalties', label: 'Penalties & Charges' },
    { value: 'operational', label: 'Operational Changes' }
  ];

  const handleInputChange = (field, value) => {
    setSuggestionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(suggestionData);
  };

  const isFormValid = suggestionData.type && suggestionData.title && suggestionData.category && 
                     suggestionData.currentValue && suggestionData.suggestedValue && suggestionData.reason;

  const getPrefilledSuggestions = () => {
    return [
      {
        title: 'Peak Hour Rate Increase',
        type: 'rate_adjustment',
        category: 'rates',
        currentValue: `${billingModel.details?.peakHourMultiplier || 1.2}x`,
        suggestedValue: '1.5x',
        reason: 'Industry standard peak hour rates are higher'
      },
      {
        title: 'Included KM Adjustment',
        type: 'limit_adjustment',
        category: 'limits',
        currentValue: `${billingModel.details?.includedKm || 800} km`,
        suggestedValue: '900 km',
        reason: 'Routes optimized for better efficiency'
      },
      {
        title: 'Performance Bonus Target',
        type: 'incentive_structure',
        category: 'incentives',
        currentValue: '95% performance target',
        suggestedValue: '92% performance target',
        reason: 'More realistic considering external factors'
      }
    ];
  };

  const handlePrefilledSelection = (suggestion) => {
    setSuggestionData(prev => ({
      ...prev,
      ...suggestion
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
            Suggest Billing Model Changes
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quick Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {getPrefilledSuggestions().map((suggestion, index) => (
                  <div 
                    key={index}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handlePrefilledSelection(suggestion)}
                  >
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600">
                      {suggestion.currentValue} → {suggestion.suggestedValue}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggestion Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggestion Type *
            </label>
            <select
              value={suggestionData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select suggestion type</option>
              {suggestionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={suggestionData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggestion Title *
            </label>
            <input
              type="text"
              value={suggestionData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Peak Hour Rate Adjustment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Current and Suggested Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Value *
              </label>
              <input
                type="text"
                value={suggestionData.currentValue}
                onChange={(e) => handleInputChange('currentValue', e.target.value)}
                placeholder="e.g., 1.2x multiplier"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suggested Value *
              </label>
              <input
                type="text"
                value={suggestionData.suggestedValue}
                onChange={(e) => handleInputChange('suggestedValue', e.target.value)}
                placeholder="e.g., 1.5x multiplier"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Change *
            </label>
            <textarea
              value={suggestionData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              rows={3}
              placeholder="Explain why this change is needed..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Business Justification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Justification
            </label>
            <textarea
              value={suggestionData.businessJustification}
              onChange={(e) => handleInputChange('businessJustification', e.target.value)}
              rows={3}
              placeholder="Provide business case and supporting data..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Expected Impact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Impact
            </label>
            <input
              type="text"
              value={suggestionData.expectedImpact}
              onChange={(e) => handleInputChange('expectedImpact', e.target.value)}
              placeholder="e.g., 5% increase in monthly payout"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Information Note */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> All suggestions are reviewed by the admin team within 5-7 business days. 
                  Approved changes will be implemented in the next billing cycle. 
                  You will be notified of the decision via email and in-app notification.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Suggestion
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
