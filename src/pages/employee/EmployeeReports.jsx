import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  Clock,
  TrendingUp,
  Star,
  MapPin,
  Timer,
  BarChart3
} from 'lucide-react';

export function EmployeeReports() {
  const [reportData, setReportData] = useState({
    monthlyStatement: {},
    incentiveHistory: [],
    workSummary: {},
    tripSummary: {}
  });
  const [selectedMonth, setSelectedMonth] = useState('2024-11');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Mock comprehensive employee report data
    const mockReportData = {
      monthlyStatement: {
        month: '2024-11',
        employee: {
          name: 'John Doe',
          empId: 'EMP001',
          department: 'Engineering',
          company: 'TechCorp'
        },
        summary: {
          totalIncentives: 1250,
          workingDays: 21,
          totalTrips: 42,
          extraHours: 24.5,
          overtimeDays: 8
        },
        breakdown: {
          extraHoursBonus: 850,
          lateShiftBonus: 200,
          weekendWorkBonus: 150,
          overtimeBonus: 50
        },
        calculations: {
          extraHoursRate: 50, // per hour
          lateShiftRate: 25,  // per trip
          weekendMultiplier: 2.0,
          overtimeThreshold: 9 // hours per day
        }
      },
      incentiveHistory: [
        {
          month: '2024-11',
          totalIncentives: 1250,
          extraHours: 24.5,
          extraHoursBonus: 850,
          lateShifts: 8,
          lateShiftBonus: 200,
          weekendDays: 3,
          weekendBonus: 150,
          overtimeDays: 8,
          overtimeBonus: 50
        },
        {
          month: '2024-10',
          totalIncentives: 1150,
          extraHours: 22,
          extraHoursBonus: 770,
          lateShifts: 12,
          lateShiftBonus: 300,
          weekendDays: 2,
          weekendBonus: 80,
          overtimeDays: 0,
          overtimeBonus: 0
        },
        {
          month: '2024-09',
          totalIncentives: 980,
          extraHours: 18.5,
          extraHoursBonus: 650,
          lateShifts: 10,
          lateShiftBonus: 250,
          weekendDays: 2,
          weekendBonus: 80,
          overtimeDays: 0,
          overtimeBonus: 0
        }
      ],
      workSummary: {
        regularHours: 168, // 21 days * 8 hours
        extraHours: 24.5,
        totalHours: 192.5,
        averageDaily: 9.2,
        efficiency: 94.5,
        attendanceRate: 100
      },
      tripSummary: {
        totalTrips: 42,
        morningCommute: 21,
        eveningReturn: 21,
        avgDistance: 15.3,
        totalDistance: 643,
        onTimeTrips: 38,
        delayedTrips: 4,
        avgDelay: 8.5
      }
    };
    setReportData(mockReportData);
  }, [selectedMonth]);

  const generateReport = async (format) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert(`${format.toUpperCase()} report generated successfully!`);
    }, 2000);
  };

  const calculateIncentiveGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Reports</h1>
          <p className="text-gray-500 mt-1">
            Monthly incentive statements and personal work analytics
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {/* Employee Information */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            Personal details and company information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Employee Name</p>
              <p className="font-bold text-lg">{reportData.monthlyStatement?.employee?.name}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Employee ID</p>
              <p className="font-bold text-lg">{reportData.monthlyStatement?.employee?.empId}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-bold text-lg">{reportData.monthlyStatement?.employee?.department}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Company</p>
              <p className="font-bold text-lg">{reportData.monthlyStatement?.employee?.company}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Incentives
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reportData.monthlyStatement?.summary?.totalIncentives || 0)}</div>
            <p className="text-xs text-green-600 mt-1">
              This month earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Extra Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.monthlyStatement?.summary?.extraHours || 0}h</div>
            <p className="text-xs text-blue-600 mt-1">
              Additional work time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Trips
            </CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.monthlyStatement?.summary?.totalTrips || 0}</div>
            <p className="text-xs text-purple-600 mt-1">
              Commute trips
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Working Days
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.monthlyStatement?.summary?.workingDays || 0}</div>
            <p className="text-xs text-orange-600 mt-1">
              Days attended
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Incentive Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Incentive Statement</CardTitle>
          <CardDescription>
            Detailed breakdown of your incentive earnings and calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Breakdown */}
            <div>
              <h4 className="font-medium mb-4">Incentive Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="font-medium">Extra Hours Bonus</span>
                    <p className="text-sm text-gray-600">
                      {reportData.monthlyStatement?.summary?.extraHours}h @ {formatCurrency(reportData.monthlyStatement?.calculations?.extraHoursRate)}/hour
                    </p>
                  </div>
                  <span className="font-bold text-green-600">
                    {formatCurrency(reportData.monthlyStatement?.breakdown?.extraHoursBonus || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <span className="font-medium">Late Shift Bonus</span>
                    <p className="text-sm text-gray-600">
                      8 trips @ {formatCurrency(reportData.monthlyStatement?.calculations?.lateShiftRate)}/trip
                    </p>
                  </div>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(reportData.monthlyStatement?.breakdown?.lateShiftBonus || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <span className="font-medium">Weekend Work Bonus</span>
                    <p className="text-sm text-gray-600">
                      3 days @ {reportData.monthlyStatement?.calculations?.weekendMultiplier}x multiplier
                    </p>
                  </div>
                  <span className="font-bold text-purple-600">
                    {formatCurrency(reportData.monthlyStatement?.breakdown?.weekendWorkBonus || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <span className="font-medium">Overtime Bonus</span>
                    <p className="text-sm text-gray-600">
                      {reportData.monthlyStatement?.summary?.overtimeDays} days over {reportData.monthlyStatement?.calculations?.overtimeThreshold}h
                    </p>
                  </div>
                  <span className="font-bold text-orange-600">
                    {formatCurrency(reportData.monthlyStatement?.breakdown?.overtimeBonus || 0)}
                  </span>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Incentives:</span>
                  <span className="text-green-600">{formatCurrency(reportData.monthlyStatement?.summary?.totalIncentives || 0)}</span>
                </div>
              </div>
            </div>

            {/* Work & Trip Summary */}
            <div>
              <h4 className="font-medium mb-4">Work & Trip Summary</h4>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-2">Work Hours Analysis</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Regular Hours:</span>
                      <span>{reportData.workSummary?.regularHours || 0}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Extra Hours:</span>
                      <span className="text-orange-600">{reportData.workSummary?.extraHours || 0}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Hours:</span>
                      <span className="font-medium">{reportData.workSummary?.totalHours || 0}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Daily:</span>
                      <span>{reportData.workSummary?.averageDaily || 0}h</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-2">Commute Analysis</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Distance:</span>
                      <span>{reportData.tripSummary?.totalDistance || 0} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Distance:</span>
                      <span>{reportData.tripSummary?.avgDistance || 0} km/trip</span>
                    </div>
                    <div className="flex justify-between">
                      <span>On-Time Trips:</span>
                      <span className="text-green-600">{reportData.tripSummary?.onTimeTrips || 0}/{reportData.tripSummary?.totalTrips || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Delay:</span>
                      <span>{reportData.tripSummary?.avgDelay || 0} mins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incentive History */}
      <Card>
        <CardHeader>
          <CardTitle>Incentive History</CardTitle>
          <CardDescription>
            Monthly incentive trends and detailed calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Extra Hours</TableHead>
                  <TableHead className="text-right">Extra Hours Bonus</TableHead>
                  <TableHead className="text-right">Late Shifts</TableHead>
                  <TableHead className="text-right">Weekend Work</TableHead>
                  <TableHead className="text-right">Overtime Bonus</TableHead>
                  <TableHead className="text-right">Total Incentives</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.incentiveHistory.map((record, index) => {
                  const previousRecord = reportData.incentiveHistory[index + 1];
                  const growth = calculateIncentiveGrowth(record.totalIncentives, previousRecord?.totalIncentives);
                  
                  return (
                    <TableRow key={record.month}>
                      <TableCell className="font-medium">{record.month}</TableCell>
                      <TableCell className="text-right">{record.extraHours}h</TableCell>
                      <TableCell className="text-right">{formatCurrency(record.extraHoursBonus)}</TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div>{record.lateShifts} shifts</div>
                          <div className="text-xs text-gray-500">{formatCurrency(record.lateShiftBonus)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div>{record.weekendDays} days</div>
                          <div className="text-xs text-gray-500">{formatCurrency(record.weekendBonus)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div>{record.overtimeDays} days</div>
                          <div className="text-xs text-gray-500">{formatCurrency(record.overtimeBonus)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-lg text-green-600">{formatCurrency(record.totalIncentives)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {growth != 0 && (
                          <span className={`${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {growth > 0 ? '+' : ''}{growth}%
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Personal Reports</CardTitle>
          <CardDescription>
            Download your incentive statements and trip history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => generateReport('pdf')} 
              disabled={generating}
              className="h-20 flex-col"
            >
              <FileText className="w-8 h-8 mb-2" />
              <span>Monthly Statement (PDF)</span>
            </Button>
            <Button 
              onClick={() => generateReport('excel')} 
              disabled={generating}
              className="h-20 flex-col"
              variant="outline"
            >
              <Download className="w-8 h-8 mb-2" />
              <span>Incentive History (Excel)</span>
            </Button>
            <Button 
              onClick={() => generateReport('csv')} 
              disabled={generating}
              className="h-20 flex-col"
              variant="outline"
            >
              <Download className="w-8 h-8 mb-2" />
              <span>Trip History (CSV)</span>
            </Button>
          </div>
          {generating && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                <span className="text-green-600">Generating report... Please wait.</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
