import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/utils';
import api from '../../api/axios';
import {
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Loader
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function EmployeeReports() {
  const [incentiveData, setIncentiveData] = useState({
    summary: {},
    incentiveTrips: [],
    trendData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    const fetchIncentiveData = async () => {
      setLoading(true);
      setError(null);

      try {
        const reportResponse = await api.get(`/api/v1/employee/report/monthly?month=${selectedMonth}`);
        const reportData = reportResponse.data;

        const historyResponse = await api.get('/api/v1/employee/incentive-history?period_months=6');
        const historyData = historyResponse.data;

        setIncentiveData({
          summary: {
            totalIncentives: reportData.summary?.total_incentives || 0,
            extraHoursBonus: reportData.breakdown?.extra_hours || 0,
            lateShiftBonus: reportData.breakdown?.late_shift || 0,
            weekendBonus: reportData.breakdown?.weekend || 0,
            overtimeBonus: reportData.breakdown?.overtime || 0
          },
          incentiveTrips: (reportData.trip_summary?.incentive_trips || []).map(trip => ({
            id: trip.trip_id,
            date: trip.date,
            type: trip.type,
            amount: trip.amount,
            reason: trip.reason
          })),
          trendData: (historyData.history || []).map(item => ({
            month: item.month,
            amount: item.total_incentives
          }))
        });
      } catch (err) {
        console.error('Failed to fetch incentive data:', err);
        setError('Failed to load incentive data');
      } finally {
        setLoading(false);
      }
    };

    fetchIncentiveData();
  }, [selectedMonth]);

  const handleExportPDF = async () => {
    setDownloading(true);

    try {
      const response = await api.post('/api/v1/employee/export', {
        report_type: 'monthly_statement',
        month: selectedMonth,
        format: 'pdf'
      });

      const { download_url, report_id } = response.data;

      const fileResponse = await api.get(download_url, {
        responseType: 'blob'
      });

      const blob = new Blob([fileResponse.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = report_id || `Incentive_Statement_${selectedMonth}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    return options;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incentive Summary</h1>
          <p className="text-gray-500 mt-1">Detailed breakdown of your monthly incentives</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            {getMonthOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <Button onClick={handleExportPDF} disabled={downloading} className="flex items-center gap-2">
            {downloading ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Incentives</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(incentiveData.summary?.totalIncentives || 0)}</div>
            <p className="text-xs text-green-600 mt-1">This Month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Extra Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(incentiveData.summary?.extraHoursBonus || 0)}</div>
            <p className="text-xs text-blue-600 mt-1">Bonus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Late Shift</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(incentiveData.summary?.lateShiftBonus || 0)}</div>
            <p className="text-xs text-purple-600 mt-1">Bonus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Weekend Work</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(incentiveData.summary?.weekendBonus || 0)}</div>
            <p className="text-xs text-orange-600 mt-1">Bonus</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incentive Trips</CardTitle>
          <CardDescription>List of trips that earned incentives this month</CardDescription>
        </CardHeader>
        <CardContent>
          {incentiveData.incentiveTrips?.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incentiveData.incentiveTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">{trip.id}</TableCell>
                      <TableCell>{new Date(trip.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {trip.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{trip.reason}</TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        {formatCurrency(trip.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No incentive trips this month</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Incentive Trend</CardTitle>
          <CardDescription>Your incentive earnings over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incentiveData.trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Incentive']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
