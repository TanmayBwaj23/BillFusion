import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate, calculatePercentageChange } from '../../lib/utils';
import { TrendingUp, TrendingDown, Users, Car, DollarSign, Building2, AlertTriangle, Clock, MapPin, FileX, UserCheck } from 'lucide-react';
import { CostTrendChart } from '../../components/charts/CostTrendChart';
import { VendorPerformanceChart } from '../../components/charts/VendorPerformanceChart';
import { VendorUsageChart } from '../../components/charts/VendorUsageChart';
import { TripModelDistributionChart } from '../../components/charts/TripModelDistributionChart';
import { VendorComparisonTable } from '../../components/tables/VendorComparisonTable';
// import { AlertsWidget } from '../../components/widgets/AlertsWidget';

export function ClientDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalTrips: 2850,
    totalBilling: 1250000,
    activeVendors: 5,
    totalEmployees: 450,
    costPerEmployee: 2778,
    pendingInvoices: 3,
    costTrends: [],
    vendorPerformance: [],
    vendorUsage: [],
    tripModelDistribution: [],
    vendors: [],
    alerts: []
  });

  useEffect(() => {
    // Simulate API call with comprehensive dashboard data
    const mockData = {
      totalTrips: 2850,
      totalBilling: 1250000,
      activeVendors: 5,
      totalEmployees: 450,
      costPerEmployee: 2778,
      pendingInvoices: 3,
      costTrends: [
        { month: 'Jan', amount: 1100000 },
        { month: 'Feb', amount: 1150000 },
        { month: 'Mar', amount: 1200000 },
        { month: 'Apr', amount: 1180000 },
        { month: 'May', amount: 1250000 },
        { month: 'Jun', amount: 1300000 }
      ],
      vendorPerformance: [
        { vendor: 'Swift Transport', performance: 95, trips: 890 },
        { vendor: 'City Cabs', performance: 88, trips: 720 },
        { vendor: 'Metro Rides', performance: 92, trips: 650 },
        { vendor: 'Quick Rides', performance: 85, trips: 420 },
        { vendor: 'Express Cabs', performance: 90, trips: 370 }
      ],
      vendorUsage: [
        { vendor: 'Swift Transport', trips: 890, percentage: 31.2 },
        { vendor: 'City Cabs', trips: 720, percentage: 25.3 },
        { vendor: 'Metro Rides', trips: 650, percentage: 22.8 },
        { vendor: 'Quick Rides', trips: 420, percentage: 14.7 },
        { vendor: 'Express Cabs', trips: 170, percentage: 6.0 }
      ],
      tripModelDistribution: [
        { model: 'Package Model', count: 1540, percentage: 54.0 },
        { model: 'Trip Model', count: 890, percentage: 31.2 },
        { model: 'Hybrid Model', count: 420, percentage: 14.8 }
      ],
      vendors: [
        {
          id: 1,
          name: 'Swift Transport',
          billingModel: 'Package',
          employeeCount: 120,
          monthlyTrips: 890,
          monthlySpend: 340000,
          performance: 95,
          contractStatus: 'Active'
        },
        {
          id: 2,
          name: 'City Cabs',
          billingModel: 'Trip',
          employeeCount: 85,
          monthlyTrips: 720,
          monthlySpend: 285000,
          performance: 88,
          contractStatus: 'Active'
        },
        {
          id: 3,
          name: 'Metro Rides',
          billingModel: 'Hybrid',
          employeeCount: 95,
          monthlyTrips: 650,
          monthlySpend: 295000,
          performance: 92,
          contractStatus: 'Active'
        }
      ],
      alerts: [
        {
          id: 1,
          type: 'over_limit',
          title: 'Over-limit Usage Alert',
          message: 'Swift Transport exceeded package limits by 15% this month',
          severity: 'warning',
          vendor: 'Swift Transport'
        },
        {
          id: 2,
          type: 'cost_spike',
          title: 'Cost Spike Detected',
          message: 'Transportation costs increased by 8.5% compared to last month',
          severity: 'info',
          vendor: null
        },
        {
          id: 3,
          type: 'missing_data',
          title: 'Missing Trip Data',
          message: 'City Cabs has 12 trips with incomplete billing information',
          severity: 'error',
          vendor: 'City Cabs'
        }
      ]
    };
    setDashboardData(mockData);
  }, []);

  const summaryCards = [
    {
      title: 'Total Trips This Month',
      value: dashboardData.totalTrips?.toLocaleString() || '0',
      icon: Car,
      color: 'blue',
      trend: '+12.5%'
    },
    {
      title: 'Total Billing Amount',
      value: formatCurrency(dashboardData.totalBilling || 0),
      icon: DollarSign,
      color: 'green',
      trend: '+8.3%'
    },
    {
      title: 'Active Vendors',
      value: dashboardData.activeVendors,
      icon: Building2,
      color: 'purple',
      trend: 'No change'
    },
    {
      title: 'Total Employees',
      value: dashboardData.totalEmployees,
      icon: Users,
      color: 'orange',
      trend: '+2.1%'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 text-${card.color}-600`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-green-600 mt-1">
                  {card.trend} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts Widget */}
      {/* <AlertsWidget alerts={dashboardData.alerts} /> */}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Trips over time */}
        <Card>
          <CardHeader>
            <CardTitle>Trips Over Time</CardTitle>
            <CardDescription>
              Monthly trip volume trends over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CostTrendChart data={dashboardData.costTrends} />
          </CardContent>
        </Card>

        {/* Bar Chart - Vendor usage */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Usage Distribution</CardTitle>
            <CardDescription>
              Trip volume distribution across all vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VendorUsageChart data={dashboardData.vendorUsage} />
          </CardContent>
        </Card>

        {/* Pie Chart - Trip model vs package model usage */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Model Distribution</CardTitle>
            <CardDescription>
              Usage breakdown by billing model type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TripModelDistributionChart data={dashboardData.tripModelDistribution} />
          </CardContent>
        </Card>

        {/* Vendor Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Used Vendors</CardTitle>
            <CardDescription>
              Performance score and trip volume by top vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VendorPerformanceChart data={dashboardData.vendorPerformance} />
          </CardContent>
        </Card>
      </div>

      {/* Vendor-wise Trip Distribution Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor-wise Trip Distribution</CardTitle>
          <CardDescription>
            Detailed breakdown of trips and billing by vendor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendorComparisonTable vendors={dashboardData.vendors} />
        </CardContent>
      </Card>
    </div>
  );
}
