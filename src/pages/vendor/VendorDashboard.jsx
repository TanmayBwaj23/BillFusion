import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  Car, 
  CheckCircle, 
  Clock, 
  XCircle, 
  DollarSign, 
  TrendingUp, 
  Users, 
  MapPin,
  Star,
  AlertTriangle
} from 'lucide-react';
// import { TripStatusChart } from '../../components/charts/TripStatusChart';
// import { VehicleUtilizationChart } from '../../components/charts/VehicleUtilizationChart';
// import { PayoutTrendChart } from '../../components/charts/PayoutTrendChart';

export function VendorDashboard() {
  const [dashboardData, setDashboardData] = useState({
    todayTrips: {
      completed: 0,
      pending: 0,
      cancelled: 0,
      total: 0
    },
    payoutSummary: {
      totalPayout: 0,
      baseAmount: 0,
      incentives: 0,
      extraCharges: 0
    },
    vehicles: [],
    drivers: [],
    recentTrips: []
  });

  useEffect(() => {
    // Mock vendor dashboard data
    const mockData = {
      todayTrips: {
        completed: 28,
        pending: 7,
        cancelled: 2,
        total: 37
      },
      payoutSummary: {
        totalPayout: 85750,
        baseAmount: 68000,
        incentives: 12500,
        extraCharges: 5250
      },
      vehicles: [
        {
          id: 'VH001',
          type: 'Sedan',
          capacity: 4,
          driver: 'Ramesh Kumar',
          status: 'Active',
          todayTrips: 8,
          utilization: 89,
          rating: 4.7
        },
        {
          id: 'VH002',
          type: 'SUV',
          capacity: 7,
          driver: 'Suresh Patel',
          status: 'Active',
          todayTrips: 6,
          utilization: 75,
          rating: 4.5
        },
        {
          id: 'VH003',
          type: 'Sedan',
          capacity: 4,
          driver: 'Manoj Singh',
          status: 'Maintenance',
          todayTrips: 0,
          utilization: 0,
          rating: 4.6
        }
      ],
      drivers: [
        {
          id: 'DR001',
          name: 'Ramesh Kumar',
          vehicle: 'VH001',
          todayTrips: 8,
          rating: 4.7,
          earnings: 2250,
          status: 'Active'
        },
        {
          id: 'DR002',
          name: 'Suresh Patel',
          vehicle: 'VH002',
          todayTrips: 6,
          rating: 4.5,
          earnings: 1890,
          status: 'Active'
        }
      ],
      recentTrips: [
        {
          id: 'T001',
          date: '2024-11-21',
          time: '09:15 AM',
          client: 'TechCorp',
          employee: 'John Doe',
          route: 'Electronic City → Koramangala',
          distance: 15.2,
          duration: 45,
          amount: 285,
          status: 'completed',
          vehicle: 'VH001',
          driver: 'Ramesh Kumar'
        },
        {
          id: 'T002',
          date: '2024-11-21',
          time: '10:30 AM',
          client: 'StartupHub',
          employee: 'Jane Smith',
          route: 'Whitefield → Brigade Road',
          distance: 22.8,
          duration: 65,
          amount: 420,
          status: 'completed',
          vehicle: 'VH002',
          driver: 'Suresh Patel'
        },
        {
          id: 'T003',
          date: '2024-11-21',
          time: '02:15 PM',
          client: 'FinanceInc',
          employee: 'Mike Johnson',
          route: 'Indiranagar → Airport',
          distance: 28.5,
          duration: 0,
          amount: 0,
          status: 'pending',
          vehicle: 'VH001',
          driver: 'Ramesh Kumar'
        }
      ]
    };
    setDashboardData(mockData);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Monitor your fleet operations and track today's performance
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today's Date</p>
          <p className="font-medium">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Trips
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.todayTrips.completed}</div>
            <p className="text-xs text-green-600 mt-1">
              {Math.round((dashboardData.todayTrips.completed / dashboardData.todayTrips.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Trips
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.todayTrips.pending}</div>
            <p className="text-xs text-yellow-600 mt-1">
              In progress or assigned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cancelled Trips
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.todayTrips.cancelled}</div>
            <p className="text-xs text-red-600 mt-1">
              Cancelled today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Payout
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.payoutSummary.totalPayout)}</div>
            <p className="text-xs text-green-600 mt-1">
              +12.5% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Breakdown</CardTitle>
          <CardDescription>
            Detailed breakdown of today's earnings and incentives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Base Amount</span>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                {formatCurrency(dashboardData.payoutSummary.baseAmount)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900">Incentives</span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">
                {formatCurrency(dashboardData.payoutSummary.incentives)}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-900">Extra Charges</span>
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-900 mt-2">
                {formatCurrency(dashboardData.payoutSummary.extraCharges)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Utilization</CardTitle>
            <CardDescription>
              Current status and utilization of your fleet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{vehicle.id} - {vehicle.type}</p>
                      <p className="text-sm text-gray-500">{vehicle.driver}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vehicle.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{vehicle.utilization}% utilized</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Driver Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Performance</CardTitle>
            <CardDescription>
              Today's driver performance summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.drivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-gray-500">Vehicle: {driver.vehicle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{driver.rating}</span>
                    </div>
                    <p className="text-sm text-gray-500">{driver.todayTrips} trips</p>
                    <p className="text-sm font-medium text-green-600">{formatCurrency(driver.earnings)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trips</CardTitle>
          <CardDescription>
            Latest trip activities and status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recentTrips.map((trip) => {
                  const StatusIcon = getStatusIcon(trip.status);
                  return (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">{trip.id}</TableCell>
                      <TableCell>{trip.time}</TableCell>
                      <TableCell>{trip.client}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {trip.route.split(' → ').map((location, index, array) => (
                            <span key={index}>
                              {index === 0 ? (
                                <span className="text-green-600">{location}</span>
                              ) : (
                                <span className="text-red-600">{location}</span>
                              )}
                              {index < array.length - 1 && <span className="mx-1 text-gray-400">→</span>}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{trip.vehicle}</TableCell>
                      <TableCell className="text-right">{trip.distance} km</TableCell>
                      <TableCell className="text-right">
                        {trip.amount > 0 ? formatCurrency(trip.amount) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(trip.status)}`} />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(trip.status)}`}>
                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
