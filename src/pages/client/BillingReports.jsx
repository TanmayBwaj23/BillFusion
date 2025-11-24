import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/utils';
import { FileText, Download, Calendar, Users, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { clientApi } from '../../services/clientApi';
import useAuthStore from '../../store/authStore';

export function BillingReports() {
  const { user } = useAuthStore();
  const [reportData, setReportData] = useState({
    monthlyBilling: {},
    vendorPayments: [],
    employeeIncentives: [],
    summary: {}
  });
  const [selectedMonth, setSelectedMonth] = useState('2024-11');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const reportResponse = await clientApi.billing.getMonthlyReport(selectedMonth);

        setReportData({
          monthlyBilling: {
            month: reportResponse.billingMonth || reportResponse.billing_month,
            totalCost: reportResponse.summary?.totalAmount || reportResponse.summary?.total_amount || 0,
            totalTrips: reportResponse.summary?.totalTrips || reportResponse.summary?.total_trips || 0,
            totalEmployees: 0, // Not in current API summary
            activeVendors: 0, // Not in current API summary
            breakdown: reportResponse.breakdown || {},
            comparison: reportResponse.comparison || {}
          },
          vendorPayments: reportResponse.vendorPayments || reportResponse.vendor_payments || [],
          employeeIncentives: [], // Not implemented in backend yet
          summary: {
            costDistribution: {
              vendors: (reportResponse.summary?.totalAmount || 0) - (reportResponse.breakdown?.incentiveCharges || 0),
              incentives: reportResponse.breakdown?.incentiveCharges || 0
            },
            efficiency: reportResponse.efficiencyMetrics || reportResponse.efficiency_metrics || {},
            alerts: []
          }
        });
      } catch (error) {
        console.error('Failed to fetch billing report:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReportData();
    }
  }, [selectedMonth, user]);

  const generateReport = async (format) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert(`${format.toUpperCase()} report generated successfully!`);
    }, 2000);
  };

  const getBillingModelBadge = (model) => {
    if (!model) return 'bg-gray-100 text-gray-800';
    const lowerModel = model.toLowerCase();
    if (lowerModel.includes('package')) return 'bg-blue-100 text-blue-800';
    if (lowerModel.includes('trip')) return 'bg-green-100 text-green-800';
    if (lowerModel.includes('hybrid')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
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
            <option value="2024-08">August 2024</option>
          </select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
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
                <div className="text-2xl font-bold">{formatCurrency(reportData.monthlyBilling.totalCost || 0)}</div>
                <p className="text-xs text-green-600 mt-1">
                  {reportData.monthlyBilling.comparison?.changePercentage > 0 ? '+' : ''}
                  {reportData.monthlyBilling.comparison?.changePercentage || 0}% from last month
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
                <div className="text-2xl font-bold">{reportData.monthlyBilling.totalTrips?.toLocaleString() || '0'}</div>
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
                <div className="text-2xl font-bold">{reportData.vendorPayments.length || 0}</div>
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
                      <span>Vendor Charges</span>
                      <span className="font-bold">{formatCurrency(reportData.monthlyBilling.breakdown?.vendorCharges || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span>Incentive Charges</span>
                      <span className="font-bold">{formatCurrency(reportData.monthlyBilling.breakdown?.incentiveCharges || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span>Surge Charges</span>
                      <span className="font-bold">{formatCurrency(reportData.monthlyBilling.breakdown?.surgeCharges || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span>Penalty Reductions</span>
                      <span className="font-bold">{formatCurrency(reportData.monthlyBilling.breakdown?.penaltyReductions || 0)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Key Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Cost per Trip</span>
                      <span className="font-bold">{formatCurrency(reportData.summary?.efficiency?.avgCostPerTrip || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Cost per Employee</span>
                      <span className="font-bold">{formatCurrency(reportData.summary?.efficiency?.avgCostPerEmployee || 0)}</span>
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
                    Payables grouped by vendor with detailed breakdown
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
              {reportData.vendorPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No vendor payment data available for this month</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Billing Model</TableHead>
                        <TableHead className="text-right">Total Trips</TableHead>
                        <TableHead className="text-right">Base Charges</TableHead>
                        <TableHead className="text-right">Surge</TableHead>
                        <TableHead className="text-right">Penalties</TableHead>
                        <TableHead className="text-right">Incentives</TableHead>
                        <TableHead className="text-right">Total Payable</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.vendorPayments.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{payment.vendorName || payment.vendor_name}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillingModelBadge(payment.billingModel || payment.billing_model)}`}>
                              {payment.billingModel || payment.billing_model}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{payment.totalTrips || payment.total_trips}</TableCell>
                          <TableCell className="text-right">{formatCurrency(payment.breakdown?.baseCharges || 0)}</TableCell>
                          <TableCell className="text-right text-orange-600">{formatCurrency(payment.breakdown?.surgeCharges || 0)}</TableCell>
                          <TableCell className="text-right text-red-600">{formatCurrency(payment.breakdown?.penaltyReductions || 0)}</TableCell>
                          <TableCell className="text-right text-blue-600">{formatCurrency(payment.breakdown?.incentiveCharges || 0)}</TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(payment.totalAmount || payment.total_amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-gray-50 font-bold">
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">
                          {reportData.vendorPayments.reduce((sum, p) => sum + (p.totalTrips || p.total_trips || 0), 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(reportData.vendorPayments.reduce((sum, p) => sum + (p.breakdown?.baseCharges || 0), 0))}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(reportData.vendorPayments.reduce((sum, p) => sum + (p.breakdown?.surgeCharges || 0), 0))}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(reportData.vendorPayments.reduce((sum, p) => sum + (p.breakdown?.penaltyReductions || 0), 0))}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(reportData.vendorPayments.reduce((sum, p) => sum + (p.breakdown?.incentiveCharges || 0), 0))}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(reportData.vendorPayments.reduce((sum, p) => sum + (p.totalAmount || p.total_amount || 0), 0))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
