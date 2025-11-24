import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Calendar, Filter, Download, Search, Eye, MapPin, Clock, DollarSign, FileText } from 'lucide-react';
import { clientApi } from '../../services/clientApi';
import useAuthStore from '../../store/authStore';

export function TripMonitoring() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    vendor: '',
    employee: '',
    tripType: ''
  });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    totalCost: 0,
    overLimit: 0,
    incentivesApplied: 0,
    incentiveCount: 0
  });

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const apiFilters = {};
        if (filters.dateRange.start) apiFilters.start_date = filters.dateRange.start;
        if (filters.dateRange.end) apiFilters.end_date = filters.dateRange.end;
        if (filters.vendor) apiFilters.vendor_id = filters.vendor;
        if (filters.employee) apiFilters.employee_id = filters.employee;
        if (filters.tripType) apiFilters.trip_type = filters.tripType;
        apiFilters.limit = 50; // Default limit

        const tripData = await clientApi.trips.search(apiFilters);
        const fetchedTrips = tripData.trips || [];
        setTrips(fetchedTrips);

        // Calculate summary from fetched trips (or ideally fetch summary from API)
        // For now, calculating client-side based on the fetched page
        const newSummary = {
          total: tripData.totalCount || fetchedTrips.length,
          totalCost: fetchedTrips.reduce((sum, trip) => sum + (trip.cost?.total || 0), 0),
          overLimit: fetchedTrips.filter(t => t.tripType === 'over_limit').length,
          incentivesApplied: fetchedTrips.reduce((sum, trip) => sum + (trip.incentive?.amount || 0), 0),
          incentiveCount: fetchedTrips.filter(t => t.incentive?.applied).length
        };
        setSummary(newSummary);

      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTrips();
    }
  }, [filters, user]);

  const getTripTypeBadge = (type) => {
    switch (type) {
      case 'package_included':
        return 'bg-green-100 text-green-800';
      case 'over_limit':
        return 'bg-red-100 text-red-800';
      case 'incentive_applied':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTripTypeLabel = (type) => {
    if (!type) return 'Standard';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
      vendor: '',
      employee: '',
      tripType: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Monitoring</h1>
          <p className="text-gray-500 mt-1">
            Monitor and validate all employee trips across vendors
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={clearFilters}>
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
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
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-blue-600 mt-1">Filtered results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Cost
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalCost)}</div>
            <p className="text-xs text-green-600 mt-1">All trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Over-limit Trips
            </CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.overLimit}</div>
            <p className="text-xs text-yellow-600 mt-1">
              {summary.total > 0 ? ((summary.overLimit / summary.total) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Incentives Applied
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.incentivesApplied)}</div>
            <p className="text-xs text-blue-600 mt-1">{summary.incentiveCount} trips eligible</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Trips</CardTitle>
          <CardDescription>
            Filter trips by date range, vendor, employee, or trip type
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
                Vendor
              </label>
              <select
                value={filters.vendor}
                onChange={(e) => handleFilterChange('vendor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Vendors</option>
                {/* Ideally fetch vendors list here too, but hardcoding for now or need to pass vendors prop */}
                <option value="1">Swift Transport</option>
                <option value="2">City Cabs</option>
                <option value="3">Metro Rides</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee
              </label>
              <input
                type="text"
                placeholder="Employee ID"
                value={filters.employee}
                onChange={(e) => handleFilterChange('employee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Type
              </label>
              <select
                value={filters.tripType}
                onChange={(e) => handleFilterChange('tripType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="package_included">Package Included</option>
                <option value="over_limit">Over Limit</option>
                <option value="incentive_applied">Incentive Applied</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trips Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
          <CardDescription>
            Detailed view of all trips matching your filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p>Loading trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No trips found for the selected filters</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead className="text-right">Distance</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips.map((trip) => (
                    <TableRow key={trip.tripId || trip.trip_id}>
                      <TableCell className="font-medium">{trip.tripId || trip.trip_id}</TableCell>
                      <TableCell>{formatDate(trip.date)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{trip.employee?.name}</div>
                          <div className="text-sm text-gray-500">{trip.employee?.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{trip.vendor?.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{trip.route?.pickup}</div>
                          <div className="text-gray-500">→ {trip.route?.drop}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{trip.route?.distanceKm || trip.route?.distance_km} km</TableCell>
                      <TableCell className="text-right">{trip.time?.durationMinutes || trip.time?.duration_minutes} min</TableCell>
                      <TableCell className="text-right">{formatCurrency(trip.cost?.total || 0)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTripTypeBadge(trip.tripType || trip.trip_type)}`}>
                          {getTripTypeLabel(trip.tripType || trip.trip_type)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
