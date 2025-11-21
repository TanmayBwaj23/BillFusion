import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../lib/utils';
import { FileText, Download, Calendar, Filter, Users, Building2, DollarSign, TrendingUp } from 'lucide-react';

export function BillingReports() {
  const [reportData, setReportData] = useState({
    monthlyBilling: {},
    vendorPayments: [],
    employeeIncentives: [],
    summary: {}
  });
  const [selectedMonth, setSelectedMonth] = useState('2024-11');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Mock comprehensive billing report data
    const mockReportData = {
      monthlyBilling: {
        month: '2024-11',
        totalCost: 1250000,
        totalTrips: 2850,
        totalEmployees: 450,
        activeVendors: 5,
        breakdown: {
          packageCharges: 680000,
          tripCharges: 425000,
          incentiveCharges: 95000,
          overLimitCharges: 50000
        },
        comparison: {
          previousMonth: 1180000,
          percentageChange: 5.9,
          trend: 'up'
        }
      },
      vendorPayments: [
        {
          id: 1,
          vendor: 'Swift Transport',
          billingModel: 'Package',
          baseAmount: 340000,
          packageTrips: 890,
          overLimitTrips: 45,
          overLimitAmount: 12500,
          incentives: 8500,
          totalPayable: 361000,
          extraKm: 90,
          extraHours: 15
        },
        {
          id: 2,
          vendor: 'City Cabs',
          billingModel: 'Trip',
          baseAmount: 285000,
          totalTrips: 720,
          overLimitTrips: 0,
          overLimitAmount: 0,
          incentives: 15200,
          totalPayable: 300200,
          extraKm: 0,
          extraHours: 0
        },
        {
          id: 3,
          vendor: 'Metro Rides',
          billingModel: 'Hybrid',
          baseAmount: 150000,
          packageTrips: 20,
          additionalTrips: 35,
          additionalAmount: 63000,
          incentives: 12800,
          totalPayable: 225800,
          extraKm: 0,
          extraHours: 0
        }
      ],
      employeeIncentives: [
        {
          empId: 'EMP001',
          name: 'John Doe',
          department: 'Engineering',
          totalIncentives: 1250,
          breakdown: {
            extraHours: 750,
            lateShifts: 300,
            weekendTrips: 200
          },
          eligibleTrips: 8,
          reasons: ['Extra 5 hours overtime', 'Late night shift (3 trips)', 'Weekend work (2 trips)']
        },
        {
          empId: 'EMP002',
          name: 'Jane Smith',
          department: 'Marketing',
          totalIncentives: 950,
          breakdown: {
            extraHours: 600,
            lateShifts: 350,
            weekendTrips: 0
          },
          eligibleTrips: 6,
          reasons: ['Extra 4 hours overtime', 'Late night shift (4 trips)']
        }
      ],
      summary: {
        costDistribution: {
          vendors: 1155000,
          incentives: 95000
        },
        efficiency: {
          costPerTrip: 438.6,
          costPerEmployee: 2777.8,
          utilizationRate: 89.5
        },
        alerts: [
          'Swift Transport exceeded package limits by 15%',
          'City Cabs showing 12% increase in trip costs',
          'Overall transportation budget is 5.9% above last month'
        ]
      }
    };
    setReportData(mockReportData);
  }, [selectedMonth]);

  const generateReport = async (format) => {
    setGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      // In real implementation, this would trigger download
      alert(`${format.toUpperCase()} report generated successfully!`);
    }, 2000);
  };

  const getBillingModelBadge = (model) => {
    const colors = {
      'Package': 'bg-blue-100 text-blue-800',
      'Trip': 'bg-green-100 text-green-800',
      'Hybrid': 'bg-purple-100 text-purple-800'
    };
    return colors[model] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Reports</h1>
          <p className="text-gray-500 mt-1">
            Generate comprehensive billing reports and vendor payment summaries
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

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Monthly Cost
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reportData.monthlyBilling.totalCost)}</div>
            <p className="text-xs text-green-600 mt-1">
              +{reportData.monthlyBilling.comparison?.percentageChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Trips
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.monthlyBilling.totalTrips?.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">Across all vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Vendors
            </CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.monthlyBilling.activeVendors}</div>
            <p className="text-xs text-purple-600 mt-1">Payable this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Incentives
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reportData.monthlyBilling.breakdown?.incentiveCharges || 0)}</div>
            <p className="text-xs text-orange-600 mt-1">Employee incentives</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Billing Breakdown</CardTitle>
          <CardDescription>
            Detailed cost analysis by billing type and vendor model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Cost Distribution</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span>Package Model Charges</span>
                  <span className="font-bold">{formatCurrency(reportData.monthlyBilling.breakdown?.packageCharges || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>Trip Model Charges</span>
                  <span className="font-bold">{formatCurrency(reportData.monthlyBilling.breakdown?.tripCharges || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span>Incentive Charges</span>
                  <span className="font-bold">{formatCurrency(reportData.monthlyBilling.breakdown?.incentiveCharges || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span>Over-limit Charges</span>
                  <span className="font-bold">{formatCurrency(reportData.monthlyBilling.breakdown?.overLimitCharges || 0)}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Key Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Cost per Trip</span>
                  <span className="font-bold">{formatCurrency(reportData.summary?.efficiency?.costPerTrip || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Cost per Employee</span>
                  <span className="font-bold">{formatCurrency(reportData.summary?.efficiency?.costPerEmployee || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Utilization Rate</span>
                  <span className="font-bold">{reportData.summary?.efficiency?.utilizationRate || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Payment Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vendor Payment Summary</CardTitle>
              <CardDescription>
                Payables grouped by vendor with over-limit and incentive details
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => generateReport('pdf')} disabled={generating}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={() => generateReport('excel')} disabled={generating}>
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Billing Model</TableHead>
                  <TableHead className="text-right">Base Amount</TableHead>
                  <TableHead className="text-right">Total Trips</TableHead>
                  <TableHead className="text-right">Over-limit</TableHead>
                  <TableHead className="text-right">Incentives</TableHead>
                  <TableHead className="text-right">Total Payable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.vendorPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.vendor}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillingModelBadge(payment.billingModel)}`}>
                        {payment.billingModel}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.baseAmount)}</TableCell>
                    <TableCell className="text-right">
                      {payment.totalTrips || payment.packageTrips + (payment.additionalTrips || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.overLimitAmount > 0 ? (
                        <div>
                          <div className="font-medium text-red-600">{formatCurrency(payment.overLimitAmount)}</div>
                          <div className="text-xs text-gray-500">
                            {payment.extraKm > 0 && `+${payment.extraKm} km`}
                            {payment.extraKm > 0 && payment.extraHours > 0 && ', '}
                            {payment.extraHours > 0 && `+${payment.extraHours} hrs`}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-green-600">{formatCurrency(payment.incentives)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-lg">{formatCurrency(payment.totalPayable)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Employee Incentive Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Employee Incentive Summary</CardTitle>
              <CardDescription>
                Incentives earned by employees with detailed breakdown
              </CardDescription>
            </div>
            <Button onClick={() => generateReport('csv')} disabled={generating}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Extra Hours</TableHead>
                  <TableHead className="text-right">Late Shifts</TableHead>
                  <TableHead className="text-right">Weekend Trips</TableHead>
                  <TableHead className="text-right">Total Incentives</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.employeeIncentives.map((employee) => (
                  <TableRow key={employee.empId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.empId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell className="text-right">{formatCurrency(employee.breakdown.extraHours)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(employee.breakdown.lateShifts)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(employee.breakdown.weekendTrips)}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-green-600">{formatCurrency(employee.totalIncentives)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {employee.reasons.map((reason, index) => (
                          <div key={index} className="mb-1">{reason}</div>
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

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Complete Report</CardTitle>
          <CardDescription>
            Generate and download comprehensive reports in multiple formats
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
              <span>Monthly Billing Report (PDF)</span>
            </Button>
            <Button 
              onClick={() => generateReport('excel')} 
              disabled={generating}
              className="h-20 flex-col"
              variant="outline"
            >
              <Download className="w-8 h-8 mb-2" />
              <span>Vendor Payment Summary (Excel)</span>
            </Button>
            <Button 
              onClick={() => generateReport('csv')} 
              disabled={generating}
              className="h-20 flex-col"
              variant="outline"
            >
              <Download className="w-8 h-8 mb-2" />
              <span>Employee Incentive Summary (CSV)</span>
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
