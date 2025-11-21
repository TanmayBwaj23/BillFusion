import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Calendar, Filter, Download, Search, Eye, MapPin, Clock, DollarSign } from 'lucide-react';

export function TripMonitoring() {
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    vendor: '',
    employee: '',
    tripType: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock trip data
    const mockTrips = [
      {
        id: 1,
        date: '2024-11-20',
        employee: {
          name: 'John Doe',
          empId: 'EMP001',
          department: 'Engineering'
        },
        vendor: 'Swift Transport',
        route: {
          pickup: 'Electronic City',
          drop: 'Koramangala',
          distance: 15.2
        },
        time: {
          pickup: '09:15 AM',
          drop: '10:05 AM',
          duration: '50 mins'
        },
        cost: {
          base: 180,
          extra: 25,
          total: 205
        },
        tripType: 'package_included',
        billingModel: 'Package',
        incentive: {
          applied: false,
          amount: 0,
          reason: null
        },
        overLimit: {
          km: 0,
          hours: 0
        }
      },
      {
        id: 2,
        date: '2024-11-20',
        employee: {
          name: 'Jane Smith',
          empId: 'EMP002',
          department: 'Marketing'
        },
        vendor: 'City Cabs',
        route: {
          pickup: 'Whitefield',
          drop: 'Brigade Road',
          distance: 22.8
        },
        time: {
          pickup: '08:30 AM',
          drop: '09:45 AM',
          duration: '75 mins'
        },
        cost: {
          base: 200,
          extra: 45,
          total: 245
        },
        tripType: 'over_limit',
        billingModel: 'Trip',
        incentive: {
          applied: true,
          amount: 50,
          reason: 'Extra kilometers'
        },
        overLimit: {
          km: 5.8,
          hours: 0.25
        }
      }
    ];
    setTrips(mockTrips);
  }, []);

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
    switch (type) {
      case 'package_included':
        return 'Package Included';
      case 'over_limit':
        return 'Over Limit';
      case 'incentive_applied':
        return 'Incentive Applied';
      default:
        return 'Standard';
    }
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
          <Button>
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Trips Today
            </CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-green-600 mt-1">+5.2% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Cost Today
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(8750)}</div>
            <p className="text-xs text-red-600 mt-1">+12.3% from yesterday</p>
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
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-yellow-600 mt-1">16.7% of total trips</p>
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
            <div className="text-2xl font-bold">{formatCurrency(450)}</div>
            <p className="text-xs text-blue-600 mt-1">12 trips eligible</p>
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
                <option value="Swift Transport">Swift Transport</option>
                <option value="City Cabs">City Cabs</option>
                <option value="Metro Rides">Metro Rides</option>
              </select>
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
            Detailed view of all trips with cost breakdown and validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead>Trip Type</TableHead>
                  <TableHead>Incentive</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatDate(trip.date)}</div>
                        <div className="text-sm text-gray-500">
                          {trip.time.pickup} - {trip.time.drop}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trip.employee.name}</div>
                        <div className="text-sm text-gray-500">
                          {trip.employee.empId} | {trip.employee.department}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{trip.vendor}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          <span className="text-green-600">{trip.route.pickup}</span>
                          <span className="mx-1">→</span>
                          <span className="text-red-600">{trip.route.drop}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{trip.time.duration}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">{trip.route.distance} km</span>
                      {trip.overLimit.km > 0 && (
                        <div className="text-xs text-red-600">
                          +{trip.overLimit.km} km over
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium">{formatCurrency(trip.cost.total)}</div>
                        {trip.cost.extra > 0 && (
                          <div className="text-xs text-orange-600">
                            +{formatCurrency(trip.cost.extra)} extra
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTripTypeBadge(trip.tripType)}`}>
                        {getTripTypeLabel(trip.tripType)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {trip.incentive.applied ? (
                        <div>
                          <div className="text-sm font-medium text-green-600">
                            {formatCurrency(trip.incentive.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {trip.incentive.reason}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No incentive</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
