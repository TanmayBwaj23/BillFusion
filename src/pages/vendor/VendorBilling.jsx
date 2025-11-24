import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  DollarSign,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  MapPin,
  Zap
} from 'lucide-react';
import { PayoutTrendChart } from '../../components/charts/PayoutTrendChart';
// import { IncentiveBreakdownChart } from '../../components/charts/IncentiveBreakdownChart';
import * as XLSX from 'xlsx';

import useAuthStore from '../../store/authStore';

export function VendorBilling() {
  const { user } = useAuthStore();
  const [billingData, setBillingData] = useState({
    currentMonth: {},
    payoutHistory: [],
    incentiveBreakdown: {},
    payoutTrends: []
  });
  const [selectedMonth, setSelectedMonth] = useState('2025-11');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const token = useAuthStore.getState().accessToken;
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/vendor/billing/monthly?month=${selectedMonth}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          setBillingData(data);
          console.log('✅ Billing data loaded:', data);
        }
      } catch (error) {
        console.error('Error fetching billing:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBillingData();
  }, [selectedMonth, user]);

  const generatePayoutStatement = async (format) => {
    setGenerating(true);

    try {
      if (format === 'excel' || format === 'xlsx') {
        console.log('Starting Excel export...', billingData);

        // Prepare data for Excel
        const worksheet_data = [
          ['Vendor Billing Statement'],
          ['Month:', billingData.currentMonth?.month || ''],
          [''],
          ['Summary'],
          ['Total Payout', billingData.currentMonth?.totalPayout || 0],
          ['Base Amount', billingData.currentMonth?.baseAmount || 0],
          ['Extra Charges', billingData.currentMonth?.extraCharges || 0],
          ['Incentives', billingData.currentMonth?.incentives || 0],
          [''],
          ['Trip Details'],
          ['Total Trips', billingData.currentMonth?.trips?.total || 0],
          ['Completed Trips', billingData.currentMonth?.trips?.completed || 0],
          ['Total KM', billingData.currentMonth?.trips?.baseKm || 0],
          [''],
          ['Payout History'],
          ['Month', 'Trips', 'Base Amount', 'Extra Charges', 'Total Payout', 'Status']
        ];

        // Add history rows
        if (billingData.payoutHistory && billingData.payoutHistory.length > 0) {
          billingData.payoutHistory.forEach(payout => {
            worksheet_data.push([
              payout.month,
              payout.trips,
              payout.baseAmount,
              payout.extraCharges,
              payout.totalPayout,
              payout.payoutStatus
            ]);
          });
        }

        const worksheet = XLSX.utils.aoa_to_sheet(worksheet_data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Billing');

        const filename = `billing_${billingData.currentMonth?.month || 'statement'}.xlsx`;
        XLSX.writeFile(workbook, filename);

        console.log('✅ Excel export successful:', filename);
      } else if (format === 'pdf') {
        alert('PDF export coming soon!');
      } else {
        alert(`${format.toUpperCase()} export coming soon!`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export billing statement: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const getPayoutStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payouts</h1>
          <p className="text-gray-500 mt-1">
            Track your earnings, incentives, and payout statements
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2025-11">November 2025</option>
            <option value="2025-10">October 2025</option>
            <option value="2025-09">September 2025</option>
          </select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* Current Month Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Payout
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(billingData.currentMonth?.totalPayout || 0)}</div>
            <p className="text-xs text-green-600 mt-1">
              For {billingData.currentMonth?.trips?.total || 0} trips
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Base Amount
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(billingData.currentMonth?.baseAmount || 0)}</div>
            <p className="text-xs text-blue-600 mt-1">
              From {billingData.currentMonth?.trips?.baseKm || 0} base km
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Incentives
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(billingData.currentMonth?.incentives || 0)}</div>
            <p className="text-xs text-purple-600 mt-1">
              Extra km & hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Status
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPayoutStatusBadge(billingData.currentMonth?.payoutStatus)}`}>
              {billingData.currentMonth?.payoutStatus?.charAt(0).toUpperCase() + billingData.currentMonth?.payoutStatus?.slice(1) || 'Unknown'}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Payment due: Dec 5th
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charge Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Current Month Breakdown</CardTitle>
            <CardDescription>
              Detailed breakdown of charges and rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Base Charges</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base KM ({billingData.currentMonth?.trips?.baseKm || 0} km @ {formatCurrency(billingData.currentMonth?.breakdown?.baseKmRate || 0)}/km):</span>
                    <span className="font-medium">{formatCurrency((billingData.currentMonth?.trips?.baseKm || 0) * (billingData.currentMonth?.breakdown?.baseKmRate || 0))}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-3">Extra Charges</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Extra KM ({billingData.currentMonth?.trips?.extraKm || 0} km @ {formatCurrency(billingData.currentMonth?.breakdown?.extraKmRate || 0)}/km):</span>
                    <span className="font-medium">{formatCurrency((billingData.currentMonth?.trips?.extraKm || 0) * (billingData.currentMonth?.breakdown?.extraKmRate || 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extra Hours ({billingData.currentMonth?.trips?.extraHours || 0}h @ {formatCurrency(billingData.currentMonth?.breakdown?.extraHourRate || 0)}/h):</span>
                    <span className="font-medium">{formatCurrency((billingData.currentMonth?.trips?.extraHours || 0) * (billingData.currentMonth?.breakdown?.extraHourRate || 0))}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-3">Bonuses & Incentives</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Night Trip Bonus:</span>
                    <span className="font-medium">{formatCurrency(billingData.currentMonth?.breakdown?.nightTripBonus || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Bonus:</span>
                    <span className="font-medium">{formatCurrency(billingData.currentMonth?.breakdown?.performanceBonus || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Payout:</span>
                  <span className="text-green-600">{formatCurrency(billingData.currentMonth?.totalPayout || 0)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incentive Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Incentive Breakdown</CardTitle>
            <CardDescription>
              Distribution of your incentive earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(billingData.incentiveBreakdown || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <span className="font-bold text-green-600">{formatCurrency(value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Trends</CardTitle>
          <CardDescription>
            Your monthly payout history and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <PayoutTrendChart data={billingData.payoutTrends} />
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                Previous month payouts and payment details
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => generatePayoutStatement('pdf')} disabled={generating}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={() => generatePayoutStatement('excel')} disabled={generating}>
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
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Trips</TableHead>
                  <TableHead className="text-right">Base Amount</TableHead>
                  <TableHead className="text-right">Incentives</TableHead>
                  <TableHead className="text-right">Extra Charges</TableHead>
                  <TableHead className="text-right">Total Payout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingData.payoutHistory.map((payout) => (
                  <TableRow key={payout.month}>
                    <TableCell className="font-medium">{payout.month}</TableCell>
                    <TableCell className="text-right">{payout.trips}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payout.baseAmount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payout.incentives)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payout.extraCharges)}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-lg">{formatCurrency(payout.totalPayout)}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPayoutStatusBadge(payout.payoutStatus)}`}>
                        {payout.payoutStatus.charAt(0).toUpperCase() + payout.payoutStatus.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payout.paidDate ? formatDate(payout.paidDate) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Export Payout Statements</CardTitle>
          <CardDescription>
            Download detailed payout statements for your records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => generatePayoutStatement('pdf')}
              disabled={generating}
              className="h-20 flex-col"
            >
              <FileText className="w-8 h-8 mb-2" />
              <span>Monthly Statement (PDF)</span>
            </Button>
            <Button
              onClick={() => generatePayoutStatement('excel')}
              disabled={generating}
              className="h-20 flex-col"
              variant="outline"
            >
              <Download className="w-8 h-8 mb-2" />
              <span>Detailed Breakdown (Excel)</span>
            </Button>
            <Button
              onClick={() => generatePayoutStatement('csv')}
              disabled={generating}
              className="h-20 flex-col"
              variant="outline"
            >
              <Download className="w-8 h-8 mb-2" />
              <span>Trip Data (CSV)</span>
            </Button>
          </div>
          {generating && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-600">Generating payout statement... Please wait.</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
