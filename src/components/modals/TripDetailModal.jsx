import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';
import { X, MapPin, Clock, Car, User, Phone, DollarSign, Route } from 'lucide-react';

export function TripDetailModal({ trip, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Trip Details - {trip.id}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Trip Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Trip Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip ID:</span>
                  <span className="font-medium">{trip.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">{formatDate(trip.date)} at {trip.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{trip.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {trip.duration > 0 ? `${trip.duration} minutes` : 'Not completed'}
                  </span>
                </div>
                {trip.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed At:</span>
                    <span className="font-medium">{trip.completedAt}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Client & Employee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Client:</span>
                  <span className="font-medium">{trip.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee:</span>
                  <span className="font-medium">{trip.employee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee ID:</span>
                  <span className="font-medium">{trip.empId}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                Route Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-green-700">Pickup Location</p>
                    <p className="text-gray-600">{trip.route.pickup}</p>
                  </div>
                </div>
                
                {trip.route.waypoints && trip.route.waypoints.length > 0 && (
                  <div className="ml-1.5">
                    <div className="border-l-2 border-gray-300 pl-6 py-2">
                      <p className="font-medium text-gray-700">Route via:</p>
                      <div className="space-y-1">
                        {trip.route.waypoints.map((waypoint, index) => (
                          <p key={index} className="text-gray-600 text-sm">• {waypoint}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-red-700">Drop Location</p>
                    <p className="text-gray-600">{trip.route.drop}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle & Driver Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Car className="w-5 h-5 mr-2 text-orange-600" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle ID:</span>
                  <span className="font-medium">{trip.vehicle.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{trip.vehicle.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number:</span>
                  <span className="font-medium">{trip.vehicle.number}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="w-5 h-5 mr-2 text-indigo-600" />
                  Driver Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver ID:</span>
                  <span className="font-medium">{trip.driver.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{trip.driver.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phone:</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{trip.driver.phone}</span>
                    <Button variant="outline" size="sm">
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Billing Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Amount:</span>
                      <span className="font-medium">{formatCurrency(trip.billing.baseAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extra KM ({trip.billing.extraKm} km @ {formatCurrency(trip.billing.extraKmRate)}/km):</span>
                      <span className="font-medium">{formatCurrency(trip.billing.extraKmAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extra Hours ({trip.billing.extraHours}h @ {formatCurrency(trip.billing.extraHourRate)}/h):</span>
                      <span className="font-medium">{formatCurrency(trip.billing.extraHourAmount)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Night Charges:</span>
                      <span className="font-medium">{formatCurrency(trip.billing.nightCharges)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Holiday Charges:</span>
                      <span className="font-medium">{formatCurrency(trip.billing.holidayCharges)}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">{formatCurrency(trip.billing.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Information (if any) */}
          {trip.disputeStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Route className="w-5 h-5 mr-2 text-red-600" />
                  Dispute Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-800 font-medium">Dispute Status: Active</p>
                  <p className="text-red-700 mt-2">{trip.disputeReason}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}
