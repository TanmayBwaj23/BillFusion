import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Car, 
  DollarSign, 
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export function VendorReports() {
  const [reportData, setReportData] = useState({
    summary: {},
    tripReports: [],
    earningsReports: [],
    performanceReports: [],
    vehicleUtilization: []
  });
  const [selectedMonth, setSelectedMonth] = useState('2024-11');
  const [selectedReport, setSelectedReport] = useState('trip-summary');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Mock comprehensive vendor reports data
    const mockReportData = {
      summary: {
        month: '2024-11',
        totalTrips: 127,
        completedTrips: 119,
        disputedTrips: 3,
        cancelledTrips: 5,
        totalEarnings: 285750,
        avgRating: 4.6,
        utilizationRate: 87.5,
        onTimePerformance: 94.2
      },
      tripReports: [
        {
          date: '2024-11-21',
          totalTrips: 8,
          completedTrips: 7,
          cancelledTrips: 1,
          averageDistance: 18.5,
          totalEarnings: 2340,
          disputes: 0,
          vehicles: ['VH001', 'VH002']
        },
        {
          date: '2024-11-20',
          totalTrips: 12,
          completedTrips: 11,
          cancelledTrips: 1,
          averageDistance: 22.1,
          totalEarnings: 3150,
          disputes: 1,
          vehicles: ['VH001', 'VH002', 'VH003']
        },
        {
          date: '2024-11-19',
          totalTrips: 9,
          completedTrips: 9,
          cancelledTrips: 0,
          averageDistance: 15.8,
          totalEarnings: 2580,
          disputes: 0,
          vehicles: ['VH001', 'VH002']
        }
      ],
      earningsReports: [
        {
          month: '2024-11',
          baseEarnings: 220000,
          extraKmEarnings: 35500,
          extraHourEarnings: 18250,
          incentiveEarnings: 12000,
          totalEarnings: 285750,
          trips: 127,
          avgEarningsPerTrip: 2250
        },
        {
          month: '2024-10',
          baseEarnings: 205000,
          extraKmEarnings: 32000,
          extraHourEarnings: 16500,
          incentiveEarnings: 15000,
          totalEarnings: 268500,
          trips: 119,
          avgEarningsPerTrip: 2256
        },
        {
          month: '2024-09',
          baseEarnings: 198000,
          extraKmEarnings: 28200,
          extraHourEarnings: 15000,
          incentiveEarnings: 10000,
          totalEarnings: 251200,
          trips: 108,
          avgEarningsPerTrip: 2326
        }
      ],
      performanceReports: [
        {
          driver: 'Ramesh Kumar',
          vehicle: 'VH001',
          trips: 45,
          completedTrips: 43,
          rating: 4.8,
          onTime: 96.7,
          earnings: 12500,
          disputes: 0
        },
        {
          driver: 'Suresh Patel',
          vehicle: 'VH002',
          trips: 38,
          completedTrips: 36,
          rating: 4.5,
          onTime: 92.1,
          earnings: 10200,
          disputes: 1
        },
        {
          driver: 'Manoj Singh',
          vehicle: 'VH003',
          trips: 44,
          completedTrips: 40,
          rating: 4.4,
          onTime: 90.9,
          earnings: 11800,
          disputes: 2
        }
      ],
      vehicleUtilization: [
        {
          vehicle: 'VH001',
          type: 'Sedan',
          totalHours: 180,
          activeHours: 156,
          utilization: 86.7,
          trips: 45,
          earnings: 12500,
          maintenanceHours: 4
        },
        {
          vehicle: 'VH002',
          type: 'SUV',
          totalHours: 180,
          activeHours: 142,
          utilization: 78.9,
          trips: 38,
          earnings: 10200,
          maintenanceHours: 8
        },
        {
          vehicle: 'VH003',
          type: 'Sedan',
          totalHours: 180,
          activeHours: 165,
          utilization: 91.7,
          trips: 44,
          earnings: 11800,
          maintenanceHours: 2
        }
      ]
    };
    setReportData(mockReportData);
  }, [selectedMonth]);

  const generateReport = async (format, reportType) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert(`${reportType} report in ${format.toUpperCase()} format generated successfully!`);
    }, 2000);
  };

  const reportTypes = [
    { value: 'trip-summary', label: 'Trip Summary Report', icon: Car },
    { value: 'earnings-breakdown', label: 'Earnings Breakdown Report', icon: DollarSign },
    { value: 'performance-analysis', label: 'Performance Analysis Report', icon: TrendingUp },
    { value: 'vehicle-utilization', label: 'Vehicle Utilization Report', icon: BarChart3 }
  ];

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'trip-summary':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Daily Trip Summary Report</CardTitle>
              <CardDescription>
                Comprehensive daily trip performance and earnings summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total Trips</TableHead>
                      <TableHead className="text-right">Completed</TableHead>
                      <TableHead className="text-right">Cancelled</TableHead>
                      <TableHead className="text-right">Avg Distance</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                      <TableHead className="text-right">Disputes</TableHead>
                      <TableHead>Vehicles Used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.tripReports.map((report) => (
                      <TableRow key={report.date}>
                        <TableCell className="font-medium">{formatDate(report.date)}</TableCell>
                        <TableCell className="text-right">{report.totalTrips}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-green-600">{report.completedTrips}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-red-600">{report.cancelledTrips}</span>
                        </TableCell>
                        <TableCell className="text-right">{report.averageDistance} km</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(report.totalEarnings)}
                        </TableCell>
                        <TableCell className="text-right">
                          {report.disputes > 0 ? (
                            <span className="text-red-600">{report.disputes}</span>
                          ) : (
                            <span className="text-green-600">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {report.vehicles.map((vehicle, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {vehicle}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );

      case 'earnings-breakdown':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings Breakdown Report</CardTitle>
              <CardDescription>
                Detailed monthly earnings analysis by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Base Earnings</TableHead>
                      <TableHead className="text-right">Extra KM</TableHead>
                      <TableHead className="text-right">Extra Hours</TableHead>
                      <TableHead className="text-right">Incentives</TableHead>
                      <TableHead className="text-right">Total Earnings</TableHead>
                      <TableHead className="text-right">Trips</TableHead>
                      <TableHead className="text-right">Avg/Trip</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.earningsReports.map((report) => (
                      <TableRow key={report.month}>
                        <TableCell className="font-medium">{report.month}</TableCell>
                        <TableCell className="text-right">{formatCurrency(report.baseEarnings)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(report.extraKmEarnings)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(report.extraHourEarnings)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(report.incentiveEarnings)}</TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(report.totalEarnings)}
                        </TableCell>
                        <TableCell className="text-right">{report.trips}</TableCell>
                        <TableCell className="text-right">{formatCurrency(report.avgEarningsPerTrip)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );

      case 'performance-analysis':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Driver Performance Analysis Report</CardTitle>
              <CardDescription>
                Individual driver performance metrics and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="text-right">Trips</TableHead>
                      <TableHead className="text-right">Completion Rate</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                      <TableHead className="text-right">On-Time %</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                      <TableHead className="text-right">Disputes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.performanceReports.map((report) => (
                      <TableRow key={report.driver}>
                        <TableCell className="font-medium">{report.driver}</TableCell>
                        <TableCell>{report.vehicle}</TableCell>
                        <TableCell className="text-right">{report.trips}</TableCell>
                        <TableCell className="text-right">
                          <span className={`${
                            (report.completedTrips / report.trips) * 100 >= 95 
                              ? 'text-green-600' 
                              : 'text-yellow-600'
                          }`}>
                            {Math.round((report.completedTrips / report.trips) * 100)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <span className="mr-1">⭐</span>
                            <span>{report.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`${
                            report.onTime >= 95 ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {report.onTime}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(report.earnings)}
                        </TableCell>
                        <TableCell className="text-right">
                          {report.disputes > 0 ? (
                            <span className="text-red-600">{report.disputes}</span>
                          ) : (
                            <span className="text-green-600">0</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );

      case 'vehicle-utilization':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Utilization Report</CardTitle>
              <CardDescription>
                Fleet utilization metrics and maintenance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Total Hours</TableHead>
                      <TableHead className="text-right">Active Hours</TableHead>
                      <TableHead className="text-right">Utilization</TableHead>
                      <TableHead className="text-right">Trips</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                      <TableHead className="text-right">Maintenance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.vehicleUtilization.map((report) => (
                      <TableRow key={report.vehicle}>
                        <TableCell className="font-medium">{report.vehicle}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell className="text-right">{report.totalHours}h</TableCell>
                        <TableCell className="text-right">{report.activeHours}h</TableCell>
                        <TableCell className="text-right">
                          <span className={`${
                            report.utilization >= 85 ? 'text-green-600' : 
                            report.utilization >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {report.utilization}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{report.trips}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(report.earnings)}
                        </TableCell>
                        <TableCell className="text-right">{report.maintenanceHours}h</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Reports</h1>
          <p className="text-gray-500 mt-1">
            Comprehensive operational and financial reports for vendor analysis
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024-11">November 2024</option>
            <option value="2024-10">October 2024</option>
            <option value="2024-09">September 2024</option>
          </select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
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
            <div className="text-2xl font-bold">{reportData.summary?.totalTrips || 0}</div>
            <p className="text-xs text-blue-600 mt-1">
              {reportData.summary?.completedTrips || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reportData.summary?.totalEarnings || 0)}</div>
            <p className="text-xs text-green-600 mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Rating
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary?.avgRating || 0}</div>
            <p className="text-xs text-purple-600 mt-1">
              Customer satisfaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fleet Utilization
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary?.utilizationRate || 0}%</div>
            <p className="text-xs text-orange-600 mt-1">
              Average utilization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Report Type</CardTitle>
          <CardDescription>
            Choose the type of report you want to generate and view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((reportType) => {
              const Icon = reportType.icon;
              return (
                <button
                  key={reportType.value}
                  onClick={() => setSelectedReport(reportType.value)}
                  className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                    selectedReport === reportType.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${
                      selectedReport === reportType.value ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <div>
                      <h4 className={`font-medium ${
                        selectedReport === reportType.value ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {reportType.label}
                      </h4>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {renderReportContent()}

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Report</CardTitle>
          <CardDescription>
            Download the current report in your preferred format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => generateReport('pdf', selectedReport)} 
              disabled={generating}
              className="h-20 flex-col"
            >
              <FileText className="w-8 h-8 mb-2" />
              <span>Export as PDF</span>
            </Button>
            <Button 
              onClick={() => generateReport('excel', selectedReport)} 
              disabled={generating}
              className="h-20 flex-col"
              variant="outline"
            >
              <Download className="w-8 h-8 mb-2" />
              <span>Export as Excel</span>
            </Button>
            <Button 
              onClick={() => generateReport('csv', selectedReport)} 
              disabled={generating}
              className="h-20 flex-col"
              variant="outline"
            >
              <Download className="w-8 h-8 mb-2" />
              <span>Export as CSV</span>
            </Button>
          </div>
          {generating && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-600">Generating report... Please wait.</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
