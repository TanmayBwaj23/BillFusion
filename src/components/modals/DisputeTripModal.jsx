import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';
import { X, AlertTriangle, Upload, FileText } from 'lucide-react';

export function DisputeTripModal({ trip, onClose, onSubmit }) {
  const [disputeData, setDisputeData] = useState({
    category: '',
    reason: '',
    description: '',
    expectedAmount: '',
    evidence: []
  });

  const disputeCategories = [
    { value: 'distance', label: 'Incorrect Distance Calculation' },
    { value: 'duration', label: 'Incorrect Duration Calculation' },
    { value: 'route', label: 'Wrong Route Taken' },
    { value: 'charges', label: 'Incorrect Additional Charges' },
    { value: 'cancellation', label: 'Unfair Cancellation' },
    { value: 'other', label: 'Other Issue' }
  ];

  const handleInputChange = (field, value) => {
    setDisputeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      tripId: trip.id,
      ...disputeData,
      submittedAt: new Date().toISOString()
    });
  };

  const isFormValid = disputeData.category && disputeData.reason && disputeData.description;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
            Dispute Trip - {trip.id}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Trip Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Date & Time:</span>
                  <p className="font-medium">{formatDate(trip.date)} at {trip.time}</p>
                </div>
                <div>
                  <span className="text-gray-600">Route:</span>
                  <p className="font-medium">{trip.route.pickup} → {trip.route.drop}</p>
                </div>
                <div>
                  <span className="text-gray-600">Distance:</span>
                  <p className="font-medium">{trip.distance} km</p>
                </div>
                <div>
                  <span className="text-gray-600">Current Amount:</span>
                  <p className="font-medium">{formatCurrency(trip.billing.totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dispute Category *
            </label>
            <select
              value={disputeData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select dispute category</option>
              {disputeCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brief Reason *
            </label>
            <input
              type="text"
              value={disputeData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="e.g., GPS shows different distance than billed"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={disputeData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              placeholder="Provide detailed explanation of the issue with supporting facts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Expected Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Amount (Optional)
            </label>
            <input
              type="number"
              step="0.01"
              value={disputeData.expectedAmount}
              onChange={(e) => handleInputChange('expectedAmount', e.target.value)}
              placeholder="Enter what you believe the correct amount should be"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Current billed amount: {formatCurrency(trip.billing.totalAmount)}
            </p>
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Evidence (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload screenshots, GPS logs, or other evidence
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PNG, JPG, PDF up to 10MB each
                    </span>
                  </label>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> Disputes are reviewed within 48-72 hours. 
                  Please provide accurate information and supporting evidence. 
                  False disputes may affect your vendor rating.
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
              className="bg-red-600 hover:bg-red-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Submit Dispute
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
