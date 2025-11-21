import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  Star, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Calendar,
  Car,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Timer,
  Route
} from 'lucide-react';

export function EmployeeDashboard() {
  const [dashboardData, setDashboardData] = useState({
    personalInfo: {},
    incentiveSummary: {},
    recentTrips: [],
    monthlyStats: {},
    delaysOvertime: {}
  });

  useEffect(() => {
    // Mock employee dashboard data
    const mockData = {
      personalInfo: {
        name: 'John Doe',
        empId: 'EMP001',
        department: 'Engineering',
        company: 'TechCorp',
        joinDate: '2023-01-15'
      },
      incentiveSummary: {
        totalEarned: 4750,
        thisMonth: 1250,
        extraHours: 850,
        lateShifts: 400,
        weekendWork: 300,
        overtimeBonus: 200
      },
      recentTrips: [
        {
          id: 'T001',
          date: '2024-11-21',
          time: '09:15 AM',
          vendor: 'Swift Transport',
          driver: 'Ramesh Kumar',
          pickup: 'Electronic City Phase 1',
          drop: 'Koramangala Office',
          distance: 15.2,
          duration: 45,
          scheduledDuration: 35,
          overtime: 10,
          incentiveEarned: 75,
          status: 'completed',
          notes: 'Late start due to traffic'
        },
        {
          id: 'T002',
          date: '2024-11-21',
          time: '07:30 PM',
          vendor: 'City Cabs',
          driver: 'Suresh Patel',
          pickup: 'Koramangala Office',
          drop: 'Electronic City Phase 1',
          distance: 15.8,
          duration: 50,
          scheduledDuration: 35,
          overtime: 15,
          incentiveEarned: 125,
          status: 'completed',
          notes: 'Extra hours worked - eligible for overtime bonus'
        },
        {
          id: 'T003',
          date: '2024-11-20',
          time: '09:00 AM',
          vendor: 'Metro Rides',
          driver: 'Manoj Singh',
          pickup: 'Electronic City Phase 1',
          drop: 'Koramangala Office',
          distance: 14.5,
          duration: 35,
          scheduledDuration: 35,
          overtime: 0,
          incentiveEarned: 0,
          status: 'completed',
          notes: 'Regular commute - no overtime'
        }
      ],
      monthlyStats: {
        totalTrips: 42,
        onTimeTrips: 38,
        delayedTrips: 4,
        avgCommuteDuration: 38,
        totalCommuteTime: 1596, // in minutes
        workingDaysAttended: 21,
        overtimeDays: 8
      },
      delaysOvertime: {
        avgDelay: 12, // minutes
        maxDelay: 45,
        totalOvertimeHours: 24.5,
        overtimeReasons: [
          { reason: 'Client meeting extended', count: 12, hours: 18 },
          { reason: 'Project deadline', count: 8, hours: 14.5 },
          { reason: 'Team collaboration', count: 5, hours: 8 }
        ]
      }
    };
    setDashboardData(mockData);
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {dashboardData.personalInfo?.name || 'Employee'}!
          </h1>
          <p className="text-gray-500 mt-1">
            Track your commute, incentives, and work performance
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today's Date</p>
          <p className="font-medium">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Incentive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Incentives
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.incentiveSummary?.totalEarned || 0)}</div>
            <p className="text-xs text-green-600 mt-1">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.incentiveSummary?.thisMonth || 0)}</div>
            <p className="text-xs text-blue-600 mt-1">
              Current month earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Trips
            </CardTitle>
            <Car className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.monthlyStats?.totalTrips || 0}</div>
            <p className="text-xs text-purple-600 mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overtime Hours
            </CardTitle>
            <Timer className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.delaysOvertime?.totalOvertimeHours || 0}h</div>
            <p className="text-xs text-orange-600 mt-1">
              Extra hours worked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Incentive Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Incentive Breakdown</CardTitle>
          <CardDescription>
            Your earnings breakdown for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Extra Hours Bonus</span>
                </div>
                <span className="font-bold text-green-600">
                  {formatCurrency(dashboardData.incentiveSummary?.extraHours || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Late Shift Bonus</span>
                </div>
                <span className="font-bold text-blue-600">
                  {formatCurrency(dashboardData.incentiveSummary?.lateShifts || 0)}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Weekend Work</span>
                </div>
                <span className="font-bold text-purple-600">
                  {formatCurrency(dashboardData.incentiveSummary?.weekendWork || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Overtime Bonus</span>
                </div>
                <span className="font-bold text-orange-600">
                  {formatCurrency(dashboardData.incentiveSummary?.overtimeBonus || 0)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>
              Your commute and attendance statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Working Days Attended:</span>
                <span className="font-bold">{dashboardData.monthlyStats?.workingDaysAttended || 0} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">On-time Trips:</span>
                <span className="font-bold text-green-600">
                  {dashboardData.monthlyStats?.onTimeTrips || 0} / {dashboardData.monthlyStats?.totalTrips || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Commute:</span>
                <span className="font-bold">{dashboardData.monthlyStats?.avgCommuteDuration || 0} mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Commute Time:</span>
                <span className="font-bold">{Math.round((dashboardData.monthlyStats?.totalCommuteTime || 0) / 60)} hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overtime Analysis</CardTitle>
            <CardDescription>
              Breakdown of your overtime work patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.delaysOvertime?.overtimeReasons?.map((reason, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{reason.reason}</p>
                    <p className="text-sm text-gray-500">{reason.count} instances</p>
                  </div>
                  <span className="font-bold text-orange-600">{reason.hours}h</span>
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
            Your latest commute details and incentive earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="text-right">Overtime</TableHead>
                  <TableHead className="text-right">Incentive</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recentTrips?.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatDate(trip.date)}</div>
                        <div className="text-sm text-gray-500">{trip.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-green-600">{trip.pickup}</div>
                        <div className="text-gray-400 my-1">↓</div>
                        <div className="text-red-600">{trip.drop}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trip.vendor}</div>
                        <div className="text-sm text-gray-500">{trip.driver}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">{trip.duration} mins</span>
                      <div className="text-xs text-gray-500">({trip.scheduledDuration} scheduled)</div>
                    </TableCell>
                    <TableCell className="text-right">
                      {trip.overtime > 0 ? (
                        <span className="font-medium text-orange-600">+{trip.overtime} mins</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {trip.incentiveEarned > 0 ? (
                        <span className="font-bold text-green-600">{formatCurrency(trip.incentiveEarned)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(trip.status)}`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
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
