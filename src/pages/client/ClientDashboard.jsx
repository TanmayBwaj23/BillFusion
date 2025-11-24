import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate, calculatePercentageChange } from '../../lib/utils';
import { TrendingUp, TrendingDown, Users, Car, DollarSign, Building2, AlertTriangle, Clock, MapPin, FileX, UserCheck, FileText } from 'lucide-react';
import { CostTrendChart } from '../../components/charts/CostTrendChart';
import { VendorPerformanceChart } from '../../components/charts/VendorPerformanceChart';
import { VendorUsageChart } from '../../components/charts/VendorUsageChart';
import { TripModelDistributionChart } from '../../components/charts/TripModelDistributionChart';
import { VendorComparisonTable } from '../../components/tables/VendorComparisonTable';
import useAuthStore from '../../store/authStore';
import { clientApi } from '../../services/clientApi';
import { StatCard } from '../../components/dashboard/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function ClientDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalTrips: 0,
      totalBilling: 0,
      activeVendors: 0,
      totalEmployees: 0,
      costPerEmployee: 0,
      costPerTrip: 0,
      pendingInvoices: 0
    },
    trends: {
      tripsChange: 0,
      billingChange: 0,
      vendorsChange: 0
    }
  });
  const [costTrends, setCostTrends] = useState([]);
  const [vendorDistribution, setVendorDistribution] = useState({
    vendorUsage: [],
    vendorPerformance: [],
    tripModelDistribution: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [summaryData, trendsData, distributionData] = await Promise.all([
          clientApi.dashboard.getSummary(),
          clientApi.dashboard.getCostTrends(),
          clientApi.dashboard.getVendorDistribution()
        ]);

        setDashboardData({
          summary: summaryData.summary,
          trends: summaryData.trends
        });
        setCostTrends(trendsData.data);
        setVendorDistribution(distributionData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name || 'Client'}!
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor your transportation operations and vendor performance
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="font-medium">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Trips"
          value={dashboardData.summary.totalTrips.toLocaleString()}
          trend={dashboardData.trends.tripsChange}
          icon={Car}
          color="blue"
        />
        <StatCard
          title="Total Billing"
          value={`₹${dashboardData.summary.totalBilling.toLocaleString()}`}
          trend={dashboardData.trends.billingChange}
          icon={IndianRupee}
          color="green"
        />
        <StatCard
          title="Active Vendors"
          value={dashboardData.summary.activeVendors}
          trend={dashboardData.trends.vendorsChange}
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Pending Invoices"
          value={dashboardData.summary.pendingInvoices}
          trend={0}
          icon={FileText}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrends}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Cost']} />
                <Area type="monotone" dataKey="amount" stroke="#4F46E5" fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vendorDistribution.vendorUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="trips"
                  nameKey="vendor"
                >
                  {vendorDistribution.vendorUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {vendorDistribution.vendorUsage.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-gray-600">{entry.vendor}</span>
                  </div>
                  <span className="font-medium text-gray-900">{entry.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Used Vendors</CardTitle>
          <CardDescription>
            Performance score and trip volume by top vendors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendorPerformanceChart data={vendorDistribution.vendorPerformance} />
        </CardContent>
      </Card>

      {/* Vendor-wise Trip Distribution Table */}
      {/* Note: We need to pass the correct data structure to VendorComparisonTable */}
      {/* For now, we'll skip it or pass empty array if data structure doesn't match */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Vendor-wise Trip Distribution</CardTitle>
          <CardDescription>
            Detailed breakdown of trips and billing by vendor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendorComparisonTable vendors={[]} />
        </CardContent>
      </Card> */}
    </div>
  );
}

// Helper component for Stat Cards if not imported
function IndianRupee({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5-10" />
      <path d="M6 13h3" />
      <path d="M9 13c6.627 0 12 5.373 12 12v0" />
    </svg>
  );
}
