import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  Calendar,
  Filter,
  Search,
  Eye,
  Flag,
  Download,
  MapPin,
  Clock,
  Car,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { TripDetailModal } from '../../components/modals/TripDetailModal';
import { DisputeTripModal } from '../../components/modals/DisputeTripModal';

import useAuthStore from '../../store/authStore';

export function TripManagement() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    status: '',
    vehicle: '',
    client: ''
  });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripDetail, setShowTripDetail] = useState(false);
  const [showDispute, setShowDispute] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = useAuthStore.getState().accessToken;

        if (!token) {
          console.error('No access token available');
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/vendor/trips`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTrips(data);
          console.log('✅ Trips data loaded:', data);
        } else {
          console.error('❌ Failed to fetch trips data, status:', response.status);
        }
      } catch (error) {
        console.error('❌ Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTrips();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPayoutStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewTrip = (trip) => {
    setSelectedTrip(trip);
    setShowTripDetail(true);
  };

  const handleDisputeTrip = (trip) => {
    setSelectedTrip(trip);
    setShowDispute(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      status: '',
      vehicle: '',
      client: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Management</h1>
          <p className="text-gray-500 mt-1">
            Monitor all trips assigned to your vehicles with detailed tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Trips
          </Button>
          <Button>
            <Flag className="w-4 h-4 mr-2" />
            Dispute Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Trips
            </CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-blue-600 mt-1">All assigned trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.filter(t => t.status === 'completed' && t.date === '2024-11-21').length}
            </div>
            <p className="text-xs text-green-600 mt-1">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Disputed Trips
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.filter(t => t.disputeStatus === 'disputed').length}
            </div>
            <p className="text-xs text-red-600 mt-1">Need resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Earnings
            </CardTitle>
            <div className="h-4 w-4 text-green-600">₹</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(trips.reduce((sum, trip) => sum + trip.billing.totalAmount, 0))}
            </div>
            <p className="text-xs text-green-600 mt-1">From all trips</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Trips</CardTitle>
          <CardDescription>
            Filter trips by date, status, vehicle, or client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle
              </label>
              <select
                value={filters.vehicle}
                onChange={(e) => handleFilterChange('vehicle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Vehicles</option>
                <option value="VH001">VH001 - Sedan</option>
                <option value="VH002">VH002 - SUV</option>
                <option value="VH003">VH003 - Sedan</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
          <CardDescription>
            Comprehensive view of all trips with billing and dispute options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip Info</TableHead>
                  <TableHead>Client & Employee</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Vehicle & Driver</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trip.id}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(trip.date)} at {trip.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trip.client}</div>
                        <div className="text-sm text-gray-500">
                          {trip.employee} ({trip.empId})
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-green-600">{trip.route.pickup}</div>
                        <div className="text-gray-400 my-1">↓</div>
                        <div className="text-red-600">{trip.route.drop}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trip.vehicle.id} - {trip.vehicle.type}</div>
                        <div className="text-sm text-gray-500">{trip.driver.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">{trip.distance} km</span>
                      {trip.duration > 0 && (
                        <div className="text-xs text-gray-500">{trip.duration} mins</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {trip.billing.totalAmount > 0 ? (
                        <div>
                          <div className="font-medium">{formatCurrency(trip.billing.totalAmount)}</div>
                          {trip.billing.extraKmAmount > 0 && (
                            <div className="text-xs text-orange-600">
                              +{formatCurrency(trip.billing.extraKmAmount)} extra
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(trip.status)}`}>
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </span>
                        {trip.disputeStatus && (
                          <div className="text-xs text-red-600 font-medium">Disputed</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPayoutStatusBadge(trip.payoutStatus)}`}>
                        {trip.payoutStatus.charAt(0).toUpperCase() + trip.payoutStatus.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTrip(trip)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {trip.status === 'completed' && !trip.disputeStatus && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisputeTrip(trip)}
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showTripDetail && selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          onClose={() => {
            setShowTripDetail(false);
            setSelectedTrip(null);
          }}
        />
      )}

      {showDispute && selectedTrip && (
        <DisputeTripModal
          trip={selectedTrip}
          onClose={() => {
            setShowDispute(false);
            setSelectedTrip(null);
          }}
          onSubmit={(disputeData) => {
            // Handle dispute submission
            console.log('Dispute submitted:', disputeData);
            setShowDispute(false);
            setSelectedTrip(null);
          }}
        />
      )}
    </div>
  );
}
