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
  Download,
  MapPin,
  Clock,
  Car,
  AlertTriangle,
  CheckCircle,
  Timer,
  FileText
} from 'lucide-react';

export function EmployeeTripHistory() {
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    vendor: '',
    tripType: ''
  });

  useEffect(() => {
    // Mock comprehensive trip history for employee
    const mockTrips = [
      {
        id: 'T001',
        date: '2024-11-21',
        time: '09:15 AM',
        type: 'Morning Commute',
        vendor: {
          name: 'Swift Transport',
          driver: 'Ramesh Kumar',
          vehicle: 'KA 01 AB 1234'
        },
        route: {
          pickup: 'Electronic City Phase 1',
          drop: 'Koramangala Office',
          distance: 15.2
        },
        timing: {
          scheduledDuration: 35,
          actualDuration: 45,
          overtime: 10,
          delayReason: 'Heavy traffic on Hosur Road'
        },
        workDetails: {
          shiftStart: '09:30 AM',
          shiftEnd: '06:30 PM',
          actualEnd: '08:15 PM',
          extraHours: 1.75,
          workType: 'Regular + Client Meeting'
        },
        incentives: {
          overtimeBonus: 75,
          extraHourBonus: 87.5,
          total: 162.5
        },
        notes: 'Extended work due to client presentation. Overtime approved by manager.',
        status: 'completed'
      },
      {
        id: 'T002',
        date: '2024-11-21',
        time: '08:30 PM',
        type: 'Evening Return',
        vendor: {
          name: 'City Cabs',
          driver: 'Suresh Patel',
          vehicle: 'KA 02 CD 5678'
        },
        route: {
          pickup: 'Koramangala Office',
          drop: 'Electronic City Phase 1',
          distance: 15.8
        },
        timing: {
          scheduledDuration: 35,
          actualDuration: 40,
          overtime: 5,
          delayReason: 'Normal evening traffic'
        },
        workDetails: {
          shiftStart: '09:30 AM',
          shiftEnd: '06:30 PM',
          actualEnd: '08:15 PM',
          extraHours: 1.75,
          workType: 'Regular + Client Meeting'
        },
        incentives: {
          lateShiftBonus: 50,
          extraHourBonus: 87.5,
          total: 137.5
        },
        notes: 'Late return due to extended work hours.',
        status: 'completed'
      },
      {
        id: 'T003',
        date: '2024-11-20',
        time: '09:00 AM',
        type: 'Morning Commute',
        vendor: {
          name: 'Metro Rides',
          driver: 'Manoj Singh',
          vehicle: 'KA 03 EF 9012'
        },
        route: {
          pickup: 'Electronic City Phase 1',
          drop: 'Koramangala Office',
          distance: 14.5
        },
        timing: {
          scheduledDuration: 35,
          actualDuration: 35,
          overtime: 0,
          delayReason: null
        },
        workDetails: {
          shiftStart: '09:30 AM',
          shiftEnd: '06:30 PM',
          actualEnd: '06:30 PM',
          extraHours: 0,
          workType: 'Regular'
        },
        incentives: {
          total: 0
        },
        notes: 'Regular working day - no overtime.',
        status: 'completed'
      },
      {
        id: 'T004',
        date: '2024-11-19',
        time: '07:00 AM',
        type: 'Early Morning',
        vendor: {
          name: 'Swift Transport',
          driver: 'Ramesh Kumar',
          vehicle: 'KA 01 AB 1234'
        },
        route: {
          pickup: 'Electronic City Phase 1',
          drop: 'Koramangala Office',
          distance: 15.2
        },
        timing: {
          scheduledDuration: 35,
          actualDuration: 32,
          overtime: 0,
          delayReason: null
        },
        workDetails: {
          shiftStart: '07:30 AM',
          shiftEnd: '08:30 PM',
          actualEnd: '08:30 PM',
          extraHours: 4,
          workType: 'Project Deadline Rush'
        },
        incentives: {
          earlyShiftBonus: 100,
          extraHourBonus: 200,
          total: 300
        },
        notes: 'Early start for project deadline. 13-hour work day approved.',
        status: 'completed'
      },
      {
        id: 'T005',
        date: '2024-11-18',
        time: '09:15 AM',
        type: 'Morning Commute',
        vendor: {
          name: 'City Cabs',
          driver: 'Rajesh Gupta',
          vehicle: 'KA 04 GH 3456'
        },
        route: {
          pickup: 'Electronic City Phase 1',
          drop: 'Koramangala Office',
          distance: 15.2
        },
        timing: {
          scheduledDuration: 35,
          actualDuration: 55,
          overtime: 20,
          delayReason: 'Vehicle breakdown, replacement arranged'
        },
        workDetails: {
          shiftStart: '09:30 AM',
          shiftEnd: '06:30 PM',
          actualEnd: '06:30 PM',
          extraHours: 0,
          workType: 'Regular'
        },
        incentives: {
          total: 0
        },
        notes: 'Delay due to vehicle issue. No penalty to employee.',
        status: 'completed'
      }
    ];
    setTrips(mockTrips);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getTripTypeColor = (type) => {
    switch (type) {
      case 'Morning Commute':
        return 'bg-green-100 text-green-800';
      case 'Evening Return':
        return 'bg-blue-100 text-blue-800';
      case 'Early Morning':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOvertimeColor = (overtime) => {
    if (overtime > 15) return 'text-red-600';
    if (overtime > 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip History</h1>
          <p className="text-gray-500 mt-1">
            Detailed logs of your daily commute and work-related trips
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export History
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
            <p className="text-xs text-blue-600 mt-1">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overtime Trips
            </CardTitle>
            <Timer className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.filter(t => t.timing.overtime > 0).length}
            </div>
            <p className="text-xs text-orange-600 mt-1">With delays</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Incentives
            </CardTitle>
            <div className="h-4 w-4 text-green-600">₹</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(trips.reduce((sum, trip) => sum + (trip.incentives?.total || 0), 0))}
            </div>
            <p className="text-xs text-green-600 mt-1">Earned from trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Extra Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.reduce((sum, trip) => sum + (trip.workDetails?.extraHours || 0), 0)}h
            </div>
            <p className="text-xs text-purple-600 mt-1">Additional work</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Trip History</CardTitle>
          <CardDescription>
            Filter your trips by date, vendor, or trip type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor
              </label>
              <select
                value={filters.vendor}
                onChange={(e) => handleFilterChange('vendor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                <option value="Morning Commute">Morning Commute</option>
                <option value="Evening Return">Evening Return</option>
                <option value="Early Morning">Early Morning</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Trip Logs</CardTitle>
          <CardDescription>
            Complete history of your trips with work details and incentive calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {trips.map((trip) => (
              <div key={trip.id} className="border rounded-lg p-6 bg-white shadow-sm">
                {/* Trip Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Car className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{trip.id}</h3>
                      <p className="text-gray-600">{formatDate(trip.date)} at {trip.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTripTypeColor(trip.type)}`}>
                      {trip.type}
                    </span>
                    {trip.incentives?.total > 0 && (
                      <p className="text-lg font-bold text-green-600 mt-1">
                        {formatCurrency(trip.incentives.total)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Trip Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Route & Vendor */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Trip Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">{trip.route.pickup}</span>
                      </div>
                      <div className="ml-6 border-l-2 border-gray-200 pl-4 py-1">
                        <span className="text-gray-600">{trip.route.distance} km</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">{trip.route.drop}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="font-medium">{trip.vendor.name}</p>
                      <p className="text-sm text-gray-600">{trip.vendor.driver}</p>
                      <p className="text-xs text-gray-500">{trip.vendor.vehicle}</p>
                    </div>
                  </div>

                  {/* Timing Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Timing Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Scheduled Duration:</span>
                        <span>{trip.timing.scheduledDuration} mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actual Duration:</span>
                        <span className={trip.timing.overtime > 0 ? 'text-orange-600 font-medium' : ''}>
                          {trip.timing.actualDuration} mins
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overtime:</span>
                        <span className={getOvertimeColor(trip.timing.overtime)}>
                          {trip.timing.overtime > 0 ? `+${trip.timing.overtime} mins` : 'On time'}
                        </span>
                      </div>
                      {trip.timing.delayReason && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                          <span className="font-medium">Delay Reason:</span> {trip.timing.delayReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Work Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Work Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Work Type:</span>
                        <span className="font-medium">{trip.workDetails.workType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shift:</span>
                        <span>{trip.workDetails.shiftStart} - {trip.workDetails.shiftEnd}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actual End:</span>
                        <span className={trip.workDetails.extraHours > 0 ? 'text-orange-600 font-medium' : ''}>
                          {trip.workDetails.actualEnd}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra Hours:</span>
                        <span className="font-medium text-green-600">
                          {trip.workDetails.extraHours > 0 ? `+${trip.workDetails.extraHours}h` : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incentive Breakdown */}
                {trip.incentives?.total > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Incentive Breakdown</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(trip.incentives)
                        .filter(([key, value]) => key !== 'total' && value > 0)
                        .map(([key, value]) => (
                          <div key={key} className="text-center p-2 bg-green-50 rounded">
                            <p className="text-xs text-green-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="font-bold text-green-600">{formatCurrency(value)}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {trip.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{trip.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
