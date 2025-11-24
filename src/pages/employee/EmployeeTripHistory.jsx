import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';
import api from '../../api/axios';
import {
  Calendar,
  Filter,
  Download,
  MapPin,
  Clock,
  Car,
  Timer,
  FileText,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

// Helper function to determine trip tags from API data
const determineTagsFromTrip = (trip) => {
  const tags = [];
  if (trip.work_details?.extra_hours > 0) tags.push('Extra Hours');
  if (trip.timing?.overtime > 0) tags.push('Extra KM');
  if (trip.incentives?.total > 0) tags.push('Incentive Trip');
  if (tags.length === 0) tags.push('Regular');
  return tags;
};

export function EmployeeTripHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    vendor: '',
    tripType: '',
    status: ''
  });

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.dateRange.start) params.append('start_date', filters.dateRange.start);
        if (filters.dateRange.end) params.append('end_date', filters.dateRange.end);
        if (filters.vendor) params.append('vendor', filters.vendor);
        if (filters.status) params.append('status', filters.status);

        const response = await api.get(`/api/v1/employee/trips?${params.toString()}`);
        const data = response.data;

        const mappedTrips = data.trips.map(trip => ({
          id: trip.id,
          date: trip.date,
          time: trip.time,
          pickup: trip.route.pickup,
          drop: trip.route.drop,
          distance: trip.route.distance,
          duration: trip.timing.actual_duration,
          vendor: {
            name: trip.vendor.name,
            vehicle: trip.vendor.vehicle || 'N/A'
          },
          status: trip.status,
          tags: determineTagsFromTrip(trip),
          incentive: trip.incentives?.total || 0,
          incentiveReason: trip.incentives?.reason || '',
          route: {
            pickupAddress: trip.route.pickup,
            dropAddress: trip.route.drop,
            distance: trip.route.distance,
            duration: trip.timing.actual_duration
          },
          timing: {
            scheduled: trip.timing.scheduled_duration,
            actual: trip.timing.actual_duration,
            overtime: trip.timing.overtime
          },
          workDetails: trip.work_details,
          overLimit: trip.work_details?.extra_hours > 0,
          adminRemarks: trip.notes || ''
        }));

        setTrips(mappedTrips);
      } catch (err) {
        console.error('Failed to fetch trips:', err);
        setError('Failed to load trip history');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'disputed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-500 mt-1">
            History of all your commutes and business trips
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Trips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.tripType}
                onChange={(e) => handleFilterChange('tripType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Regular">Regular</option>
                <option value="Extra KM">Extra KM</option>
                <option value="Extra Hours">Extra Hours</option>
                <option value="Incentive Trip">Incentive Trip</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.vendor}
                onChange={(e) => handleFilterChange('vendor', e.target.value)}
              >
                <option value="">All Vendors</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip List */}
      <div className="space-y-4">
        {trips.length > 0 ? trips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Left Section: Time & Route */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {formatDate(trip.date)}
                      </h3>
                      <p className="text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {trip.time}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="w-0.5 h-8 bg-gray-200" />
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{trip.pickup}</p>
                        <p className="text-xs text-gray-500">{trip.route.pickupAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{trip.drop}</p>
                        <p className="text-xs text-gray-500">{trip.route.dropAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Section: Details & Stats */}
                <div className="flex-1 border-l pl-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Distance</p>
                      <p className="font-medium flex items-center gap-1">
                        {trip.distance} km
                        {trip.overLimit && (
                          <span className="text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded ml-1">
                            Over Limit
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">{trip.duration} mins</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Vendor</p>
                      <p className="font-medium text-sm">{trip.vendor.name}</p>
                      <p className="text-xs text-gray-400">{trip.vendor.vehicle}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {trip.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Incentive */}
                  {trip.incentive > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-700">Incentive Earned</p>
                      <p className="font-bold text-green-800">{formatCurrency(trip.incentive)}</p>
                      {trip.incentiveReason && (
                        <p className="text-xs text-green-600 mt-1">{trip.incentiveReason}</p>
                      )}
                    </div>
                  )}

                  {/* Admin Remarks */}
                  {trip.adminRemarks && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <Info className="w-4 h-4 inline mr-1" />
                      {trip.adminRemarks}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No trips found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
